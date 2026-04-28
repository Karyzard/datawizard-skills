const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 60;

const hits = new Map<string, { count: number; resetAt: number }>();

// Periodically clean old entries (every 5 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of hits) {
    if (val.resetAt <= now) hits.delete(key);
  }
}, 5 * 60_000);

/**
 * In-memory rate limiter. Returns true if the request is allowed, false if the limit is exceeded.
 */
export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || entry.resetAt <= now) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  entry.count++;
  return entry.count <= MAX_REQUESTS;
}
