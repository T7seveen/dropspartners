import { NextRequest, NextResponse } from 'next/server'
import { isSupabaseConfigured, createServiceClient, getUserFromRequest } from '@/lib/supabase/service'

// Gambling / restricted offer tags (no casino, betting, adult)
const FORBIDDEN_TAGS = [
  'казино', 'casino', 'gambling', 'гемблинг', 'ставки', 'букмекер',
  'poker', 'покер', 'рулетка', 'roulette', 'adult', 'эротика',
]

// Allowed geos: RF + CIS minus Ukraine
const ALLOWED_GEO_CODES = ['RU', 'BY', 'KZ', 'AM', 'AZ', 'GE', 'KG', 'MD', 'TJ', 'TM', 'UZ']

// POST /api/offers/[id]/take
// Creates (or returns existing) referral link for the current partner.
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: offerId } = await params

  // Dev/demo mode — return a mock link
  if (!isSupabaseConfigured()) {
    const code = `dp_${crypto.randomUUID().replace(/-/g, '').slice(0, 10)}`
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://partners.drops.agency'
    return NextResponse.json({
      success: true,
      code,
      url: `${appUrl}/ref/${code}`,
      dev_mode: true,
    })
  }

  // Auth: require logged-in partner
  const user = await getUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = createServiceClient()

    // Fetch offer
    const { data: offer } = await supabase
      .from('offers')
      .select('id, status, title, tags, allowed_geos, type')
      .eq('id', offerId)
      .single()

    if (!offer || offer.status !== 'active') {
      return NextResponse.json({ error: 'Offer not found or not active' }, { status: 404 })
    }

    // Gambling / restricted check
    const tags: string[] = offer.tags ?? []
    const hasForbidden = tags.some((tag) =>
      FORBIDDEN_TAGS.some((f) => tag.toLowerCase().includes(f))
    )
    if (hasForbidden) {
      return NextResponse.json(
        { error: 'This offer type is not permitted on this platform' },
        { status: 403 }
      )
    }

    // Partner profile check (must not be suspended)
    const { data: profile } = await supabase
      .from('profiles')
      .select('status, role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.status === 'suspended') {
      return NextResponse.json({ error: 'Account suspended' }, { status: 403 })
    }

    // Return existing link if already taken
    const { data: existing } = await supabase
      .from('referral_links')
      .select('id, code')
      .eq('partner_id', user.id)
      .eq('offer_id', offerId)
      .single()

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://partners.drops.agency'

    if (existing) {
      return NextResponse.json({
        success: true,
        code: existing.code,
        url: `${appUrl}/ref/${existing.code}`,
        already_exists: true,
      })
    }

    // Create new referral link
    const code = `dp_${crypto.randomUUID().replace(/-/g, '').slice(0, 10)}`
    const { data: link, error } = await supabase
      .from('referral_links')
      .insert({ partner_id: user.id, offer_id: offerId, code })
      .select('id, code')
      .single()

    if (error) {
      // Race condition: someone else just created it — retry fetch
      const { data: race } = await supabase
        .from('referral_links')
        .select('id, code')
        .eq('partner_id', user.id)
        .eq('offer_id', offerId)
        .single()
      if (race) {
        return NextResponse.json({
          success: true,
          code: race.code,
          url: `${appUrl}/ref/${race.code}`,
          already_exists: true,
        })
      }
      throw error
    }

    return NextResponse.json({
      success: true,
      code: link.code,
      url: `${appUrl}/ref/${link.code}`,
    })
  } catch (err) {
    console.error('[take-offer] error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
