import type { Locale } from "./config"
import en from "./dictionaries/en"
import fr from "./dictionaries/fr"
import type { Dictionary } from "./dictionaries/en"

// Add a new language by importing its dictionary here and adding it to this
// map (and to lib/i18n/config.ts's `locales` array).
const dictionaries: Record<Locale, Dictionary> = { en, fr }

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale]
}

export type { Dictionary }
