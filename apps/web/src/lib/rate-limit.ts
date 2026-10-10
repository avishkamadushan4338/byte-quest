/**
 * Fixed-window, in-memory rate limiter for the HTTP entry points
 * (`/api/rpc/*` and `/api/auth/*`).
 *
 * State lives in the module scope of the server process: one bucket per key,
 * reset after the window elapses. Buckets are swept lazily and hard-capped so
 * a flood of distinct client IPs cannot grow the map without bound.
 */

interface RateBucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, RateBucket>();

/** Upper bound on tracked keys; oldest entries are evicted past this point. */
const MAX_BUCKETS = 10_000;

/** Sweep expired buckets once the map grows beyond this many entries. */
const SWEEP_THRESHOLD = 500;

const sweep = (now: number): void => {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }

  let overflow = buckets.size - MAX_BUCKETS;
  if (overflow > 0) {
    // Map iteration follows insertion order, so the oldest keys go first.
    for (const key of buckets.keys()) {
      if (overflow <= 0) {
        break;
      }
      buckets.delete(key);
      overflow -= 1;
    }
  }
};

export interface RateLimitResult {
  allowed: boolean;
  /** Seconds until the window resets; only meaningful when blocked. */
  retryAfterSeconds: number;
}

/** Consume one unit from `key`'s bucket for the current window. */
export const consumeRateLimit = (
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult => {
  const now = Date.now();
  if (buckets.size >= SWEEP_THRESHOLD) {
    sweep(now);
  }

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (bucket.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  bucket.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
};

/**
 * Best-effort client IP. Behind a reverse proxy the first `x-forwarded-for`
 * hop is the client; without one every request shares the `unknown` bucket,
 * which still caps the worst case for a server exposed directly.
 */
export const clientIp = (request: Request): string => {
  const forwarded = request.headers.get("x-forwarded-for");
  const firstHop = forwarded?.split(",")[0]?.trim();
  if (firstHop) {
    return firstHop;
  }

  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) {
    return realIp;
  }

  return "unknown";
};

export interface RequestGuardOptions {
  /** Requests allowed per window for this key. */
  limit: number;
  /** Window length in milliseconds. */
  windowMs: number;
  /** Maximum declared request body size in bytes. */
  maxBodyBytes: number;
}

/**
 * Check body size and request budget for a single request. Returns `null` when
 * the request may proceed, otherwise the response to send back unchanged.
 */
export const guardRequest = (
  request: Request,
  key: string,
  options: RequestGuardOptions
): Response | null => {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(contentLength) && contentLength > options.maxBodyBytes) {
    return new Response("Request body too large", { status: 413 });
  }

  const { allowed, retryAfterSeconds } = consumeRateLimit(
    key,
    options.limit,
    options.windowMs
  );
  if (allowed) {
    return null;
  }

  return new Response("Too many requests", {
    status: 429,
    headers: {
      "Retry-After": String(retryAfterSeconds),
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
