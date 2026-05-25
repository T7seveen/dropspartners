import { NextRequest, NextResponse } from 'next/server'

// GET /api/track/[code] — redirect + log click
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  const { code } = await context.params
  const ua = req.headers.get('user-agent') ?? ''
  const referer = req.headers.get('referer') ?? ''
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? req.headers.get('x-real-ip') ?? ''

  try {
    // In production: replace with actual Supabase service role client
    // const supabase = createServiceClient()
    
    // 1. Find the referral link
    // const { data: link } = await supabase
    //   .from('referral_links')
    //   .select('*, offers(target_url, status)')
    //   .eq('code', code)
    //   .eq('is_active', true)
    //   .single()
    
    // if (!link || link.offers.status !== 'active') {
    //   return NextResponse.redirect(new URL('/', req.url))
    // }

    // 2. Parse device/browser
    const device = /Mobile|Android|iPhone|iPad/i.test(ua) ? 'mobile'
                 : /Tablet|iPad/i.test(ua) ? 'tablet' : 'desktop'
    const browser = /Chrome/i.test(ua) ? 'Chrome'
                  : /Firefox/i.test(ua) ? 'Firefox'
                  : /Safari/i.test(ua) ? 'Safari'
                  : /Edge/i.test(ua) ? 'Edge' : 'Other'

    const clickId = crypto.randomUUID()

    // 3. Log click
    // await supabase.from('clicks').insert({
    //   ref_link_id: link.id,
    //   partner_id: link.partner_id,
    //   offer_id: link.offer_id,
    //   ip, device, browser, referer,
    //   click_id: clickId,
    //   sub1: req.nextUrl.searchParams.get('sub1') ?? null,
    //   sub2: req.nextUrl.searchParams.get('sub2') ?? null,
    // })

    // 4. Increment click counter
    // await supabase.rpc('increment_clicks', { link_id: link.id, offer_id: link.offer_id })

    // 5. Redirect to offer target with click_id cookie
    const targetUrl = `https://drops.agency?ref=${clickId}` // replace with link.offers.target_url
    
    const response = NextResponse.redirect(targetUrl)
    response.cookies.set('dp_click', clickId, {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      httpOnly: true,
      sameSite: 'lax',
    })
    
    return response
  } catch (err) {
    console.error('Track error:', err)
    return NextResponse.redirect(new URL('/', req.url))
  }
}
