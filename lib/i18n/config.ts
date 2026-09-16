// Adding a language: create dictionaries/<code>.ts (copy fr.ts, translate
// every value, keep every key), add it to the `locales` array and
// `localeNames` below, then import and register it in get-dictionary.ts.
// TypeScript will error on any missing key because every dictionary is
// typed against the English one.

export const locales = ["en", "fr"] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "en"

export const localeNames: Record<Locale, string> = {
  en: "English",
  fr: "Français",
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}
