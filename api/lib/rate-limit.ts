type AttemptBucket = {
  count: number;
  resetAt: number;
};

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const attempts = new Map<string, AttemptBucket>();

export function getClientIp(headers: Headers) {
  const forwardedFor = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return (
    forwardedFor ||
    headers.get("x-real-ip") ||
    headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

export function checkAdminLoginRateLimit(ip: string) {
  const now = Date.now();
  const existing = attempts.get(ip);

  if (!existing || existing.resetAt <= now) {
    attempts.set(ip, { count: 0, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (existing.count >= MAX_ATTEMPTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000),
    };
  }

  return { allowed: true, retryAfterSeconds: 0 };
}

export function recordFailedAdminLogin(ip: string) {
  const now = Date.now();
  const existing = attempts.get(ip);

  if (!existing || existing.resetAt <= now) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }

  existing.count += 1;
}

export function clearAdminLoginRateLimit(ip: string) {
  attempts.delete(ip);
}
