import { z } from "zod"

import { iconMap } from "@/components/icon-map"
import { nonEmptyString, positionSchema } from "@/lib/validation"

// Shared by saveMilestone and MilestoneForm (a "use server" file can only export async
// functions).
export const milestoneSchema = z.object({
  yearEn: nonEmptyString(100, "an English year/period label"),
  yearFr: nonEmptyString(100, "a French year/period label"),
  titleEn: nonEmptyString(200, "an English title"),
  titleFr: nonEmptyString(200, "a French title"),
  descriptionEn: nonEmptyString(1000, "an English description"),
  descriptionFr: nonEmptyString(1000, "a French description"),
  icon: z.string().refine((v) => v in iconMap, "Choose an icon."),
  position: positionSchema,
})
