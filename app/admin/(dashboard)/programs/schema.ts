import { z } from "zod"

import { iconMap } from "@/components/icon-map"
import { nonEmptyString, positionSchema } from "@/lib/validation"

// Shared by saveProgram and ProgramForm (a "use server" file can only export async
// functions).
export const programSchema = z.object({
  nameEn: nonEmptyString(200, "an English name"),
  nameFr: nonEmptyString(200, "a French name"),
  ageRangeEn: nonEmptyString(100, "an English class range"),
  ageRangeFr: nonEmptyString(100, "a French class range"),
  descriptionEn: nonEmptyString(1000, "an English description"),
  descriptionFr: nonEmptyString(1000, "a French description"),
  overviewEn: nonEmptyString(5000, "English overview text"),
  overviewFr: nonEmptyString(5000, "French overview text"),
  icon: z.string().refine((v) => v in iconMap, "Choose an icon."),
  position: positionSchema,
})
