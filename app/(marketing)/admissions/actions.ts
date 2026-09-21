"use server"

import { z } from "zod"

import { getDictionary } from "@/lib/i18n/get-dictionary"
import { getLocale } from "@/lib/i18n/get-locale"
import { db } from "@/lib/db"
import { admissionsInquiries } from "@/lib/db/schema"
import { checkRateLimit, getRequestIp } from "@/lib/rate-limit"
import { getPublishedPrograms } from "@/lib/programs"
import { phoneSchema } from "@/lib/validation"

export type InquiryState = {
  status: "idle" | "success" | "error"
  message?: string
  fieldErrors?: Partial<
    Record<"parentName" | "email" | "phone" | "childName" | "program", string>
  >
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Length caps only — the actual displayed messages stay dictionary-driven
// (dict.admissions.errors) since this is a bilingual public form; zod here
// just decides which fields are invalid, not what the visitor reads. The
// program field is validated separately against live published slugs
// (built dynamically below) rather than a fixed schema shape.
function buildInquirySchema(validProgramSlugs: Set<string>) {
  return z.object({
    parentName: z.string().trim().min(1).max(200),
    email: z.string().trim().min(1).max(320).regex(EMAIL_PATTERN),
    phone: phoneSchema,
    childName: z.string().trim().min(1).max(200),
    program: z.string().refine((slug) => validProgramSlugs.has(slug)),
    preferredTerm: z.string().trim().max(100).optional(),
    message: z.string().trim().max(2000).optional(),
  })
}

// Reads the visitor's language cookie directly (Server Actions can call
// cookies() same as any server code) so error and success messages come
// back in the visitor's language without the client needing to pass it in.
export async function submitInquiry(
  _prevState: InquiryState,
  formData: FormData
): Promise<InquiryState> {
  const locale = await getLocale()
  const dict = getDictionary(locale)
  const errors = dict.admissions.errors

  const ip = await getRequestIp()
  const { allowed } = await checkRateLimit(`admissions:${ip}`, {
    max: 5,
    windowMs: 60 * 60 * 1000,
  })
  if (!allowed) {
    return { status: "error", message: errors.rateLimited }
  }

  // Cap the two free-text optional fields defensively rather than reject —
  // they have no fieldErrors slot in InquiryState to surface a rejection on.
  const preferredTerm = String(formData.get("preferredTerm") ?? "")
    .trim()
    .slice(0, 100)
  const message = String(formData.get("message") ?? "")
    .trim()
    .slice(0, 2000)

  const validProgramSlugs = new Set(
    (await getPublishedPrograms(locale)).map((program) => program.slug)
  )
  const inquirySchema = buildInquirySchema(validProgramSlugs)

  const parsed = inquirySchema.safeParse({
    parentName: String(formData.get("parentName") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    childName: String(formData.get("childName") ?? ""),
    program: String(formData.get("program") ?? ""),
    preferredTerm,
    message,
  })

  if (!parsed.success) {
    const fieldErrors: InquiryState["fieldErrors"] = {}
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0])
      if (key === "parentName") fieldErrors.parentName = errors.parentName
      else if (key === "email") {
        // Distinguish "missing" from "wrong format" the same way the
        // dictionary already does, by re-checking the raw value.
        const raw = String(formData.get("email") ?? "").trim()
        fieldErrors.email = raw ? errors.emailInvalid : errors.email
      } else if (key === "phone") fieldErrors.phone = errors.phone
      else if (key === "childName") fieldErrors.childName = errors.childName
      else if (key === "program") fieldErrors.program = errors.program
    }
    return {
      status: "error",
      message: errors.formError,
      fieldErrors,
    }
  }

  const { parentName, email, phone, childName, program } = parsed.data

  await db.insert(admissionsInquiries).values({
    parentName,
    childName,
    email,
    phone,
    program,
    preferredTerm: preferredTerm || null,
    message: message || null,
    locale,
  })

  return {
    status: "success",
    message: dict.admissions.success
      .replace("{parentName}", parentName.split(" ")[0])
      .replace("{childName}", childName),
  }
}
