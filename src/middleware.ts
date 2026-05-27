import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_PATHS = ['/', '/auth', '/advertiser', '/api/track', '/ref', '/onboarding']
const ADMIN_PATHS = ['/admin']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isPublic = PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'))
  if (isPublic) return NextResponse.next()

  // Try Supabase auth check — graceful fallback if not configured
  try {
    const { createServerClient } = await import('@supabase/ssr')
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) return NextResponse.next()
    // In dev/demo mode with placeholder credentials, bypass auth
    if (supabaseUrl.includes('placeholder') || supabaseKey.includes('placeholder')) {
      return NextResponse.next()
    }

    let response = NextResponse.next({ request })

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookies) => {
          cookies.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    })

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('next', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // ── Onboarding check (partner dashboard only) ──────────────────────────
    const isDashboard = pathname.startsWith('/dashboard')
    if (isDashboard) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_done, role')
        .eq('id', user.id)
        .single()

      // Redirect new partners to the onboarding wizard
      if (profile && !profile.onboarding_done && profile.role === 'partner') {
        return NextResponse.redirect(new URL('/onboarding', request.url))
      }
    }

    // ── Admin role guard ───────────────────────────────────────────────────
    const isAdminPath = ADMIN_PATHS.some(p => pathname.startsWith(p))
    if (isAdminPath) {
      const { data: profile } = await supabase
        .from('profiles').select('role').eq('id', user.id).single()
      if (profile?.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }

    return response
  } catch {
    return NextResponse.next()
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
}
