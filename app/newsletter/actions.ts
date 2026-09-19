"use server"

import { randomUUID } from "node:crypto"
import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { newsletterSubscribers } from "@/lib/db/schema"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { getLocale } from "@/lib/i18n/get-locale"

export type NewsletterState = {
  status: "idle" | "success" | "error"
  message?: string
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function subscribeToNewsletter(
  _prevState: NewsletterState,
  formData: FormData
): Promise<NewsletterState> {
  const locale = await getLocale()
  const dict = getDictionary(locale)
  const n = dict.newsletter

  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase()

  if (!email || !EMAIL_PATTERN.test(email)) {
    return { status: "error", message: n.invalidEmail }
  }

  const [existing] = await db
    .select()
    .from(newsletterSubscribers)
    .where(eq(newsletterSubscribers.email, email))

  if (existing) {
    if (existing.unsubscribedAt) {
      await db
        .update(newsletterSubscribers)
        .set({ unsubscribedAt: null, preferredLocale: locale })
        .where(eq(newsletterSubscribers.id, existing.id))
    }
  } else {
    await db.insert(newsletterSubscribers).values({
      email,
      preferredLocale: locale,
      unsubscribeToken: randomUUID(),
    })
  }

  return { status: "success", message: n.success }
}
