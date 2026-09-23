import { z } from "zod"

import { phoneSchema } from "@/lib/validation"
import { ADMISSIONS_TERM_KEYS } from "@/lib/admissions-terms"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Shared by submitInquiry and AdmissionInquiryForm (a "use server" file can
// only export async functions).
// Length caps only  the actual displayed messages stay dictionary-driven
// (dict.admissions.errors) since this is a bilingual public form; zod here
// just decides which fields are invalid, not what the visitor reads. The
// program field is validated separately against live published slugs
// (built dynamically below) rather than a fixed schema shape.
export function buildInquirySchema(validProgramSlugs: Set<string>) {
  return z.object({
    parentName: z.string().trim().min(1).max(200),
    email: z.string().trim().min(1).max(320).regex(EMAIL_PATTERN),
    phone: phoneSchema,
    childName: z.string().trim().min(1).max(200),
    program: z.string().refine((slug) => validProgramSlugs.has(slug)),
    // "" is the client's unselected Select; the action drops unknown keys
    // and caps the message itself instead of rejecting them.
    preferredTerm: z.enum(ADMISSIONS_TERM_KEYS).or(z.literal("")).optional(),
    message: z.string().optional(),
  })
}
