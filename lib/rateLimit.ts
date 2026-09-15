/**
 * Best-effort in-memory rate limit for Vercel serverless.
 * Resets when the isolate is recycled — still blocks burst abuse.
 *
 * Kept outside `/api` so Vercel packages it with each function import.
 * (api/_*.ts sibling imports fail with ERR_MODULE_NOT_FOUND on Node ESM.)
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

export function clientKey(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}

/** @returns true if the request is allowed */
export function rateLimitAllow(
  key: string,
  limit: number,
  windowMs: number,
): boolean {
  const now = Date.now();
  const entry = buckets.get(key);
  if (!entry || entry.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count += 1;
  return true;
}
