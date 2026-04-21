// src/lib/rate-limit.ts
/**
 * In-memory sliding window rate limiter.
 * NOTE: This works per-instance only. In multi-instance / serverless deployments,
 * replace the store with an Upstash Redis client for distributed rate limiting.
 * @see https://github.com/upstash/ratelimit
 */

interface RateLimitEntry {
  timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();

// Prune entries older than the window every 5 minutes
setInterval(() => {
  const now = Date.now();
  Array.from(store.entries()).forEach(([key, entry]: [string, RateLimitEntry]) => {
    entry.timestamps = entry.timestamps.filter((t: number) => now - t < 60_000 * 15);
    if (entry.timestamps.length === 0) store.delete(key);
  });
}, 5 * 60_000);

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number; // epoch ms
}

/**
 * Check whether a key is within rate limits.
 * @param key      Unique key (e.g. IP + route)
 * @param limit    Max requests allowed per window
 * @param windowMs Window duration in milliseconds
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const cutoff = now - windowMs;

  const entry = store.get(key) ?? { timestamps: [] };
  entry.timestamps = entry.timestamps.filter((t) => t > cutoff);

  if (entry.timestamps.length >= limit) {
    const oldest = entry.timestamps[0];
    return { success: false, remaining: 0, reset: oldest + windowMs };
  }

  entry.timestamps.push(now);
  store.set(key, entry);

  return {
    success: true,
    remaining: limit - entry.timestamps.length,
    reset: now + windowMs,
  };
}

/** Returns a 429 JSON response body */
export function rateLimitResponse(reset: number) {
  return {
    error: "Too many requests",
    retryAfter: Math.ceil((reset - Date.now()) / 1000),
  };
}
