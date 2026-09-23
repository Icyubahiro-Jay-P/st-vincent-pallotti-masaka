import { PutObjectCommand } from "@aws-sdk/client-s3"
import { eq, like } from "drizzle-orm"

import { db } from "@/lib/db"
import { eventMedia, events } from "@/lib/db/schema"
import { getBackupStorage } from "@/lib/media/object-storage"

// One-off repair: the first import-assets run stored HEIC originals. Point
// rows at the .jpg delivery URL and replace the backup bytes with that JPEG.
const toJpg = (url: string) => url.replace(/\.heic$/i, ".jpg")

async function backup(url: string, key: string) {
  const response = await fetch(url)
  if (!response.ok)
    throw new Error(`fetching ${url} failed: ${response.status}`)
  const body = Buffer.from(await response.arrayBuffer())
  const { client, bucket } = getBackupStorage()
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: "image/jpeg",
    })
  )
  return body.length
}

async function main() {
  const covers = await db
    .select()
    .from(events)
    .where(like(events.coverImageUrl, "%.heic"))
  for (const e of covers) {
    const url = toJpg(e.coverImageUrl!)
    await backup(url, e.coverImageBackupKey!)
    await db
      .update(events)
      .set({ coverImageUrl: url })
      .where(eq(events.id, e.id))
    console.log(`[fix-heic] cover ${e.slug} -> ${url}`)
  }

  const media = await db
    .select()
    .from(eventMedia)
    .where(like(eventMedia.cloudinaryUrl, "%.heic"))
  for (const m of media) {
    const url = toJpg(m.cloudinaryUrl)
    const bytes = await backup(url, m.backupObjectKey)
    await db
      .update(eventMedia)
      .set({ cloudinaryUrl: url, bytes })
      .where(eq(eventMedia.id, m.id))
    console.log(`[fix-heic] media ${m.id} -> ${url}`)
  }
  console.log(
    `[fix-heic] fixed ${covers.length} covers, ${media.length} media rows`
  )
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("[fix-heic] failed:", error)
    process.exit(1)
  })
