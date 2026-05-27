import { NextRequest, NextResponse } from 'next/server'
import { isSupabaseConfigured, createServiceClient, getUserFromRequest } from '@/lib/supabase/service'

// GET /api/wallet — partner's balance + payout history + hold amount
export async function GET(req: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        balance: 0,
        pending_hold: 0,
        total_paid: 0,
        payouts: [],
        dev_mode: true,
      })
    }

    const user = await getUserFromRequest(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createServiceClient()

    const [profileRes, payoutsRes, holdRes] = await Promise.all([
      supabase
        .from('profiles')
        .select('balance, total_earned, total_paid')
        .eq('id', user.id)
        .single(),
      supabase
        .from('payouts')
        .select('*')
        .eq('partner_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50),
      // Sum of pending conversions still in hold
      supabase
        .from('conversions')
        .select('amount')
        .eq('partner_id', user.id)
        .eq('status', 'pending'),
    ])

    const profile = profileRes.data
    const payouts = payoutsRes.data ?? []
    const pendingHold = (holdRes.data ?? []).reduce((s, c) => s + (c.amount ?? 0), 0)

    return NextResponse.json({
      balance: profile?.balance ?? 0,
      total_earned: profile?.total_earned ?? 0,
      total_paid: profile?.total_paid ?? 0,
      pending_hold: pendingHold,
      payouts,
    })
  } catch (err) {
    console.error('[wallet/GET] error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// POST /api/wallet — withdrawal request (same logic as /api/payouts)
export async function POST(req: NextRequest) {
  // Delegate to the payouts handler
  const { POST: payoutsPost } = await import('@/app/api/payouts/route')
  return payoutsPost(req)
}
