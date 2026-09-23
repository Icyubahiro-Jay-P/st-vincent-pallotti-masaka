import { z } from "zod"

import { iconMap } from "@/components/icon-map"
import { nonEmptyString, positionSchema } from "@/lib/validation"

// Shared by saveValue and ValueForm (a "use server" file can only export async
// functions).
export const valueSchema = z.object({
  titleEn: nonEmptyString(200, "an English title"),
  titleFr: nonEmptyString(200, "a French title"),
  descriptionEn: nonEmptyString(1000, "an English description"),
  descriptionFr: nonEmptyString(1000, "a French description"),
  icon: z.string().refine((v) => v in iconMap, "Choose an icon."),
  position: positionSchema,
})
