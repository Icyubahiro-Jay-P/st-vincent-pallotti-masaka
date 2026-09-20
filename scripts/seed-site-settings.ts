import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { siteSettings } from "@/lib/db/schema"

// Mirrors the contact/social values that used to live in
// lib/site-config.ts's `siteConfig`/`socialLinks`, inlined here so this
// one-time migration script keeps working after those fields are removed
// from the public site's code path.
const SETTINGS_ID = 1

async function main() {
  const existing = await db
    .select({ id: siteSettings.id })
    .from(siteSettings)
    .where(eq(siteSettings.id, SETTINGS_ID))

  if (existing.length > 0) {
    console.log("[seed-site-settings] skipping, row already exists")
    return
  }

  await db.insert(siteSettings).values({
    id: SETTINGS_ID,
    phoneDisplay: "+250 788 602 647",
    phoneHref: "+250788602647",
    whatsappNumber: "250788602647",
    email: "admissions@stvincentpallottimasaka.com",
    mapsQuery:
      "https://www.google.com/maps/search/?api=1&query=Saint+Vincent+Pallotti+School+Masaka+Kigali+Rwanda",
    location: "Masaka, Kigali, Rwanda",
    motto: "Strive Beyond",
    spiritualMottoLatin: "Caritas Christi urget nos",
    instagramUrl: "https://www.instagram.com/saintvincentpallottimasaka",
    youtubeUrl: "https://www.youtube.com/@saintvincentpallottimasaka",
    facebookUrl: "https://www.facebook.com/saintvincentpallottimasaka",
  })

  console.log("[seed-site-settings] created settings row")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("[seed-site-settings] failed:", error)
    process.exit(1)
  })
