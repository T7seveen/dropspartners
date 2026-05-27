import { NextRequest, NextResponse } from 'next/server'
import { isSupabaseConfigured, createServiceClient } from '@/lib/supabase/service'

// POST /api/auth/link-referrer
// Called after signup to link referred_by based on ref_code
export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true })
  }

  try {
    const { user_id, ref_code } = await req.json()
    if (!user_id || !ref_code) {
      return NextResponse.json({ ok: false }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Find referrer by ref_code
    const { data: referrer } = await supabase
      .from('profiles')
      .select('id')
      .eq('ref_code', ref_code)
      .single()

    if (!referrer || referrer.id === user_id) {
      return NextResponse.json({ ok: false, error: 'Referrer not found' })
    }

    // Set referred_by on new user's profile
    await supabase
      .from('profiles')
      .update({ referred_by: referrer.id })
      .eq('id', user_id)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[link-referrer] error:', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
