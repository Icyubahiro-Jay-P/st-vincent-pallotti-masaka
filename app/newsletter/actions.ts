"use server"

import { randomUUID } from "node:crypto"
import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { newsletterSubscribers } from "@/lib/db/schema"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { getLocale } from "@/lib/i18n/get-locale"
import { checkRateLimit, getRequestIp } from "@/lib/rate-limit"

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

  const ip = await getRequestIp()
  const { allowed } = await checkRateLimit(`newsletter:${ip}`, {
    max: 5,
    windowMs: 60 * 60 * 1000,
  })
  if (!allowed) {
    return { status: "error", message: n.rateLimited }
  }

  const rawEmail = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase()

  if (!rawEmail || rawEmail.length > 320 || !EMAIL_PATTERN.test(rawEmail)) {
    return { status: "error", message: n.invalidEmail }
  }

  const email = rawEmail

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
