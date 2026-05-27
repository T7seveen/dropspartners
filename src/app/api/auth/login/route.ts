import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'
import { isSupabaseConfigured } from '@/lib/supabase/service'

/**
 * POST /api/auth/login
 * Rate-limited server-side login wrapper.
 * Returns session tokens so the client can call supabase.auth.setSession().
 *
 * Rate limit: 5 attempts per IP per 5 minutes.
 */
export async function POST(req: NextRequest) {
  // ── Rate limiting ────────────────────────────────────────────────────────
  const ip = getClientIp(req)
  const rl = checkRateLimit(`auth:login:${ip}`, 5, 5 * 60 * 1000)

  if (!rl.success) {
    const retrySec = Math.ceil(rl.retryAfterMs / 1000)
    return NextResponse.json(
      { error: `Слишком много попыток входа. Повторите через ${retrySec} сек.` },
      {
        status: 429,
        headers: {
          'Retry-After': String(retrySec),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.ceil(rl.resetAt / 1000)),
        },
      },
    )
  }

  // ── Dev / demo mode ──────────────────────────────────────────────────────
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ success: true, dev: true })
  }

  // ── Validate body ────────────────────────────────────────────────────────
  let email: string, password: string
  try {
    const body = await req.json()
    email = (body.email ?? '').toString().trim()
    password = (body.password ?? '').toString()
  } catch {
    return NextResponse.json({ error: 'Некорректный запрос' }, { status: 400 })
  }

  if (!email || !password) {
    return NextResponse.json({ error: 'Email и пароль обязательны' }, { status: 400 })
  }

  // ── Supabase auth ────────────────────────────────────────────────────────
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    )

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      const msg = error.message.includes('Invalid login credentials')
        ? 'Неверный email или пароль'
        : error.message.includes('Email not confirmed')
          ? 'Подтвердите email перед входом'
          : error.message
      return NextResponse.json({ error: msg }, { status: 401 })
    }

    return NextResponse.json({
      access_token: data.session!.access_token,
      refresh_token: data.session!.refresh_token,
    })
  } catch {
    return NextResponse.json({ error: 'Ошибка сервера. Попробуйте позже.' }, { status: 500 })
  }
}
