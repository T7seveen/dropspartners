import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const status = req.nextUrl.searchParams.get('status') ?? 'pending'
  const { data } = await supabase
    .from('payouts')
    .select('*, profiles(username, email, telegram)')
    .eq('status', status)
    .order('created_at', { ascending: true })

  return NextResponse.json({ payouts: data ?? [] })
}

export async function PATCH(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { payout_id, action, admin_note } = await req.json()
  if (!payout_id || !action) return NextResponse.json({ error: 'Missing payout_id or action' }, { status: 400 })

  const { data: payout } = await supabase.from('payouts').select('*').eq('id', payout_id).single()
  if (!payout) return NextResponse.json({ error: 'Payout not found' }, { status: 404 })

  if (action === 'approve') {
    await supabase.from('payouts').update({ status: 'paid', paid_at: new Date().toISOString(), admin_note })
      .eq('id', payout_id)
    // Deduct from balance
    await supabase.from('profiles').update({
      balance: supabase.rpc('decrement_balance', { user_id: payout.partner_id, amount: payout.amount })
    }).eq('id', payout.partner_id)
    // Notify partner
    await supabase.from('notifications').insert({
      user_id: payout.partner_id,
      type: 'payout',
      title: 'Выплата одобрена!',
      body: `Ваш запрос на ${payout.amount} ₽ одобрен и отправлен.`,
    })
  } else if (action === 'reject') {
    await supabase.from('payouts').update({ status: 'rejected', admin_note }).eq('id', payout_id)
    // Return to balance
    await supabase.rpc('increment_balance', { user_id: payout.partner_id, amount: payout.amount })
    await supabase.from('notifications').insert({
      user_id: payout.partner_id,
      type: 'payout',
      title: 'Выплата отклонена',
      body: admin_note ?? 'Ваш запрос на выплату отклонён.',
    })
  }

  return NextResponse.json({ success: true })
}
