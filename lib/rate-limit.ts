interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const requestsByIp = new Map<string, RateLimitEntry>();

const limit = Math.max(1, Number(process.env.RATE_LIMIT_REQUESTS) || 7);
const windowMs = Math.max(
  1_000,
  Number(process.env.RATE_LIMIT_WINDOW_MS) || 24 * 60 * 60 * 1_000,
);

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
}

export function getClientIp(request: Request): string {
  return (
    request.headers.get("cf-connecting-ip")?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

export function consumeRateLimit(key: string): RateLimitResult {
  const now = Date.now();
  const current = requestsByIp.get(key);

  if (!current || current.resetAt <= now) {
    const resetAt = now + windowMs;
    requestsByIp.set(key, { count: 1, resetAt });
    pruneExpiredEntries(now);
    return { allowed: true, limit, remaining: limit - 1, resetAt };
  }

  if (current.count >= limit) {
    return { allowed: false, limit, remaining: 0, resetAt: current.resetAt };
  }

  current.count += 1;
  return {
    allowed: true,
    limit,
    remaining: limit - current.count,
    resetAt: current.resetAt,
  };
}

export function refundRateLimit(
  key: string,
  reservation: RateLimitResult,
): RateLimitResult {
  const current = requestsByIp.get(key);

  // Only refund the same window that issued this reservation. A newer window
  // may already exist if the extraction ran across the reset boundary.
  if (!current || current.resetAt !== reservation.resetAt) {
    return reservation;
  }

  current.count = Math.max(0, current.count - 1);

  if (current.count === 0) {
    requestsByIp.delete(key);
  }

  return {
    allowed: true,
    limit,
    remaining: limit - current.count,
    resetAt: current.resetAt,
  };
}

function pruneExpiredEntries(now: number) {
  if (requestsByIp.size < 1_000) return;
  for (const [key, entry] of requestsByIp) {
    if (entry.resetAt <= now) requestsByIp.delete(key);
  }
}

export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1_000)),
  };
}
