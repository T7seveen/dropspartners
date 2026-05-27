import { NextRequest, NextResponse } from 'next/server'
import { handleBotUpdate, TelegramUpdate } from '@/lib/telegram'

// POST /api/telegram/webhook
// Set this URL in Telegram BotFather via setWebhook:
//   https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://your-domain.com/api/telegram/webhook
export async function POST(req: NextRequest) {
  try {
    // Verify secret token to prevent spoofing
    const secretToken = req.headers.get('x-telegram-bot-api-secret-token')
    const expectedToken = process.env.TELEGRAM_WEBHOOK_SECRET
    if (expectedToken && secretToken !== expectedToken) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const update: TelegramUpdate = await req.json()
    await handleBotUpdate(update)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[telegram/webhook] error:', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
