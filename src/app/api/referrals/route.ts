import { NextRequest, NextResponse } from 'next/server'

// POST /api/referrals — create referral link for an offer
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { offer_id, custom_sub } = body

    if (!offer_id) {
      return NextResponse.json({ error: 'offer_id required' }, { status: 400 })
    }

    // In production:
    // const supabase = createServiceClient()
    // const { data: { user } } = await supabase.auth.getUser()
    // if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Check offer exists and is active
    // const { data: offer } = await supabase.from('offers').select('id,status').eq('id',offer_id).single()
    // if (!offer || offer.status !== 'active') return NextResponse.json({ error: 'Offer not found' }, { status: 404 })

    // Check if link already exists
    // const { data: existing } = await supabase.from('referral_links').select('*').eq('partner_id', user.id).eq('offer_id', offer_id).single()
    // if (existing) return NextResponse.json({ link: existing })

    // Create new link
    const code = `dp_${Math.random().toString(36).substr(2, 10)}`
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://partners.drops.agency'

    // const { data: link, error } = await supabase.from('referral_links').insert({
    //   partner_id: user.id,
    //   offer_id,
    //   code,
    //   custom_sub: custom_sub ?? null,
    // }).select().single()

    // Mock response for development
    const link = {
      id: crypto.randomUUID(),
      code,
      url: `${appUrl}/ref/${code}`,
      offer_id,
      created_at: new Date().toISOString(),
    }

    return NextResponse.json({ link, url: `${appUrl}/ref/${code}` })
  } catch (err) {
    console.error('Create referral error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// GET /api/referrals — list partner's links
export async function GET(req: NextRequest) {
  try {
    // const supabase = createServiceClient()
    // const { data: { user } } = await supabase.auth.getUser()
    // if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // const { data: links } = await supabase
    //   .from('referral_links')
    //   .select('*, offers(title, type, payout_amount, payout_percent, logo_url)')
    //   .eq('partner_id', user.id)
    //   .order('created_at', { ascending: false })

    return NextResponse.json({ links: [] })
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
