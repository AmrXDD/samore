import { headers } from "next/headers";

type Bucket = { count: number; resetAt: number };

// In-memory fixed-window limiter. Suitable for single-instance/serverless bursts.
// For multi-region scale, back this with Upstash Redis (drop-in replacement).
const store = new Map<string, Bucket>();

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;

function sweep(now: number) {
  if (store.size < 5_000) return;
  for (const [key, bucket] of store) {
    if (bucket.resetAt < now) store.delete(key);
  }
}

export async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return h.get("x-real-ip") ?? "unknown";
}

/**
 * Returns whether the action is allowed for the given identifier.
 * @param key logical action name, e.g. "contact"
 */
export async function rateLimit(
  key: string,
  { max = MAX_REQUESTS, windowMs = WINDOW_MS }: { max?: number; windowMs?: number } = {},
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const ip = await getClientIp();
  const id = `${key}:${ip}`;
  const now = Date.now();
  sweep(now);

  const bucket = store.get(id);
  if (!bucket || bucket.resetAt < now) {
    const resetAt = now + windowMs;
    store.set(id, { count: 1, resetAt });
    return { allowed: true, remaining: max - 1, resetAt };
  }

  if (bucket.count >= max) {
    return { allowed: false, remaining: 0, resetAt: bucket.resetAt };
  }

  bucket.count += 1;
  return { allowed: true, remaining: max - bucket.count, resetAt: bucket.resetAt };
}
