import { createClient } from './supabase/server'
import type { Profile, Offer, ReferralLink, Conversion, Payout, DashboardStats } from '@/types'

// ── PROFILE ────────────────────────────────────────────────────
export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
  return data
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  const supabase = await createClient()
  return supabase.from('profiles').update(updates).eq('id', userId)
}

// ── OFFERS ────────────────────────────────────────────────────
export async function getOffers(filters?: {
  category?: number
  type?: string
  search?: string
  featured?: boolean
}) {
  const supabase = await createClient()
  let q = supabase
    .from('offers')
    .select('*, categories(*)')
    .eq('status', 'active')
    .order('is_top', { ascending: false })
    .order('clicks_count', { ascending: false })

  if (filters?.category) q = q.eq('category_id', filters.category)
  if (filters?.type) q = q.eq('type', filters.type)
  if (filters?.search) q = q.ilike('title', `%${filters.search}%`)
  if (filters?.featured) q = q.eq('is_featured', true)

  const { data } = await q
  return data as Offer[]
}

export async function getOffer(slug: string): Promise<Offer | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('offers')
    .select('*, categories(*)')
    .eq('slug', slug)
    .eq('status', 'active')
    .single()
  return data
}

// ── REFERRAL LINKS ────────────────────────────────────────────
export async function getPartnerLinks(partnerId: string): Promise<ReferralLink[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('referral_links')
    .select('*, offers(title, type, payout_amount, payout_percent, logo_url, categories(name, icon))')
    .eq('partner_id', partnerId)
    .order('created_at', { ascending: false })
  return data ?? []
}

export async function createReferralLink(partnerId: string, offerId: string) {
  const supabase = await createClient()
  const code = `dp_${Math.random().toString(36).substr(2, 10)}`
  const { data, error } = await supabase
    .from('referral_links')
    .upsert({ partner_id: partnerId, offer_id: offerId, code }, { onConflict: 'partner_id,offer_id' })
    .select()
    .single()
  return { data, error, code }
}

// ── CONVERSIONS ───────────────────────────────────────────────
export async function getPartnerConversions(partnerId: string, limit = 50) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('conversions')
    .select('*, offers(title, logo_url)')
    .eq('partner_id', partnerId)
    .order('created_at', { ascending: false })
    .limit(limit)
  return data as Conversion[]
}

// ── PAYOUTS ───────────────────────────────────────────────────
export async function getPartnerPayouts(partnerId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('payouts')
    .select('*')
    .eq('partner_id', partnerId)
    .order('created_at', { ascending: false })
  return data as Payout[]
}

export async function createPayout(partnerId: string, amount: number, method: string, details: string) {
  const supabase = await createClient()
  return supabase.from('payouts').insert({
    partner_id: partnerId, amount, method, details, status: 'pending'
  }).select().single()
}

// ── DASHBOARD STATS ───────────────────────────────────────────
export async function getDashboardStats(partnerId: string, days = 7): Promise<DashboardStats> {
  const supabase = await createClient()
  const since = new Date(Date.now() - days * 86400000).toISOString()

  const [clicksRes, conversionsRes, profileRes] = await Promise.all([
    supabase.from('clicks').select('id', { count: 'exact' })
      .eq('partner_id', partnerId).gte('created_at', since),
    supabase.from('conversions').select('amount, status, offer_id, offers(title)')
      .eq('partner_id', partnerId).gte('created_at', since),
    supabase.from('profiles').select('balance').eq('id', partnerId).single(),
  ])

  const clicks = clicksRes.count ?? 0
  const convs = conversionsRes.data ?? []
  const conversions = convs.length
  const earnings = convs.filter(c => c.status !== 'rejected').reduce((s, c) => s + (c.amount ?? 0), 0)
  const pending = convs.filter(c => c.status === 'pending').reduce((s, c) => s + (c.amount ?? 0), 0)
  const cr = clicks > 0 ? parseFloat(((conversions / clicks) * 100).toFixed(2)) : 0
  const balance = profileRes.data?.balance ?? 0

  const offerCounts = convs.reduce((acc: Record<string, number>, c) => {
    const name = (c.offers as any)?.title ?? c.offer_id
    acc[name] = (acc[name] ?? 0) + 1
    return acc
  }, {})
  const topOffer = Object.entries(offerCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null

  return { clicks, conversions, cr, earnings, pending, balance, topOffer }
}

export async function getClicksTimeSeries(partnerId: string, days = 7) {
  const supabase = await createClient()
  const since = new Date(Date.now() - days * 86400000).toISOString()
  const { data: clicks } = await supabase
    .from('clicks').select('created_at').eq('partner_id', partnerId).gte('created_at', since)
  const { data: convs } = await supabase
    .from('conversions').select('created_at, amount').eq('partner_id', partnerId).gte('created_at', since)

  const byDay: Record<string, { clicks: number; conversions: number; earnings: number }> = {}
  const now = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    byDay[d.toISOString().split('T')[0]] = { clicks: 0, conversions: 0, earnings: 0 }
  }
  clicks?.forEach(c => {
    const k = c.created_at.split('T')[0]
    if (byDay[k]) byDay[k].clicks++
  })
  convs?.forEach(c => {
    const k = c.created_at.split('T')[0]
    if (byDay[k]) { byDay[k].conversions++; byDay[k].earnings += c.amount ?? 0 }
  })
  return Object.entries(byDay).map(([date, v]) => ({ date, ...v }))
}

// ── ADMIN ─────────────────────────────────────────────────────
export async function adminGetStats() {
  const supabase = await createClient()
  const since7 = new Date(Date.now() - 7 * 86400000).toISOString()
  const [partners, clicks7, convs7, payouts] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'partner'),
    supabase.from('clicks').select('id', { count: 'exact' }).gte('created_at', since7),
    supabase.from('conversions').select('amount').gte('created_at', since7),
    supabase.from('payouts').select('amount').eq('status', 'paid'),
  ])
  return {
    partners: partners.count ?? 0,
    clicks7d: clicks7.count ?? 0,
    conversions7d: convs7.data?.length ?? 0,
    totalPaid: payouts.data?.reduce((s, p) => s + p.amount, 0) ?? 0,
  }
}

export async function adminGetPendingPayouts() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('payouts')
    .select('*, profiles(username, email)')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
  return data ?? []
}

export async function adminApproveConversions(partnerId: string) {
  const supabase = await createClient()
  const now = new Date().toISOString()
  const { data: convs } = await supabase
    .from('conversions')
    .select('id, amount')
    .eq('partner_id', partnerId)
    .eq('status', 'pending')
    .lte('hold_until', now)
  if (!convs?.length) return
  const total = convs.reduce((s, c) => s + c.amount, 0)
  await supabase.from('conversions')
    .update({ status: 'approved' })
    .in('id', convs.map(c => c.id))
  await supabase.rpc('increment_balance', { user_id: partnerId, amount: total })
}
