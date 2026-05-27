/**
 * In-memory rate limiter (per-process).
 * For multi-instance production deployments, replace the store
 * with a Redis / Upstash adapter.
 */

interface Entry {
  count: number
  resetAt: number // Unix ms
}

const store = new Map<string, Entry>()

// Prune expired entries every 10 minutes to avoid memory leaks
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of store) {
      if (entry.resetAt < now) store.delete(key)
    }
  }, 10 * 60 * 1000)
}

export interface RateLimitResult {
  success: boolean
  remaining: number
  resetAt: number      // Unix ms at which the counter resets
  retryAfterMs: number // ms until reset (0 when success)
}

/**
 * Check (and increment) the rate limit counter for a key.
 *
 * @param key      Unique bucket key (e.g. "auth:login:1.2.3.4")
 * @param limit    Maximum requests per window (default 5)
 * @param windowMs Window duration in ms (default 5 minutes)
 */
export function checkRateLimit(
  key: string,
  limit = 5,
  windowMs = 5 * 60 * 1000,
): RateLimitResult {
  const now = Date.now()
  let e = store.get(key)

  if (!e || e.resetAt <= now) {
    // New window
    e = { count: 1, resetAt: now + windowMs }
    store.set(key, e)
    return { success: true, remaining: limit - 1, resetAt: e.resetAt, retryAfterMs: 0 }
  }

  e.count++
  const remaining = Math.max(0, limit - e.count)
  const retryAfterMs = e.count > limit ? e.resetAt - now : 0

  return { success: e.count <= limit, remaining, resetAt: e.resetAt, retryAfterMs }
}

/** Extract the real client IP from Next.js request headers. */
export function getClientIp(req: Request): string {
  const h = req.headers as Headers
  return (
    h.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    h.get('x-real-ip') ??
    'unknown'
  )
}
