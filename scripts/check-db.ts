import { sql } from "drizzle-orm"

import { db } from "@/lib/db"
import {
  admissionsInquiries,
  events,
  newsletterSubscribers,
} from "@/lib/db/schema"

async function main() {
  await db.execute(sql`select 1`)
  console.log("[check-db] connection ok")

  const [eventCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(events)
  const [subscriberCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(newsletterSubscribers)
  const [inquiryCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(admissionsInquiries)

  console.log("[check-db] events:", eventCount.count)
  console.log("[check-db] newsletter_subscribers:", subscriberCount.count)
  console.log("[check-db] admissions_inquiries:", inquiryCount.count)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("[check-db] failed:", error)
    process.exit(1)
  })
