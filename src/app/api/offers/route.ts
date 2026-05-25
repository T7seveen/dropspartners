import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const supabase = await createClient()
  let q = supabase.from('offers').select('*, categories(*)').eq('status', 'active')
    .order('is_top', { ascending: false }).order('clicks_count', { ascending: false })
  const cat = searchParams.get('category')
  const type = searchParams.get('type')
  const search = searchParams.get('search')
  if (cat) q = q.eq('category_id', parseInt(cat))
  if (type) q = q.eq('type', type)
  if (search) q = q.ilike('title', `%${search}%`)
  const { data, error } = await q
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ offers: data ?? [] })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const body = await req.json()
  if (!body.title || !body.slug || !body.type || !body.target_url)
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  const { data, error } = await supabase.from('offers').insert({
    ...body, status: 'draft',
    payout_amount: body.payout_amount ?? 0,
    payout_percent: body.payout_percent ?? 0,
    currency: body.currency ?? 'RUB',
    tags: body.tags ?? [], allowed_geos: body.allowed_geos ?? [],
    allowed_traffic: body.allowed_traffic ?? [],
    cookie_days: body.cookie_days ?? 30, hold_days: body.hold_days ?? 14,
    is_featured: body.is_featured ?? false, is_top: body.is_top ?? false,
  }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ offer: data }, { status: 201 })
}
