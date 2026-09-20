import { and, eq, gt, lt } from "drizzle-orm"
import { headers } from "next/headers"

import { db } from "@/lib/db"
import { rateLimitAttempts } from "@/lib/db/schema"

const CLEANUP_MAX_AGE_MS = 24 * 60 * 60 * 1000

// Shared rate limiter for unauthenticated entry points (admin login,
// password reset, public forms). Deliberately not used on admin CRUD
// actions — those already require a valid session, so the threat model
// there is "the one trusted admin," not an anonymous attacker.
export async function checkRateLimit(
  key: string,
  opts: { max: number; windowMs: number }
): Promise<{ allowed: boolean }> {
  const windowStart = new Date(Date.now() - opts.windowMs)

  const recent = await db
    .select({ id: rateLimitAttempts.id })
    .from(rateLimitAttempts)
    .where(
      and(
        eq(rateLimitAttempts.key, key),
        gt(rateLimitAttempts.createdAt, windowStart)
      )
    )

  if (recent.length >= opts.max) {
    return { allowed: false }
  }

  await db.insert(rateLimitAttempts).values({ key })

  // ponytail: fire-and-forget global cleanup on every check rather than a
  // scheduled job — fine at this traffic scale, revisit if the table ever
  // grows enough for that to matter.
  db.delete(rateLimitAttempts)
    .where(
      lt(rateLimitAttempts.createdAt, new Date(Date.now() - CLEANUP_MAX_AGE_MS))
    )
    .catch(() => {})

  return { allowed: true }
}

export async function getRequestIp(): Promise<string> {
  const forwardedFor = (await headers()).get("x-forwarded-for")
  if (!forwardedFor) return "unknown"
  return forwardedFor.split(",")[0]?.trim() || "unknown"
}
