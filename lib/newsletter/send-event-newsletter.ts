import { Resend } from "resend"
import { eq, isNull } from "drizzle-orm"

import { db } from "@/lib/db"
import { events, newsletterSubscribers } from "@/lib/db/schema"
import { siteConfig } from "@/lib/site-config"

const CHUNK_SIZE = 100
// ponytail: fixed delay between chunks to stay under Resend's rate limit,
// global pacing rather than a real backoff/retry queue. Upgrade to a queue
// (Vercel Queues/Inngest) if the subscriber list grows past a few thousand
// or the synchronous call starts approaching the Vercel function timeout.
const CHUNK_DELAY_MS = 600

export function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size))
  }
  return chunks
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function sendNewsletterForEvent(eventId: number) {
  const [event] = await db.select().from(events).where(eq(events.id, eventId))
  if (!event) return

  const subscribers = await db
    .select()
    .from(newsletterSubscribers)
    .where(isNull(newsletterSubscribers.unsubscribedAt))
  if (subscribers.length === 0) return

  const fromAddress = process.env.RESEND_FROM_EMAIL
  const apiKey = process.env.RESEND_API_KEY
  if (!fromAddress || !apiKey) {
    console.error(
      "[newsletter] RESEND_API_KEY or RESEND_FROM_EMAIL not set, skipping send"
    )
    return
  }

  const resend = new Resend(apiKey)
  const groups = chunk(subscribers, CHUNK_SIZE)

  for (let i = 0; i < groups.length; i++) {
    await resend.batch.send(
      groups[i].map((subscriber) => {
        const isFrench = subscriber.preferredLocale === "fr"
        const title = isFrench ? event.titleFr : event.titleEn
        const excerpt = isFrench ? event.excerptFr : event.excerptEn
        const unsubscribeUrl = `${siteConfig.url}/newsletter/unsubscribe?token=${subscriber.unsubscribeToken}`

        return {
          from: fromAddress,
          to: subscriber.email,
          subject: title,
          html: `
            <p>${excerpt}</p>
            <p><a href="${siteConfig.url}/news/${event.slug}">${isFrench ? "Lire la suite" : "Read more"}</a></p>
            <hr />
            <p style="font-size:12px;color:#666"><a href="${unsubscribeUrl}">${isFrench ? "Se désabonner" : "Unsubscribe"}</a></p>
          `,
        }
      })
    )
    if (i < groups.length - 1) await sleep(CHUNK_DELAY_MS)
  }
}
