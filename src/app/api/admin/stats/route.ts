import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const since7 = new Date(Date.now() - 7 * 86400000).toISOString()
  const [partners, clicks7, convs7, paidPayouts, pendingPayouts] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'partner'),
    supabase.from('clicks').select('id', { count: 'exact' }).gte('created_at', since7),
    supabase.from('conversions').select('amount').gte('created_at', since7),
    supabase.from('payouts').select('amount').eq('status', 'paid'),
    supabase.from('payouts').select('id', { count: 'exact' }).eq('status', 'pending'),
  ])

  return NextResponse.json({
    partners: partners.count ?? 0,
    clicks7d: clicks7.count ?? 0,
    conversions7d: convs7.data?.length ?? 0,
    totalPaid: paidPayouts.data?.reduce((s, p) => s + p.amount, 0) ?? 0,
    pendingPayouts: pendingPayouts.count ?? 0,
  })
}
