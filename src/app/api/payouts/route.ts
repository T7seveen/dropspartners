import { NextRequest, NextResponse } from 'next/server'

// POST /api/payouts — request a payout
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { amount, method, details } = body

    if (!amount || !method || !details) {
      return NextResponse.json({ error: 'amount, method, details required' }, { status: 400 })
    }
    if (Number(amount) < 2000) {
      return NextResponse.json({ error: 'Minimum payout 2000 RUB' }, { status: 400 })
    }

    // In production:
    // const supabase = createServiceClient()
    // const { data: { user } } = await supabase.auth.getUser()
    // if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Check balance
    // const { data: profile } = await supabase.from('profiles').select('balance').eq('id', user.id).single()
    // if (!profile || profile.balance < amount) return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 })

    // Create payout request
    // const { data: payout } = await supabase.from('payouts').insert({
    //   partner_id: user.id, amount, method, details, status: 'pending'
    // }).select().single()

    // Deduct from balance (hold)
    // await supabase.rpc('deduct_balance', { user_id: user.id, amount })

    // Notify admin
    // await supabase.from('notifications').insert({
    //   user_id: user.id, type: 'payout',
    //   title: 'Запрос выплаты отправлен',
    //   body: `${amount}₽ через ${method} — обработка в течение 1 рабочего дня`
    // })

    return NextResponse.json({ success: true, message: 'Payout request created' })
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// GET /api/payouts — list partner's payouts
export async function GET(req: NextRequest) {
  try {
    // const supabase = createServiceClient()
    // const { data: { user } } = await supabase.auth.getUser()
    // if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // const { data } = await supabase.from('payouts').select('*').eq('partner_id', user.id).order('created_at', { ascending: false })
    return NextResponse.json({ payouts: [] })
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
