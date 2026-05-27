import { NextRequest, NextResponse } from 'next/server'
import { isSupabaseConfigured, createServiceClient } from '@/lib/supabase/service'

// ── Local types for untyped Supabase joins ────────────────────────
interface ClickRow {
  id: string
  ref_link_id: string
  partner_id: string
  offer_id: string
  converted: boolean
  referral_links: {
    offers: {
      type: string
      payout_amount: number
      payout_percent: number
      hold_days: number
      title: string
    } | null
  } | null
}

interface ProfileRow {
  telegram_chat_id: string | null
  full_name: string | null
}

/**
 * Shared conversion webhook logic.
 * Called by both /api/track/conversion and /api/webhooks/conversion.
 *
 * Headers required:
 *   x-api-key: <CONVERSION_API_KEY from env>
 *
 * Body (JSON):
 *   click_id      — UUID from the dp_click cookie / query param (required)
 *   offer_id      — UUID of the offer (required)
 *   type          — 'sale' | 'lead' | 'install' (default: 'sale')
 *   order_value   — numeric sale value (used for revshare/cps payout calc)
 *   external_id   — advertiser's own order ID (for dedup)
 */
export async function processConversion(req: NextRequest): Promise<NextResponse> {
  try {
    // ── 1. Auth ──────────────────────────────────────────────────
    const apiKey = req.headers.get('x-api-key')
    if (!apiKey || apiKey !== process.env.CONVERSION_API_KEY) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
    }

    // ── 2. Parse body ────────────────────────────────────────────
    let body: Record<string, unknown>
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const { click_id, offer_id, type = 'sale', order_value, external_id } = body as {
      click_id?: string
      offer_id?: string
      type?: string
      order_value?: number
      external_id?: string
    }

    if (!click_id || !offer_id) {
      return NextResponse.json({ error: 'click_id and offer_id are required' }, { status: 400 })
    }

    // ── 3. Dev/demo mode ─────────────────────────────────────────
    if (!isSupabaseConfigured()) {
      console.log(`[conversion/dev] click_id=${click_id} offer=${offer_id} type=${type}`)
      return NextResponse.json({ success: true, dev_mode: true })
    }

    const supabase = createServiceClient()

    // ── 4. Find click ────────────────────────────────────────────
    const clickRes = await supabase
      .from('clicks')
      .select(
        'id, ref_link_id, partner_id, offer_id, converted, ' +
        'referral_links(offers(type, payout_amount, payout_percent, hold_days, title))'
      )
      .eq('click_id', click_id)
      .single()
    const click = clickRes.data as unknown as ClickRow | null

    if (!click) {
      return NextResponse.json({ error: 'Click not found' }, { status: 404 })
    }
    if (click.converted) {
      return NextResponse.json({ error: 'Already converted' }, { status: 409 })
    }

    // Dedup by external_id
    if (external_id) {
      const { data: existing } = await supabase
        .from('conversions')
        .select('id')
        .eq('external_id', external_id)
        .single()
      if (existing) {
        return NextResponse.json({ error: 'Duplicate external_id' }, { status: 409 })
      }
    }

    // ── 5. Calculate payout ──────────────────────────────────────
    const offer = click.referral_links?.offers ?? null

    let amount = offer?.payout_amount ?? 0
    if (offer && (offer.type === 'revshare' || offer.type === 'cps') && order_value) {
      amount = order_value * ((offer.payout_percent ?? 0) / 100)
    }
    amount = Math.round(amount * 100) / 100

    // ── 6. Hold date ─────────────────────────────────────────────
    const holdDays = offer?.hold_days ?? 14
    const holdUntil = new Date(Date.now() + holdDays * 24 * 60 * 60 * 1000).toISOString()

    // ── 7. Insert conversion ─────────────────────────────────────
    const { data: conversion, error: convErr } = await supabase
      .from('conversions')
      .insert({
        click_id: click.id,
        ref_link_id: click.ref_link_id,
        partner_id: click.partner_id,
        offer_id,
        type,
        amount,
        order_value: order_value ?? null,
        status: 'pending',
        hold_until: holdUntil,
        external_id: external_id ?? null,
      })
      .select('id')
      .single()

    if (convErr) {
      console.error('[conversion] insert error:', convErr)
      return NextResponse.json({ error: 'DB error' }, { status: 500 })
    }

    // ── 8. Mark click as converted ───────────────────────────────
    await supabase.from('clicks').update({ converted: true }).eq('id', click.id)

    // ── 9. Update referral link stats ────────────────────────────
    supabase
      .rpc('increment_conversions', {
        p_link_id: click.ref_link_id,
        p_offer_id: offer_id,
        p_amount: amount,
      })
      .then(() => {})

    // ── 10. Notify partner in-app + Telegram ─────────────────────
    supabase
      .from('notifications')
      .insert({
        user_id: click.partner_id,
        type: 'conversion',
        title: 'Новая конверсия!',
        body: `+${amount.toLocaleString('ru')} ₽ в ожидании (холд ${holdDays} дней)`,
        link: '/dashboard/stats',
      })
      .then(() => {})

    // Telegram notification (fire-and-forget)
    try {
      const profileRes = await supabase
        .from('profiles')
        .select('telegram_chat_id, full_name')
        .eq('id', click.partner_id)
        .single()
      const profile = profileRes.data as unknown as ProfileRow | null

      if (profile?.telegram_chat_id) {
        const { notifyPartnerConversion } = await import('@/lib/telegram')
        notifyPartnerConversion(
          profile.telegram_chat_id,
          amount,
          offer?.title ?? offer_id,
          holdDays
        ).catch(() => {})
      }
    } catch {}

    return NextResponse.json({
      success: true,
      conversion_id: conversion?.id,
      amount,
      hold_until: holdUntil,
    })
  } catch (err) {
    console.error('[conversion] error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
