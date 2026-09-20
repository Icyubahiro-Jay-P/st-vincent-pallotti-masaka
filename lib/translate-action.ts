"use server"

import { requireAdmin } from "@/lib/require-admin"
import {
  translateText,
  type AppLocale,
  type TranslateResult,
} from "@/lib/translate"

// Thin Server Action so client form components can call DeepL translation
// directly on blur, the same way EventForm already calls the `saveEvent`
// Server Action, no app/api route needed for this project's conventions.
export async function translateField(
  text: string,
  sourceLocale: AppLocale,
  targetLocale: AppLocale
): Promise<TranslateResult> {
  await requireAdmin()
  return translateText(text, sourceLocale, targetLocale)
}
