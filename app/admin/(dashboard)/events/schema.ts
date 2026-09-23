import { z } from "zod"

// Shared by saveEvent and EventForm (a "use server" file can only export
// async functions).
// Length caps only, applied regardless of draft/publish  whether each
// field is actually *required* still depends on intent, handled below with
// the existing imperative logic so draft-with-just-a-title keeps working.
export const eventCapsSchema = z.object({
  titleEn: z.string().trim().max(200, "Title must be 200 characters or fewer."),
  titleFr: z.string().trim().max(200, "Title must be 200 characters or fewer."),
  excerptEn: z
    .string()
    .trim()
    .max(500, "Excerpt must be 500 characters or fewer."),
  excerptFr: z
    .string()
    .trim()
    .max(500, "Excerpt must be 500 characters or fewer."),
  bodyEn: z
    .string()
    .trim()
    .max(20000, "Body text must be 20,000 characters or fewer."),
  bodyFr: z
    .string()
    .trim()
    .max(20000, "Body text must be 20,000 characters or fewer."),
  category: z
    .string()
    .trim()
    .max(100, "Category must be 100 characters or fewer."),
})
