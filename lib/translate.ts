import * as deepl from "deepl-node"

export type AppLocale = "en" | "fr"

const SOURCE_LANG: Record<AppLocale, deepl.SourceLanguageCode> = {
  en: "en",
  fr: "fr",
}

// DeepL has no plain "en" target (it requires a regional variant); the
// school follows a Cambridge/British curriculum, so en-GB is the closer
// match for admin-authored English content.
const TARGET_LANG: Record<AppLocale, deepl.TargetLanguageCode> = {
  en: "en-GB",
  fr: "fr",
}

let translator: deepl.Translator | null = null

function getTranslator(): deepl.Translator | null {
  const authKey = process.env.DEEPL_API_KEY
  if (!authKey) return null
  if (!translator) translator = new deepl.Translator(authKey)
  return translator
}

export type TranslateResult = {
  text: string
  usedFallback: boolean
}

// Translates admin-authored dynamic content (event/program text) from one
// site locale to the other. On any failure (quota exceeded, network error,
// missing API key), this falls back to returning the source text verbatim
// rather than throwing, so a save never blanks out or breaks the other
// language's field. Callers should set a `needsTranslationReview` flag on
// the record when `usedFallback` is true so staff know to check it.
export async function translateText(
  text: string,
  sourceLocale: AppLocale,
  targetLocale: AppLocale
): Promise<TranslateResult> {
  const trimmed = text.trim()
  if (!trimmed || sourceLocale === targetLocale) {
    return { text: trimmed, usedFallback: false }
  }

  const client = getTranslator()
  if (!client) {
    return { text: trimmed, usedFallback: true }
  }

  try {
    const result = await client.translateText(
      trimmed,
      SOURCE_LANG[sourceLocale],
      TARGET_LANG[targetLocale]
    )
    return { text: result.text, usedFallback: false }
  } catch {
    return { text: trimmed, usedFallback: true }
  }
}
