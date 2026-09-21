import { cache } from "react"
import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { siteSettings } from "@/lib/db/schema"

const SETTINGS_ID = 1

// cache() dedupes repeat calls within a single request — this is fetched
// from nearly every marketing layout/page.
export const getSiteSettings = cache(async () => {
  const [row] = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.id, SETTINGS_ID))

  if (!row) {
    throw new Error(
      "site_settings row is missing; run `npm run seed:site-settings`"
    )
  }

  return row
})
