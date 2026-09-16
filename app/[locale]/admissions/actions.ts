"use server"

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
export async function submitInquiry(
  _prevState: InquiryState,
  formData: FormData
): Promise<InquiryState> {
  const parentName = String(formData.get("parentName") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim()
  const phone = String(formData.get("phone") ?? "").trim()
  const childName = String(formData.get("childName") ?? "").trim()
  const program = String(formData.get("program") ?? "").trim()
  const preferredTerm = String(formData.get("preferredTerm") ?? "").trim()
  const message = String(formData.get("message") ?? "").trim()

  const fieldErrors: InquiryState["fieldErrors"] = {}
  if (!parentName) fieldErrors.parentName = "Enter the parent or guardian's name."
  if (!email) {
    fieldErrors.email = "Enter an email address."
  } else if (!EMAIL_PATTERN.test(email)) {
    fieldErrors.email = "Enter a valid email address."
  }
  if (!phone) fieldErrors.phone = "Enter a phone number."
  if (!childName) fieldErrors.childName = "Enter the student's name."
  if (!program) fieldErrors.program = "Select a program."

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Please fix the fields below and try again.",
      fieldErrors,
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 500))

  console.log("[admissions] new inquiry", {
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
    message: `Thank you, ${parentName.split(" ")[0]}. We've received your inquiry for ${childName} and will be in touch within 2 business days.`,
  }
}
