import { NextRequest, NextResponse } from 'next/server'
import { isSupabaseConfigured, createServiceClient } from '@/lib/supabase/service'

/**
 * POST /api/cron/release-holds
 *
 * Cron job endpoint — call daily (e.g. via Vercel Cron or an external scheduler).
 * Runs the `approve_held_conversions()` stored procedure which:
 *   - Finds all conversions where status = 'pending' AND hold_until <= NOW()
 *   - Sets their status = 'approved'
 *   - Calls increment_balance for each partner
 *
 * Secured by CRON_SECRET header (set this in your env + scheduler config).
 * Example cron schedule: 0 3 * * * (3:00 AM UTC daily)
 */
export async function POST(req: NextRequest) {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const secret = req.headers.get('x-cron-secret')
  const expected = process.env.CRON_SECRET
  if (expected && secret !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // ── Dev mode ──────────────────────────────────────────────────────────────
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ released: 0, dev: true, message: 'Supabase not configured' })
  }

  // ── Run RPC ───────────────────────────────────────────────────────────────
  try {
    const supabase = createServiceClient()

    const { data, error } = await supabase.rpc('approve_held_conversions')

    if (error) {
      console.error('[cron/release-holds] RPC error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const released = typeof data === 'number' ? data : 0
    console.log(`[cron/release-holds] Released ${released} held conversions`)

    return NextResponse.json({ ok: true, released })
  } catch (e) {
    console.error('[cron/release-holds] Unexpected error:', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

/**
 * GET /api/cron/release-holds
 * Health-check — returns the count of conversions currently in hold.
 */
export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret')
  const expected = process.env.CRON_SECRET
  if (expected && secret !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ pending: 0, ready_to_release: 0, dev: true })
  }

  try {
    const supabase = createServiceClient()
    const now = new Date().toISOString()

    const { count: pending } = await supabase
      .from('conversions')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending')

    const { count: ready } = await supabase
      .from('conversions')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending')
      .lte('hold_until', now)

    return NextResponse.json({ pending: pending ?? 0, ready_to_release: ready ?? 0 })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
