/**
 * Telegram Bot API helper — fetch-based, no external library needed.
 * Set env vars: TELEGRAM_BOT_TOKEN, TELEGRAM_ADMIN_CHAT_ID
 */

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID

async function sendMessage(
  chatId: string | number,
  text: string,
  parseMode: 'HTML' | 'Markdown' = 'HTML'
): Promise<boolean> {
  if (!BOT_TOKEN || !chatId) return false
  try {
    const res = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: parseMode }),
        // 5s timeout
        signal: AbortSignal.timeout(5000),
      }
    )
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      console.warn('[Telegram] sendMessage failed:', err)
    }
    return res.ok
  } catch (err) {
    console.warn('[Telegram] sendMessage error:', err)
    return false
  }
}

// ── ADMIN NOTIFICATIONS ────────────────────────────────────────────

export async function notifyAdminNewConversion(
  amount: number,
  offerTitle: string,
  partnerName: string
) {
  if (!ADMIN_CHAT_ID) return
  await sendMessage(
    ADMIN_CHAT_ID,
    `🎯 <b>Новая конверсия</b>\n` +
    `💰 Сумма: <b>${amount.toLocaleString('ru')} ₽</b>\n` +
    `📦 Оффер: ${offerTitle}\n` +
    `👤 Партнёр: ${partnerName}`
  )
}

export async function notifyAdminPayoutRequest(
  amount: number,
  method: string,
  partnerName: string
) {
  if (!ADMIN_CHAT_ID) return
  await sendMessage(
    ADMIN_CHAT_ID,
    `💳 <b>Запрос на выплату</b>\n` +
    `💰 Сумма: <b>${amount.toLocaleString('ru')} ₽</b>\n` +
    `📤 Метод: ${method}\n` +
    `👤 Партнёр: ${partnerName}\n\n` +
    `Перейдите в <a href="https://partners.drops.agency/admin/payouts">панель админа</a> для обработки.`
  )
}

export async function notifyAdminNewPartner(email: string, fullName: string) {
  if (!ADMIN_CHAT_ID) return
  await sendMessage(
    ADMIN_CHAT_ID,
    `🆕 <b>Новый партнёр</b>\n` +
    `👤 ${fullName}\n` +
    `📧 ${email}`
  )
}

// ── PARTNER NOTIFICATIONS ──────────────────────────────────────────

export async function notifyPartnerConversion(
  telegramChatId: string,
  amount: number,
  offerTitle: string,
  holdDays: number
) {
  await sendMessage(
    telegramChatId,
    `🎯 <b>Новая конверсия!</b>\n` +
    `💰 +${amount.toLocaleString('ru')} ₽ в ожидании\n` +
    `📦 Оффер: ${offerTitle}\n` +
    `⏳ Холд: ${holdDays} дней`
  )
}

export async function notifyPartnerPayoutApproved(
  telegramChatId: string,
  amount: number
) {
  await sendMessage(
    telegramChatId,
    `✅ <b>Выплата одобрена!</b>\n` +
    `💰 ${amount.toLocaleString('ru')} ₽ будет переведено в течение 24 часов.\n` +
    `Спасибо за работу с Drops Partners! 🚀`
  )
}

export async function notifyPartnerPayoutRejected(
  telegramChatId: string,
  amount: number,
  reason?: string
) {
  await sendMessage(
    telegramChatId,
    `❌ <b>Выплата отклонена</b>\n` +
    `💰 Сумма: ${amount.toLocaleString('ru')} ₽\n` +
    (reason ? `📝 Причина: ${reason}\n` : '') +
    `Обратитесь в поддержку: @drops_support`
  )
}

export async function notifyPartnerConversionApproved(
  telegramChatId: string,
  amount: number
) {
  await sendMessage(
    telegramChatId,
    `✅ <b>Конверсия подтверждена!</b>\n` +
    `💰 ${amount.toLocaleString('ru')} ₽ зачислено на ваш баланс.`
  )
}

// ── BOT WEBHOOK HANDLER ────────────────────────────────────────────
// Used by /api/telegram/webhook route

export interface TelegramUpdate {
  update_id: number
  message?: {
    message_id: number
    from: { id: number; username?: string; first_name: string }
    chat: { id: number; type: string }
    text?: string
  }
}

export async function handleBotUpdate(update: TelegramUpdate) {
  const msg = update.message
  if (!msg?.text) return

  const chatId = msg.chat.id
  const text = msg.text.trim()
  const [cmd] = text.split(' ')

  switch (cmd) {
    case '/start': {
      const payload = text.split(' ')[1] // e.g. "link_TOKEN"
      if (payload?.startsWith('link_')) {
        // Handle Telegram account linking
        const token = payload.slice(5)
        await handleLinkToken(chatId, token)
      } else {
        await sendMessage(
          chatId,
          `👋 <b>Добро пожаловать в Drops Partners Bot!</b>\n\n` +
          `Доступные команды:\n` +
          `/balance — Ваш баланс\n` +
          `/stats — Статистика за 7 дней\n` +
          `/help — Помощь\n\n` +
          `Войдите на <a href="https://partners.drops.agency">partners.drops.agency</a> и привяжите Telegram в настройках.`
        )
      }
      break
    }
    case '/balance':
      await handleBalance(chatId, String(msg.from.id))
      break
    case '/stats':
      await handleStats(chatId, String(msg.from.id))
      break
    case '/help':
      await sendMessage(
        chatId,
        `ℹ️ <b>Drops Partners Bot</b>\n\n` +
        `/balance — Текущий баланс\n` +
        `/stats — Статистика за 7 дней\n` +
        `/withdraw — Запросить выплату\n\n` +
        `Поддержка: @drops_support`
      )
      break
    default:
      await sendMessage(chatId, `Неизвестная команда. Введите /help для справки.`)
  }
}

async function handleLinkToken(chatId: number, token: string) {
  try {
    const { createServiceClient } = await import('@/lib/supabase/service')
    const supabase = createServiceClient()
    // Find the pending link token
    const { data: linkReq } = await supabase
      .from('telegram_links')
      .select('user_id')
      .eq('token', token)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (!linkReq) {
      await sendMessage(chatId, '❌ Ссылка недействительна или устарела. Создайте новую в настройках профиля.')
      return
    }

    // Update profile with telegram chat id
    await supabase
      .from('profiles')
      .update({ telegram_chat_id: String(chatId) })
      .eq('id', linkReq.user_id)

    // Mark token as used
    await supabase
      .from('telegram_links')
      .update({ used: true })
      .eq('token', token)

    await sendMessage(
      chatId,
      `✅ <b>Telegram успешно привязан!</b>\n\n` +
      `Теперь вы будете получать уведомления о конверсиях и выплатах.`
    )
  } catch {
    await sendMessage(chatId, '❌ Ошибка при привязке. Попробуйте позже.')
  }
}

async function handleBalance(chatId: number, telegramUserId: string) {
  try {
    const { createServiceClient } = await import('@/lib/supabase/service')
    const supabase = createServiceClient()
    const { data: profile } = await supabase
      .from('profiles')
      .select('balance, total_earned, total_paid, full_name')
      .eq('telegram_chat_id', String(chatId))
      .single()

    if (!profile) {
      await sendMessage(chatId, '❌ Аккаунт не привязан. Откройте /start для инструкций.')
      return
    }

    await sendMessage(
      chatId,
      `💰 <b>Ваш баланс</b>\n\n` +
      `Доступно: <b>${profile.balance.toLocaleString('ru')} ₽</b>\n` +
      `Всего заработано: ${profile.total_earned.toLocaleString('ru')} ₽\n` +
      `Выплачено: ${profile.total_paid.toLocaleString('ru')} ₽\n\n` +
      `Для вывода от 1 000 ₽ перейдите в кошелёк:\n` +
      `🔗 <a href="https://partners.drops.agency/dashboard/wallet">Открыть кошелёк</a>`
    )
  } catch {
    await sendMessage(chatId, '❌ Не удалось получить баланс. Попробуйте позже.')
  }
}

async function handleStats(chatId: number, telegramUserId: string) {
  try {
    const { createServiceClient } = await import('@/lib/supabase/service')
    const supabase = createServiceClient()
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('telegram_chat_id', String(chatId))
      .single()

    if (!profile) {
      await sendMessage(chatId, '❌ Аккаунт не привязан.')
      return
    }

    const since = new Date(Date.now() - 7 * 86400000).toISOString()
    const [clicksRes, convsRes] = await Promise.all([
      supabase.from('clicks').select('id', { count: 'exact' }).eq('partner_id', profile.id).gte('created_at', since),
      supabase.from('conversions').select('amount').eq('partner_id', profile.id).gte('created_at', since),
    ])

    const clicks = clicksRes.count ?? 0
    const convs = convsRes.data ?? []
    const earnings = convs.reduce((s, c) => s + (c.amount ?? 0), 0)
    const cr = clicks > 0 ? ((convs.length / clicks) * 100).toFixed(1) : '0'

    await sendMessage(
      chatId,
      `📊 <b>Статистика за 7 дней</b>\n\n` +
      `🖱 Клики: <b>${clicks.toLocaleString('ru')}</b>\n` +
      `🎯 Конверсии: <b>${convs.length}</b>\n` +
      `📈 CR: <b>${cr}%</b>\n` +
      `💰 Заработано: <b>${earnings.toLocaleString('ru')} ₽</b>`
    )
  } catch {
    await sendMessage(chatId, '❌ Не удалось получить статистику.')
  }
}
