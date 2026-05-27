import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest, isSupabaseConfigured, createServiceClient } from '@/lib/supabase/service'

const MOCK = {
  clicks: 1247, conversions: 38, cr: 3.05,
  earnings: 47600, pending: 12500, balance: 35100,
  clicksTrend: 12, convTrend: 8, earnTrend: 24,
  chartData: [
    { day: 'Пн', clicks: 180, conversions: 5, earnings: 7500 },
    { day: 'Вт', clicks: 210, conversions: 7, earnings: 10500 },
    { day: 'Ср', clicks: 175, conversions: 4, earnings: 6000 },
    { day: 'Чт', clicks: 230, conversions: 9, earnings: 13500 },
    { day: 'Пт', clicks: 198, conversions: 6, earnings: 9000 },
    { day: 'Сб', clicks: 154, conversions: 4, earnings: 6000 },
    { day: 'Вс', clicks: 100, conversions: 3, earnings: 4100 },
  ],
  recentEvents: [
    { id: '1', type: 'conversion', amount: 15000, status: 'pending', offer: 'Drops — Система', created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString() },
    { id: '2', type: 'conversion', amount: 3000, status: 'approved', offer: 'Drops — Лендинг', created_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString() },
    { id: '3', type: 'conversion', amount: 15000, status: 'paid', offer: 'Drops — Система', created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString() },
  ],
}

/** GET /api/dashboard/stats — partner 7-day stats */
export async function GET(req: NextRequest) {
  if (!isSupabaseConfigured()) return NextResponse.json(MOCK)

  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const supabase = createServiceClient()
    const now = Date.now()
    const sevenDaysAgo = new Date(now - 7 * 864e5).toISOString()
    const fourteenDaysAgo = new Date(now - 14 * 864e5).toISOString()

    // Run all queries concurrently
    const [profileRes, clicks7Res, convs7Res, holdRes, prevClicksRes, prevConvsRes, recentRes] =
      await Promise.all([
        supabase.from('profiles').select('balance, total_earned, total_paid').eq('id', user.id).single(),
        supabase.from('clicks').select('created_at').eq('partner_id', user.id).gte('created_at', sevenDaysAgo),
        supabase.from('conversions').select('created_at, payout_amount, status').eq('partner_id', user.id).gte('created_at', sevenDaysAgo),
        supabase.from('conversions').select('payout_amount').eq('partner_id', user.id).eq('status', 'pending'),
        supabase.from('clicks').select('id', { count: 'exact', head: true }).eq('partner_id', user.id).gte('created_at', fourteenDaysAgo).lt('created_at', sevenDaysAgo),
        supabase.from('conversions').select('payout_amount').eq('partner_id', user.id).gte('created_at', fourteenDaysAgo).lt('created_at', sevenDaysAgo).neq('status', 'rejected'),
        supabase.from('conversions').select('id, payout_amount, status, created_at, offers(title)').eq('partner_id', user.id).order('created_at', { ascending: false }).limit(5),
      ])

    const profile = profileRes.data
    const clicks7d = clicks7Res.data ?? []
    const convs7d = (convs7Res.data ?? []).filter((c: any) => c.status !== 'rejected')
    const holdConvs = holdRes.data ?? []

    const earnings7d = convs7d.reduce((s: number, c: any) => s + (c.payout_amount ?? 0), 0)
    const pending = holdConvs.reduce((s: number, c: any) => s + (c.payout_amount ?? 0), 0)

    const prevClickCount = prevClicksRes.count ?? 0
    const prevConvs = prevConvsRes.data ?? []
    const prevEarnings = prevConvs.reduce((s: number, c: any) => s + (c.payout_amount ?? 0), 0)

    const currClicks = clicks7d.length
    const currConvs = convs7d.length
    const prevConvCount = prevConvs.length

    const pct = (curr: number, prev: number) =>
      prev > 0 ? Math.round(((curr - prev) / prev) * 100) : 0

    const cr = currClicks > 0 ? Math.round((currConvs / currClicks) * 1000) / 10 : 0

    // Build per-day chart (last 7 days oldest → newest)
    const DAY_LABELS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
    const chartData = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(now - (6 - i) * 864e5)
      const dateStr = d.toISOString().slice(0, 10)
      const dayLabel = DAY_LABELS[d.getDay() === 0 ? 6 : d.getDay() - 1]
      const dc = clicks7d.filter((c: any) => c.created_at?.startsWith(dateStr)).length
      const dConvs = convs7d.filter((c: any) => c.created_at?.startsWith(dateStr))
      const de = dConvs.reduce((s: number, c: any) => s + (c.payout_amount ?? 0), 0)
      return { day: dayLabel, clicks: dc, conversions: dConvs.length, earnings: de }
    })

    const recentEvents = (recentRes.data ?? []).map((c: any) => ({
      id: c.id,
      type: 'conversion',
      amount: c.payout_amount,
      status: c.status,
      offer: (c.offers as any)?.title ?? 'Оффер',
      created_at: c.created_at,
    }))

    return NextResponse.json({
      clicks: currClicks,
      conversions: currConvs,
      cr,
      earnings: earnings7d,
      pending,
      balance: profile?.balance ?? 0,
      clicksTrend: pct(currClicks, prevClickCount),
      convTrend: pct(currConvs, prevConvCount),
      earnTrend: pct(earnings7d, prevEarnings),
      chartData,
      recentEvents,
    })
  } catch (e) {
    console.error('[dashboard/stats]', e)
    return NextResponse.json(MOCK) // silent fallback
  }
}
