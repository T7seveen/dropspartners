import { NextRequest, NextResponse } from 'next/server'

// POST /api/track/conversion
// Called by advertiser's system when a conversion happens
// Body: { click_id, offer_id, type, order_value?, external_id? }
export async function POST(req: NextRequest) {
  try {
    const apiKey = req.headers.get('x-api-key')
    
    // Validate API key
    if (!apiKey || apiKey !== process.env.CONVERSION_API_KEY) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
    }

    const body = await req.json()
    const { click_id, offer_id, type = 'sale', order_value, external_id } = body

    if (!click_id || !offer_id) {
      return NextResponse.json({ error: 'click_id and offer_id required' }, { status: 400 })
    }

    // In production:
    // const supabase = createServiceClient()
    
    // 1. Find the click
    // const { data: click } = await supabase
    //   .from('clicks')
    //   .select('*, referral_links(*, offers(type, payout_amount, payout_percent, hold_days))')
    //   .eq('click_id', click_id)
    //   .single()
    
    // if (!click) return NextResponse.json({ error: 'Click not found' }, { status: 404 })
    // if (click.converted) return NextResponse.json({ error: 'Already converted' }, { status: 409 })

    // 2. Calculate payout
    // const offer = click.referral_links.offers
    // let amount = offer.payout_amount
    // if (offer.type === 'revshare' || offer.type === 'dropship') {
    //   amount = (order_value ?? 0) * (offer.payout_percent / 100)
    // }

    // 3. Calculate hold date
    // const holdDays = offer.hold_days ?? 14
    // const holdUntil = new Date(Date.now() + holdDays * 24 * 60 * 60 * 1000).toISOString()

    // 4. Insert conversion
    // await supabase.from('conversions').insert({
    //   click_id: click.id,
    //   ref_link_id: click.ref_link_id,
    //   partner_id: click.partner_id,
    //   offer_id,
    //   type,
    //   amount,
    //   order_value: order_value ?? null,
    //   status: 'pending',
    //   hold_until: holdUntil,
    //   external_id: external_id ?? null,
    // })

    // 5. Mark click as converted
    // await supabase.from('clicks').update({ converted: true }).eq('id', click.id)

    // 6. Update counters
    // await supabase.rpc('increment_conversions', { link_id: click.ref_link_id })

    // 7. Create notification for partner
    // await supabase.from('notifications').insert({
    //   user_id: click.partner_id,
    //   type: 'conversion',
    //   title: 'Новая конверсия!',
    //   body: `+${amount}₽ ожидает подтверждения (холд ${holdDays} дней)`,
    // })

    console.log(`Conversion logged: click_id=${click_id}, offer=${offer_id}, type=${type}`)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Conversion recorded',
      // amount, hold_until: holdUntil
    })
  } catch (err) {
    console.error('Conversion error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
