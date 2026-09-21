import { lt, sql } from "drizzle-orm"
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

  // Single atomic statement (neon-http has no multi-statement transaction
  // support): the INSERT only executes if the count check inside the same
  // statement still passes, so concurrent requests can't all read the same
  // pre-insert count and all squeak through.
  const result = await db.execute<{ id: number }>(sql`
    INSERT INTO ${rateLimitAttempts} (${rateLimitAttempts.key})
    SELECT ${key}
    WHERE (
      SELECT count(*)::int FROM ${rateLimitAttempts}
      WHERE ${rateLimitAttempts.key} = ${key}
        AND ${rateLimitAttempts.createdAt} > ${windowStart}
    ) < ${opts.max}
    RETURNING id
  `)

  // ponytail: fire-and-forget global cleanup on every check rather than a
  // scheduled job — fine at this traffic scale, revisit if the table ever
  // grows enough for that to matter.
  db.delete(rateLimitAttempts)
    .where(
      lt(rateLimitAttempts.createdAt, new Date(Date.now() - CLEANUP_MAX_AGE_MS))
    )
    .catch(() => {})

  return { allowed: result.rows.length > 0 }
}

export async function getRequestIp(): Promise<string> {
  const hdrs = await headers()
  // x-vercel-forwarded-for is set by Vercel's edge network itself and
  // can't be spoofed by the client; x-forwarded-for can contain
  // client-supplied values when not behind a trusted proxy, so it's only
  // a fallback for non-Vercel environments (e.g. local dev).
  const vercelForwardedFor = hdrs.get("x-vercel-forwarded-for")
  if (vercelForwardedFor) {
    return vercelForwardedFor.split(",")[0]?.trim() || "unknown"
  }
  const forwardedFor = hdrs.get("x-forwarded-for")
  if (!forwardedFor) return "unknown"
  return forwardedFor.split(",")[0]?.trim() || "unknown"
}
