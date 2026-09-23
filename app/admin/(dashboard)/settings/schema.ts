import { z } from "zod"

import {
  emailSchema,
  nonEmptyString,
  phoneSchema,
  urlSchema,
} from "@/lib/validation"

// Shared by updateSiteSettings and SiteSettingsForm (a "use server" file can
// only export async functions).
export const settingsSchema = z.object({
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
  // this field was added nullable  empty string is valid ("not set"),
  // anything non-empty must be a real URL. Whitespace-only counts as empty.
  xUrl: z.union([urlSchema, z.string().trim().length(0)]),
})
