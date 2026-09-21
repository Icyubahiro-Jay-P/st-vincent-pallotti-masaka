import { cache } from "react"
import { unstable_cache } from "next/cache"
import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { siteSettings } from "@/lib/db/schema"

const SETTINGS_ID = 1

// unstable_cache persists across requests (revalidated via
// revalidateTag('site-settings') on save in
// app/admin/(dashboard)/settings/actions.ts); cache() on top dedupes
// repeat calls within a single request — this is fetched from nearly
// every marketing layout/page.
const getSiteSettingsCached = unstable_cache(
  async () => {
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
  },
  ["site-settings"],
  { revalidate: 3600, tags: ["site-settings"] }
)

export const getSiteSettings = cache(getSiteSettingsCached)
