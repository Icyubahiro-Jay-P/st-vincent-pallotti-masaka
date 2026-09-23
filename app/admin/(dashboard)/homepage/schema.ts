import { z } from "zod"

import type { HomepageStat } from "@/lib/db/schema"
import { nonEmptyString } from "@/lib/validation"

// Shared by updateHomepageContent and HomepageContentForm (a "use server"
// file can only export async functions).
export const homepageTextSchema = z.object({
  eyebrowEn: nonEmptyString(200, "an English eyebrow"),
  eyebrowFr: nonEmptyString(200, "a French eyebrow"),
  headlineEn: nonEmptyString(200, "an English headline"),
  headlineFr: nonEmptyString(200, "a French headline"),
  headlineEmphasisEn: nonEmptyString(200, "an English headline emphasis"),
  headlineEmphasisFr: nonEmptyString(200, "a French headline emphasis"),
  paragraphEn: nonEmptyString(2000, "English paragraph text"),
  paragraphFr: nonEmptyString(2000, "French paragraph text"),
  calloutValueEn: nonEmptyString(200, "an English callout value"),
  calloutValueFr: nonEmptyString(200, "a French callout value"),
  calloutTextEn: nonEmptyString(200, "English callout text"),
  calloutTextFr: nonEmptyString(200, "French callout text"),
  panelEstablishedEn: nonEmptyString(200, "English panel text"),
  panelEstablishedFr: nonEmptyString(200, "French panel text"),
})

const statSchema = z.object({
  valueEn: nonEmptyString(50, "a value"),
  valueFr: nonEmptyString(50, "a value"),
  labelEn: nonEmptyString(50, "a label"),
  labelFr: nonEmptyString(50, "a label"),
})

// Rows with every field blank are ignored (the action drops them too).
export function statsError(rows: HomepageStat[]): string | undefined {
  const filled = rows.filter(
    (row) =>
      row.valueEn.trim() ||
      row.valueFr.trim() ||
      row.labelEn.trim() ||
      row.labelFr.trim()
  )
  if (filled.length === 0) return "Add at least one stat."
  if (!filled.every((row) => statSchema.safeParse(row).success)) {
    return "Fill in every field for each stat row."
  }
}
