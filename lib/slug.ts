import { eq, sql } from "drizzle-orm"
import type { AnyPgColumn, PgTable } from "drizzle-orm/pg-core"

import { db } from "@/lib/db"

// ponytail: one query per suffix collision (rare in practice — same
// title saved twice in a row). Upgrade path if that ever matters: a
// single query with a `LIKE 'base%'` scan, or a random suffix instead
// of a sequential one.
export async function generateUniqueSlug(
  table: PgTable,
  slugColumn: AnyPgColumn,
  base: string,
  fallback: string
): Promise<string> {
  const cleaned =
    base
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || fallback

  let slug = cleaned
  let suffix = 1
  while (true) {
    const existing = await db
      .select({ hit: sql`1` })
      .from(table)
      .where(eq(slugColumn, slug))
      .limit(1)
    if (existing.length === 0) return slug
    slug = `${cleaned}-${suffix++}`
  }
}
