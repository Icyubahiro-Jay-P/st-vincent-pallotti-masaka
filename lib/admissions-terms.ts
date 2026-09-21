import en from "@/lib/i18n/dictionaries/en"
import fr from "@/lib/i18n/dictionaries/fr"
import type { Locale } from "@/lib/i18n/config"

// Canonical keys stored in admissionsInquiries.preferredTerm, decoupled from
// the localized label the visitor saw - the label text still comes from the
// dictionaries (single source of truth for wording), just paired with a
// locale-independent key here instead of storing the label itself.
export const ADMISSIONS_TERM_KEYS = [
  "term_1",
  "term_2",
  "term_3",
  "not_sure",
] as const

export type AdmissionsTermKey = (typeof ADMISSIONS_TERM_KEYS)[number]

const LABELS: Record<Locale, readonly string[]> = {
  en: en.admissions.form.terms,
  fr: fr.admissions.form.terms,
}

export function admissionsTermOptions(
  locale: string
): { key: AdmissionsTermKey; label: string }[] {
  const labels = LABELS[locale as Locale] ?? LABELS.en
  return ADMISSIONS_TERM_KEYS.map((key, index) => ({
    key,
    label: labels[index],
  }))
}

export function admissionsTermLabel(key: string): string {
  const index = ADMISSIONS_TERM_KEYS.indexOf(key as AdmissionsTermKey)
  return index === -1 ? key : LABELS.en[index]
}
