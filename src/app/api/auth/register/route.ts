import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'
import { isSupabaseConfigured, createServiceClient } from '@/lib/supabase/service'
import { createClient } from '@supabase/supabase-js'

/**
 * POST /api/auth/register
 * Rate-limited server-side registration.
 * Uses admin client to create user with email_confirm: true (no email step in MVP).
 * Returns session tokens immediately so user goes straight to onboarding.
 *
 * Rate limit: 3 registrations per IP per 5 minutes.
 */
export async function POST(req: NextRequest) {
  // ── Rate limiting ────────────────────────────────────────────────────────
  const ip = getClientIp(req)
  const rl = checkRateLimit(`auth:register:${ip}`, 3, 5 * 60 * 1000)

  if (!rl.success) {
    const retrySec = Math.ceil(rl.retryAfterMs / 1000)
    return NextResponse.json(
      { error: `Слишком много регистраций. Повторите через ${retrySec} сек.` },
      {
        status: 429,
        headers: { 'Retry-After': String(retrySec) },
      },
    )
  }

  // ── Dev / demo mode ──────────────────────────────────────────────────────
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ success: true, dev: true })
  }

  // ── Validate body ────────────────────────────────────────────────────────
  let email: string, password: string, full_name: string, ref_code: string
  try {
    const body = await req.json()
    email = (body.email ?? '').toString().trim()
    password = (body.password ?? '').toString()
    full_name = (body.full_name ?? '').toString().trim()
    ref_code = (body.ref_code ?? '').toString().trim()
  } catch {
    return NextResponse.json({ error: 'Некорректный запрос' }, { status: 400 })
  }

  if (!email || !password) {
    return NextResponse.json({ error: 'Email и пароль обязательны' }, { status: 400 })
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Пароль — минимум 8 символов' }, { status: 400 })
  }

  // ── Create user (admin, email pre-confirmed) ─────────────────────────────
  try {
    const admin = createServiceClient()

    const { data: userData, error: createError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name },
    })

    if (createError) {
      const msg = createError.message.toLowerCase().includes('already been registered')
        || createError.message.toLowerCase().includes('already registered')
        ? 'Этот email уже зарегистрирован'
        : createError.message
      return NextResponse.json({ error: msg }, { status: 400 })
    }

    // ── Sign in to obtain session tokens ─────────────────────────────────
    const anon = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    )

    const { data: signIn, error: signInErr } = await anon.auth.signInWithPassword({ email, password })
    if (signInErr || !signIn.session) {
      // User created but can't sign in — unlikely, but handle gracefully
      return NextResponse.json(
        { error: 'Аккаунт создан. Войдите через форму входа.' },
        { status: 201 },
      )
    }

    // ── Link referrer (fire-and-forget) ───────────────────────────────────
    if (ref_code && userData.user) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''
      fetch(`${appUrl}/api/auth/link-referrer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userData.user.id, ref_code }),
      }).catch(() => {})
    }

    return NextResponse.json({
      access_token: signIn.session.access_token,
      refresh_token: signIn.session.refresh_token,
    })
  } catch {
    return NextResponse.json({ error: 'Ошибка сервера. Попробуйте позже.' }, { status: 500 })
  }
}
