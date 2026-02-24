// Simple in-memory sliding window rate limiter
// Suitable for single-instance deployments (Vercel serverless = per-function, still limits burst)

const windows = new Map<string, { count: number; resetAt: number }>()

// Cleanup stale entries every 5 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now()
  for (const [key, record] of windows) {
    if (now > record.resetAt) windows.delete(key)
  }
}, 5 * 60_000)

export function rateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): { ok: boolean; remaining: number } {
  const now = Date.now()
  const record = windows.get(key)

  if (!record || now > record.resetAt) {
    windows.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true, remaining: maxRequests - 1 }
  }

  if (record.count >= maxRequests) {
    return { ok: false, remaining: 0 }
  }

  record.count++
  return { ok: true, remaining: maxRequests - record.count }
}
