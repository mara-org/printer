import { Redis } from "@upstash/redis";

let _redis: Redis | null = null;
function getRedis(): Redis | null {
  if (_redis) return _redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  _redis = new Redis({ url, token });
  return _redis;
}

// In-memory fallback used when Upstash is not configured (dev / preview).
// NOT safe for serverless production with multiple instances — set Upstash.
const memory = new Map<string, { count: number; expiresAt: number }>();

type Result = { allowed: boolean; remaining: number; resetSec: number };

/**
 * Sliding-window-ish fixed-window rate limit.
 * @param key  Composite key (e.g. `analyze:ip:1.2.3.4`)
 * @param max  Max requests per window
 * @param windowSec  Window duration in seconds
 */
export async function rateLimit(key: string, max: number, windowSec: number): Promise<Result> {
  const redis = getRedis();
  const now = Date.now();

  if (redis) {
    const k = `rl:${key}`;
    const count = await redis.incr(k);
    if (count === 1) await redis.expire(k, windowSec);
    const ttl = (await redis.ttl(k)) ?? windowSec;
    return {
      allowed: count <= max,
      remaining: Math.max(0, max - count),
      resetSec: ttl,
    };
  }

  // Memory fallback.
  const entry = memory.get(key);
  if (!entry || entry.expiresAt < now) {
    memory.set(key, { count: 1, expiresAt: now + windowSec * 1000 });
    return { allowed: true, remaining: max - 1, resetSec: windowSec };
  }
  entry.count += 1;
  return {
    allowed: entry.count <= max,
    remaining: Math.max(0, max - entry.count),
    resetSec: Math.ceil((entry.expiresAt - now) / 1000),
  };
}

export const __testing = { memory };
