"use server"

import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { siteSettings } from "@/lib/db/schema"
import { requireAdmin } from "@/lib/require-admin"

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

  const phoneDisplay = String(formData.get("phoneDisplay") ?? "").trim()
  const phoneHref = String(formData.get("phoneHref") ?? "").trim()
  const whatsappNumber = String(formData.get("whatsappNumber") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim()
  const mapsQuery = String(formData.get("mapsQuery") ?? "").trim()
  const location = String(formData.get("location") ?? "").trim()
  const motto = String(formData.get("motto") ?? "").trim()
  const spiritualMottoLatin = String(
    formData.get("spiritualMottoLatin") ?? ""
  ).trim()
  const instagramUrl = String(formData.get("instagramUrl") ?? "").trim()
  const youtubeUrl = String(formData.get("youtubeUrl") ?? "").trim()
  const facebookUrl = String(formData.get("facebookUrl") ?? "").trim()
  const xUrl = String(formData.get("xUrl") ?? "").trim() || null

  const fieldErrors: SiteSettingsFormState["fieldErrors"] = {}
  if (!phoneDisplay) fieldErrors.phoneDisplay = "Enter a display phone number."
  if (!phoneHref) fieldErrors.phoneHref = "Enter a tel: phone number."
  if (!whatsappNumber) fieldErrors.whatsappNumber = "Enter a WhatsApp number."
  if (!email) fieldErrors.email = "Enter a contact email."
  if (!mapsQuery) fieldErrors.mapsQuery = "Enter a Google Maps link."
  if (!location) fieldErrors.location = "Enter a location."
  if (!motto) fieldErrors.motto = "Enter a motto."
  if (!spiritualMottoLatin)
    fieldErrors.spiritualMottoLatin = "Enter the Latin motto."
  if (!instagramUrl) fieldErrors.instagramUrl = "Enter an Instagram link."
  if (!youtubeUrl) fieldErrors.youtubeUrl = "Enter a YouTube link."
  if (!facebookUrl) fieldErrors.facebookUrl = "Enter a Facebook link."

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Please fix the fields below.",
      fieldErrors,
    }
  }

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
  revalidatePath("/", "layout")

  return { status: "success", message: "Settings saved." }
}
