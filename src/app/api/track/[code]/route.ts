import { NextRequest, NextResponse } from 'next/server'
import { isSupabaseConfigured, createServiceClient } from '@/lib/supabase/service'

// GET /api/track/[code] — redirect + log click
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params
  const ua = req.headers.get('user-agent') ?? ''
  const referer = req.headers.get('referer') ?? ''
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    ''

  // Dev/demo fallback
  if (!isSupabaseConfigured()) {
    const response = NextResponse.redirect(new URL('/', req.url))
    response.cookies.set('dp_click', crypto.randomUUID(), {
      maxAge: 30 * 24 * 60 * 60,
      httpOnly: true,
      sameSite: 'lax',
    })
    return response
  }

  try {
    const supabase = createServiceClient()

    // 1. Find the referral link and its offer
    const { data: link } = await supabase
      .from('referral_links')
      .select('id, partner_id, offer_id, offers!inner(target_url, status, title, hold_days)')
      .eq('code', code)
      .eq('is_active', true)
      .single()

    const offer = link ? (link.offers as any) : null
    if (!link || offer?.status !== 'active') {
      return NextResponse.redirect(new URL('/', req.url))
    }

    // 2. Parse device / browser
    const device = /Mobile|Android|iPhone/i.test(ua)
      ? 'mobile'
      : /Tablet|iPad/i.test(ua)
      ? 'tablet'
      : 'desktop'
    const browser = /Edg/i.test(ua)
      ? 'Edge'
      : /Chrome/i.test(ua)
      ? 'Chrome'
      : /Firefox/i.test(ua)
      ? 'Firefox'
      : /Safari/i.test(ua)
      ? 'Safari'
      : 'Other'

    const clickId = crypto.randomUUID()

    // 3. Log click (fire-and-forget — don't block redirect)
    supabase
      .from('clicks')
      .insert({
        ref_link_id: link.id,
        partner_id: link.partner_id,
        offer_id: link.offer_id,
        ip,
        device,
        browser,
        referer,
        click_id: clickId,
        sub1: req.nextUrl.searchParams.get('sub1') ?? null,
        sub2: req.nextUrl.searchParams.get('sub2') ?? null,
        sub3: req.nextUrl.searchParams.get('sub3') ?? null,
      })
      .then(() => {})

    // 4. Increment link + offer click counters
    supabase
      .rpc('increment_clicks', { p_link_id: link.id, p_offer_id: link.offer_id })
      .then(() => {})

    // 5. Build target URL with click_id param + set cookie
    let targetUrl: string
    try {
      const u = new URL(offer.target_url)
      u.searchParams.set('dp_click', clickId)
      targetUrl = u.toString()
    } catch {
      targetUrl = offer.target_url
    }

    const response = NextResponse.redirect(targetUrl)
    response.cookies.set('dp_click', clickId, {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      httpOnly: true,
      sameSite: 'lax',
    })

    return response
  } catch (err) {
    console.error('[track] error:', err)
    return NextResponse.redirect(new URL('/', req.url))
  }
}
