import { NextRequest, NextResponse } from 'next/server'
import { isSupabaseConfigured, createServiceClient, getUserFromRequest } from '@/lib/supabase/service'

async function requireAdmin(req: NextRequest) {
  if (!isSupabaseConfigured()) return { user: null, admin: true, supabase: null }
  const user = await getUserFromRequest(req)
  if (!user) return { user: null, admin: false, supabase: null }
  const supabase = createServiceClient()
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  const admin = profile?.role === 'admin'
  return { user, admin, supabase }
}

// GET /api/admin/payouts?status=pending
export async function GET(req: NextRequest) {
  const { admin, supabase } = await requireAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  if (!supabase) {
    // Dev mode mock
    return NextResponse.json({ payouts: [] })
  }

  const status = req.nextUrl.searchParams.get('status') ?? 'pending'
  const { data } = await supabase
    .from('payouts')
    .select('*, profiles(username, email, full_name, telegram_chat_id)')
    .eq('status', status)
    .order('created_at', { ascending: true })

  return NextResponse.json({ payouts: data ?? [] })
}

// PATCH /api/admin/payouts — approve or reject a payout
export async function PATCH(req: NextRequest) {
  const { admin, supabase } = await requireAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { payout_id, action, admin_note } = await req.json()
  if (!payout_id || !action) {
    return NextResponse.json({ error: 'payout_id and action required' }, { status: 400 })
  }

  // Dev mode
  if (!supabase) {
    return NextResponse.json({ success: true, dev_mode: true })
  }

  const { data: payout } = await supabase
    .from('payouts')
    .select('id, partner_id, amount, method, status')
    .eq('id', payout_id)
    .single()

  if (!payout) return NextResponse.json({ error: 'Payout not found' }, { status: 404 })
  if (payout.status !== 'pending') {
    return NextResponse.json({ error: `Payout is already ${payout.status}` }, { status: 400 })
  }

  if (action === 'approve') {
    // Use RPC to handle approve atomically (updates status, total_paid, notifications)
    await supabase.rpc('approve_payout', { p_payout_id: payout_id })

    // Telegram notification
    const { data: profile } = await supabase
      .from('profiles')
      .select('telegram_chat_id, full_name')
      .eq('id', payout.partner_id)
      .single()

    if (profile?.telegram_chat_id) {
      const { notifyPartnerPayoutApproved } = await import('@/lib/telegram')
      notifyPartnerPayoutApproved(profile.telegram_chat_id, payout.amount).catch(() => {})
    }

  } else if (action === 'reject') {
    // Use RPC to reject + refund balance
    await supabase.rpc('reject_payout', {
      p_payout_id: payout_id,
      p_note: admin_note ?? null,
    })

    // Telegram notification
    const { data: profile } = await supabase
      .from('profiles')
      .select('telegram_chat_id')
      .eq('id', payout.partner_id)
      .single()

    if (profile?.telegram_chat_id) {
      const { notifyPartnerPayoutRejected } = await import('@/lib/telegram')
      notifyPartnerPayoutRejected(profile.telegram_chat_id, payout.amount, admin_note).catch(() => {})
    }

  } else {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
