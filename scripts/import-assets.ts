import { readdirSync } from "node:fs"
import path from "node:path"

import { PutObjectCommand } from "@aws-sdk/client-s3"
import { v2 as cloudinary } from "cloudinary"
import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { eventMedia, events } from "@/lib/db/schema"
import { getBackupStorage } from "@/lib/media/object-storage"

// One-time import of the photos in assets/images/ into Cloudinary (compressed
// JPEG) + the private backup bucket, creating one draft event per folder.
// Idempotent: a folder whose event slug already exists is skipped before
// anything is uploaded. headmistress/ is upload-only (used on /about).
const ROOT = path.join(process.cwd(), "assets/images")

const folders = [
  {
    dir: "breaktime",
    slug: "break-time",
    titleEn: "Break Time",
    titleFr: "Récréation",
  },
  {
    dir: "nursery",
    slug: "nursery",
    titleEn: "Nursery",
    titleFr: "Maternelle",
  },
  {
    dir: "parents",
    slug: "parents-day",
    titleEn: "Parents' Day",
    titleFr: "Journée des parents",
  },
  {
    dir: "parliament",
    slug: "student-parliament",
    titleEn: "Student Parliament",
    titleFr: "Parlement des élèves",
  },
  {
    dir: "traditionaldance",
    slug: "traditional-dance",
    titleEn: "Traditional Dance",
    titleFr: "Danse traditionnelle",
  },
] as const

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Recursive so traditionaldance/{boys,girls} merge into one event.
function listFiles(dir: string): string[] {
  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => path.join(entry.parentPath, entry.name))
    .sort((a, b) => path.basename(a).localeCompare(path.basename(b)))
}

async function uploadWithBackup(file: string, folder: string) {
  const basename = path.parse(file).name
  const result = await cloudinary.uploader.upload(file, {
    // Folder baked into public_id so the ID is the same in fixed and dynamic
    // folder mode (about/page.tsx relies on the headmistress photo's ID).
    public_id: `${folder}/${basename}`,
    asset_folder: folder,
    overwrite: true,
    resource_type: "image",
    // Top-level format converts the stored asset; inside `transformation` it
    // is ignored and HEIC stays HEIC, which most browsers can't display.
    format: "jpg",
    transformation: [{ width: 2000, crop: "limit", quality: "auto:good" }],
  })

  const response = await fetch(result.secure_url)
  if (!response.ok) {
    throw new Error(`fetching ${result.secure_url} failed: ${response.status}`)
  }
  const body = Buffer.from(await response.arrayBuffer())
  const key = `${folder}/${basename}.jpg`
  const { client, bucket } = getBackupStorage()
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: "image/jpeg",
    })
  )

  console.log(`[import-assets] uploaded ${file} -> ${result.secure_url}`)
  return {
    publicId: result.public_id,
    url: result.secure_url,
    key,
    bytes: result.bytes,
  }
}

async function main() {
  const created: string[] = []
  const skipped: string[] = []

  for (const folder of folders) {
    const existing = await db
      .select({ id: events.id })
      .from(events)
      .where(eq(events.slug, folder.slug))
    if (existing.length > 0) {
      console.log(`[import-assets] skipping existing event "${folder.slug}"`)
      skipped.push(folder.slug)
      continue
    }

    const uploads = []
    for (const file of listFiles(path.join(ROOT, folder.dir))) {
      uploads.push(await uploadWithBackup(file, `events/${folder.slug}`))
    }
    const [cover, ...rest] = uploads
    if (!cover) continue

    const [event] = await db
      .insert(events)
      .values({
        slug: folder.slug,
        titleEn: folder.titleEn,
        titleFr: folder.titleFr,
        excerptEn: `Photos from ${folder.titleEn}.`,
        excerptFr: `Photos : ${folder.titleFr}.`,
        bodyEn: `Photos from ${folder.titleEn}.`,
        bodyFr: `Photos : ${folder.titleFr}.`,
        category: "School Life",
        coverImageUrl: cover.url,
        coverImagePublicId: cover.publicId,
        coverImageBackupKey: cover.key,
        status: "draft",
        needsTranslationReview: true,
      })
      .returning({ id: events.id })

    if (rest.length > 0) {
      await db.insert(eventMedia).values(
        rest.map((upload, position) => ({
          eventId: event.id,
          kind: "photo",
          cloudinaryPublicId: upload.publicId,
          cloudinaryUrl: upload.url,
          backupObjectKey: upload.key,
          bytes: upload.bytes,
          position,
        }))
      )
    }

    console.log(
      `[import-assets] created draft event "${folder.slug}" with ${uploads.length} photos`
    )
    created.push(folder.slug)
  }

  const headmistress = []
  for (const file of listFiles(path.join(ROOT, "headmistress"))) {
    headmistress.push(await uploadWithBackup(file, "about/headmistress"))
  }

  console.log("\n[import-assets] summary")
  console.log(`  created: ${created.join(", ") || "none"}`)
  console.log(`  skipped: ${skipped.join(", ") || "none"}`)
  console.log("  headmistress photos:")
  for (const upload of headmistress) console.log(`    ${upload.url}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("[import-assets] failed:", error)
    process.exit(1)
  })
