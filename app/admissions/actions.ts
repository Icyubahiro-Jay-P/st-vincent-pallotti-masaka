"use server"

import { getDictionary } from "@/lib/i18n/get-dictionary"
import { getLocale } from "@/lib/i18n/get-locale"

export type InquiryState = {
  status: "idle" | "success" | "error"
  message?: string
  fieldErrors?: Partial<
    Record<"parentName" | "email" | "phone" | "childName" | "program", string>
  >
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Demo backend: validates and "logs" the inquiry server-side. Wire this up to
// Resend, Formspree or a database before taking real admissions inquiries.
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

  const parentName = String(formData.get("parentName") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim()
  const phone = String(formData.get("phone") ?? "").trim()
  const childName = String(formData.get("childName") ?? "").trim()
  const program = String(formData.get("program") ?? "").trim()
  const preferredTerm = String(formData.get("preferredTerm") ?? "").trim()
  const message = String(formData.get("message") ?? "").trim()

  const fieldErrors: InquiryState["fieldErrors"] = {}
  if (!parentName) fieldErrors.parentName = errors.parentName
  if (!email) {
    fieldErrors.email = errors.email
  } else if (!EMAIL_PATTERN.test(email)) {
    fieldErrors.email = errors.emailInvalid
  }
  if (!phone) fieldErrors.phone = errors.phone
  if (!childName) fieldErrors.childName = errors.childName
  if (!program) fieldErrors.program = errors.program

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: errors.formError,
      fieldErrors,
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 500))

  console.log("[admissions] new inquiry", {
    locale,
    parentName,
    email,
    phone,
    childName,
    program,
    preferredTerm,
    message,
    receivedAt: new Date().toISOString(),
  })

  return {
    status: "success",
    message: dict.admissions.success
      .replace("{parentName}", parentName.split(" ")[0])
      .replace("{childName}", childName),
  }
}
