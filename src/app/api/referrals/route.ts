import { NextRequest, NextResponse } from 'next/server'
import { isSupabaseConfigured, createServiceClient, getUserFromRequest } from '@/lib/supabase/service'

// POST /api/referrals — create referral link for an offer
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { offer_id, custom_sub } = body

    if (!offer_id) {
      return NextResponse.json({ error: 'offer_id required' }, { status: 400 })
    }

    // Dev/demo mode
    if (!isSupabaseConfigured()) {
      const code = `dp_${crypto.randomUUID().replace(/-/g, '').slice(0, 10)}`
      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://partners.drops.agency'
      return NextResponse.json({
        link: { id: crypto.randomUUID(), code, offer_id, created_at: new Date().toISOString() },
        url: `${appUrl}/ref/${code}`,
        dev_mode: true,
      })
    }

    const user = await getUserFromRequest(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createServiceClient()

    // Verify offer is active
    const { data: offer } = await supabase
      .from('offers')
      .select('id, status')
      .eq('id', offer_id)
      .single()
    if (!offer || offer.status !== 'active') {
      return NextResponse.json({ error: 'Offer not found or not active' }, { status: 404 })
    }

    // Return existing link (idempotent)
    const { data: existing } = await supabase
      .from('referral_links')
      .select('id, code')
      .eq('partner_id', user.id)
      .eq('offer_id', offer_id)
      .single()

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://partners.drops.agency'

    if (existing) {
      return NextResponse.json({
        link: existing,
        url: `${appUrl}/ref/${existing.code}`,
        already_exists: true,
      })
    }

    const code = `dp_${crypto.randomUUID().replace(/-/g, '').slice(0, 10)}`
    const { data: link, error } = await supabase
      .from('referral_links')
      .insert({ partner_id: user.id, offer_id, code, custom_sub: custom_sub ?? null })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ link, url: `${appUrl}/ref/${link.code}` })
  } catch (err) {
    console.error('[referrals/POST] error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// GET /api/referrals — list partner's referral links
export async function GET(req: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ links: [] })
    }

    const user = await getUserFromRequest(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createServiceClient()
    const { data: links } = await supabase
      .from('referral_links')
      .select('*, offers(title, type, payout_amount, payout_percent, logo_url, categories(name, icon))')
      .eq('partner_id', user.id)
      .order('created_at', { ascending: false })

    return NextResponse.json({ links: links ?? [] })
  } catch (err) {
    console.error('[referrals/GET] error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
