import { NextRequest, NextResponse } from 'next/server'
import { isSupabaseConfigured, createServiceClient, getUserFromRequest } from '@/lib/supabase/service'

const MIN_PAYOUT = 1000 // ₽

// POST /api/payouts — request a payout (manual, via Telegram)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { amount, method, details } = body

    if (!amount || !method || !details) {
      return NextResponse.json({ error: 'amount, method and details are required' }, { status: 400 })
    }
    if (Number(amount) < MIN_PAYOUT) {
      return NextResponse.json(
        { error: `Minimum payout is ${MIN_PAYOUT} ₽` },
        { status: 400 }
      )
    }

    // Dev/demo
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ success: true, dev_mode: true })
    }

    const user = await getUserFromRequest(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createServiceClient()

    // Check balance
    const { data: profile } = await supabase
      .from('profiles')
      .select('balance, full_name, username')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }
    if (profile.balance < Number(amount)) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 })
    }

    // Check no pending payout already exists
    const { data: pendingPayout } = await supabase
      .from('payouts')
      .select('id')
      .eq('partner_id', user.id)
      .eq('status', 'pending')
      .single()

    if (pendingPayout) {
      return NextResponse.json(
        { error: 'You already have a pending payout request' },
        { status: 400 }
      )
    }

    // Create payout request
    const { data: payout, error: payoutErr } = await supabase
      .from('payouts')
      .insert({ partner_id: user.id, amount: Number(amount), method, details, status: 'pending' })
      .select('id')
      .single()

    if (payoutErr) throw payoutErr

    // Deduct from balance (hold it while processing)
    await supabase.rpc('deduct_balance', {
      p_user_id: user.id,
      p_amount: Number(amount),
    })

    // In-app notification
    supabase
      .from('notifications')
      .insert({
        user_id: user.id,
        type: 'payout',
        title: 'Запрос на выплату принят',
        body: `${Number(amount).toLocaleString('ru')} ₽ через ${method} — обработка до 1 рабочего дня`,
        link: '/dashboard/wallet',
      })
      .then(() => {})

    // Admin Telegram notification
    try {
      const { notifyAdminPayoutRequest } = await import('@/lib/telegram')
      notifyAdminPayoutRequest(
        Number(amount),
        method,
        profile.username ?? profile.full_name ?? user.email ?? 'unknown'
      ).catch(() => {})
    } catch {}

    return NextResponse.json({ success: true, payout_id: payout?.id })
  } catch (err) {
    console.error('[payouts/POST] error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// GET /api/payouts — list partner's payouts
export async function GET(req: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ payouts: [] })
    }

    const user = await getUserFromRequest(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createServiceClient()
    const { data } = await supabase
      .from('payouts')
      .select('*')
      .eq('partner_id', user.id)
      .order('created_at', { ascending: false })

    return NextResponse.json({ payouts: data ?? [] })
  } catch (err) {
    console.error('[payouts/GET] error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
