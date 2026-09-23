"use server"

import { revalidatePath, updateTag } from "next/cache"
import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { siteSettings } from "@/lib/db/schema"
import { requireAdmin } from "@/lib/require-admin"
import { zodFieldErrors } from "@/lib/validation"
import { settingsSchema } from "@/app/admin/(dashboard)/settings/schema"

const SETTINGS_ID = 1

export type SiteSettingsFormState = {
  status: "idle" | "error" | "success"
  message?: string
  fieldErrors?: Partial<
    Record<
      | "phoneDisplay"
      | "phoneHref"
      | "whatsappNumber"
      | "email"
      | "mapsQuery"
      | "location"
      | "motto"
      | "spiritualMottoLatin"
      | "instagramUrl"
      | "youtubeUrl"
      | "facebookUrl",
      string
    >
  >
}

export async function updateSiteSettings(
  _prevState: SiteSettingsFormState,
  formData: FormData
): Promise<SiteSettingsFormState> {
  await requireAdmin()

  const parsed = settingsSchema.safeParse({
    phoneDisplay: String(formData.get("phoneDisplay") ?? ""),
    phoneHref: String(formData.get("phoneHref") ?? ""),
    whatsappNumber: String(formData.get("whatsappNumber") ?? ""),
    email: String(formData.get("email") ?? ""),
    mapsQuery: String(formData.get("mapsQuery") ?? ""),
    location: String(formData.get("location") ?? ""),
    motto: String(formData.get("motto") ?? ""),
    spiritualMottoLatin: String(formData.get("spiritualMottoLatin") ?? ""),
    instagramUrl: String(formData.get("instagramUrl") ?? ""),
    youtubeUrl: String(formData.get("youtubeUrl") ?? ""),
    facebookUrl: String(formData.get("facebookUrl") ?? ""),
    xUrl: String(formData.get("xUrl") ?? "").trim(),
  })

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the fields below.",
      fieldErrors: zodFieldErrors(parsed.error),
    }
  }

  const {
    phoneDisplay,
    phoneHref,
    whatsappNumber,
    email,
    mapsQuery,
    location,
    motto,
    spiritualMottoLatin,
    instagramUrl,
    youtubeUrl,
    facebookUrl,
  } = parsed.data
  const xUrl = parsed.data.xUrl || null

  await db
    .update(siteSettings)
    .set({
      phoneDisplay,
      phoneHref,
      whatsappNumber,
      email,
      mapsQuery,
      location,
      motto,
      spiritualMottoLatin,
      instagramUrl,
      youtubeUrl,
      facebookUrl,
      xUrl,
      updatedAt: new Date(),
    })
    .where(eq(siteSettings.id, SETTINGS_ID))

  // Header/footer render on every public page via app/(marketing)/layout.tsx,
  // so bust that whole layout subtree rather than listing routes one by one.
  updateTag("site-settings")
  revalidatePath("/", "layout")

  return { status: "success", message: "Settings saved." }
}
