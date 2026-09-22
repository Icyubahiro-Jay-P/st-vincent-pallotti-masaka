import { Resend } from "resend"
import { and, asc, eq, gt, isNull } from "drizzle-orm"

import { db } from "@/lib/db"
import { events, newsletterSubscribers } from "@/lib/db/schema"
import { siteConfig } from "@/lib/site-config"

const CHUNK_SIZE = 100
// ponytail: fixed delay between chunks to stay under Resend's rate limit,
// global pacing rather than a real backoff/retry queue. Upgrade to a queue
// (Vercel Queues/Inngest) if the subscriber list grows past a few thousand
// or the synchronous call starts approaching the Vercel function timeout.
const CHUNK_DELAY_MS = 600
const RETRY_DELAY_MS = 3000

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

// Admin-authored excerpt text lands raw in this email's HTML below; escape it
// so a stray "<"/"&" in someone's writing can't break or inject markup.
function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

type Subscriber = typeof newsletterSubscribers.$inferSelect

function buildBatchPayload(
  subscribers: Subscriber[],
  event: typeof events.$inferSelect,
  fromAddress: string
) {
  return subscribers.map((subscriber) => {
    const isFrench = subscriber.preferredLocale === "fr"
    const title = isFrench ? event.titleFr : event.titleEn
    const excerpt = isFrench ? event.excerptFr : event.excerptEn
    const unsubscribeUrl = `${siteConfig.url}/newsletter/unsubscribe?token=${subscriber.unsubscribeToken}`

    return {
      from: fromAddress,
      to: subscriber.email,
      subject: title,
      html: `
        <p>${escapeHtml(excerpt)}</p>
        <p><a href="${siteConfig.url}/news/${event.slug}">${isFrench ? "Lire la suite" : "Read more"}</a></p>
        <hr />
        <p style="font-size:12px;color:#666"><a href="${unsubscribeUrl}">${isFrench ? "Se désabonner" : "Unsubscribe"}</a></p>
      `,
    }
  })
}

export async function sendNewsletterForEvent(eventId: number) {
  const [event] = await db.select().from(events).where(eq(events.id, eventId))
  if (!event) return

  const fromAddress = process.env.RESEND_FROM_EMAIL
  const apiKey = process.env.RESEND_API_KEY
  if (!fromAddress || !apiKey) {
    console.error(
      "[newsletter] RESEND_API_KEY or RESEND_FROM_EMAIL not set, skipping send"
    )
    return
  }

  const resend = new Resend(apiKey)
  const failedChunks: number[] = []
  let lastId = 0
  let chunkIndex = 0

  // Pages straight from the DB (ordered by id) instead of loading every
  // subscriber into memory up front  the subscriber table can grow well
  // past what's comfortable to hold in one array on a serverless function.
  while (true) {
    const page = await db
      .select()
      .from(newsletterSubscribers)
      .where(
        and(
          isNull(newsletterSubscribers.unsubscribedAt),
          gt(newsletterSubscribers.id, lastId)
        )
      )
      .orderBy(asc(newsletterSubscribers.id))
      .limit(CHUNK_SIZE)

    if (page.length === 0) break
    lastId = page[page.length - 1].id

    const payload = buildBatchPayload(page, event, fromAddress)

    try {
      await resend.batch.send(payload)
    } catch (error) {
      // One failed chunk shouldn't abort the whole send  retry once after
      // a longer delay, then move on and log which chunk needs a manual
      // resend rather than losing every remaining subscriber's email.
      await sleep(RETRY_DELAY_MS)
      try {
        await resend.batch.send(payload)
      } catch (retryError) {
        failedChunks.push(chunkIndex)
        console.error(
          `[newsletter] chunk ${chunkIndex} failed after retry`,
          retryError
        )
      }
    }

    chunkIndex++
    if (page.length === CHUNK_SIZE) await sleep(CHUNK_DELAY_MS)
  }

  if (failedChunks.length > 0) {
    console.error(
      `[newsletter] event ${eventId}: ${failedChunks.length} chunk(s) failed to send: ${failedChunks.join(", ")}`
    )
  }
}
