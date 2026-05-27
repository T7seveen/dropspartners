import { NextRequest, NextResponse } from 'next/server'
import { isSupabaseConfigured, createServiceClient, getUserFromRequest } from '@/lib/supabase/service'
import { nanoid } from 'nanoid'

// POST /api/profile/telegram-link
// Generate a one-time deep-link token for Telegram bot account linking
export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      link: `https://t.me/DropsPartnersBot?start=link_demo_token`,
      dev_mode: true,
    })
  }

  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createServiceClient()
  const botUsername = process.env.TELEGRAM_BOT_USERNAME ?? 'DropsPartnersBot'

  // Invalidate old unused tokens for this user
  await supabase
    .from('telegram_links')
    .update({ used: true })
    .eq('user_id', user.id)
    .eq('used', false)

  // Create new token (15-min expiry)
  const token = nanoid(32)
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString()

  const { error } = await supabase.from('telegram_links').insert({
    user_id: user.id,
    token,
    expires_at: expiresAt,
  })

  if (error) {
    return NextResponse.json({ error: 'Failed to create link' }, { status: 500 })
  }

  return NextResponse.json({
    link: `https://t.me/${botUsername}?start=link_${token}`,
    expires_in: 900, // 15 minutes
  })
}

// DELETE /api/profile/telegram-link — unlink Telegram
export async function DELETE(req: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ success: true, dev_mode: true })
  }

  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createServiceClient()
  await supabase
    .from('profiles')
    .update({ telegram_chat_id: null })
    .eq('id', user.id)

  return NextResponse.json({ success: true })
}
