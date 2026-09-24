"use server"

import { getDictionary } from "@/lib/i18n/get-dictionary"
import { getLocale } from "@/lib/i18n/get-locale"
import { db } from "@/lib/db"
import { admissionsInquiries } from "@/lib/db/schema"
import { checkRateLimit, getRequestIp } from "@/lib/rate-limit"
import { getPublishedPrograms } from "@/lib/programs"
import { ADMISSIONS_TERM_KEYS } from "@/lib/admissions-terms"
import { buildInquirySchema } from "@/app/[locale]/(marketing)/admissions/schema"

export type InquiryState = {
  status: "idle" | "success" | "error"
  message?: string
  fieldErrors?: Partial<
    Record<"parentName" | "email" | "phone" | "childName" | "program", string>
  >
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

  // Cap/normalize the two optional fields defensively rather than reject -
  // they have no fieldErrors slot in InquiryState to surface a rejection
  // on. preferredTerm is a canonical key now (not free text); an
  // unrecognized value (stale form, tampered request) is dropped rather
  // than stored, same as leaving the field blank.
  const rawPreferredTerm = String(formData.get("preferredTerm") ?? "").trim()
  const preferredTerm = (ADMISSIONS_TERM_KEYS as readonly string[]).includes(
    rawPreferredTerm
  )
    ? rawPreferredTerm
    : undefined
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
