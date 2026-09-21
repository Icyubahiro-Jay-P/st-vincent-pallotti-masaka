"use server"

import { revalidatePath, updateTag } from "next/cache"
import { eq } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/lib/db"
import { siteSettings } from "@/lib/db/schema"
import { requireAdmin } from "@/lib/require-admin"
import {
  emailSchema,
  nonEmptyString,
  phoneSchema,
  urlSchema,
  zodFieldErrors,
} from "@/lib/validation"

const SETTINGS_ID = 1

const settingsSchema = z.object({
  phoneDisplay: nonEmptyString(50, "a display phone number"),
  phoneHref: phoneSchema,
  whatsappNumber: phoneSchema,
  email: emailSchema,
  mapsQuery: urlSchema,
  location: nonEmptyString(200, "a location"),
  motto: nonEmptyString(200, "a motto"),
  spiritualMottoLatin: nonEmptyString(200, "the Latin motto"),
  instagramUrl: urlSchema,
  youtubeUrl: urlSchema,
  facebookUrl: urlSchema,
  // Optional: no admin has set an X account yet on many deployments, and
  // this field was added nullable — empty string is valid ("not set"),
  // anything non-empty must be a real URL.
  xUrl: z.union([urlSchema, z.literal("")]),
})

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
