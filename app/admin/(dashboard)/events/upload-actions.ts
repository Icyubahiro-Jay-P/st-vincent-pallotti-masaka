"use server"

import { randomUUID } from "node:crypto"

import { requireAdmin } from "@/lib/require-admin"
import { signCloudinaryUpload } from "@/lib/media/cloudinary"
import { presignBackupUpload } from "@/lib/media/object-storage"

export type MediaUploadCredentials = {
  cloudinary: ReturnType<typeof signCloudinaryUpload>
  backup: Awaited<ReturnType<typeof presignBackupUpload>>
}

function sanitizeFileName(fileName: string) {
  const base = fileName.toLowerCase().replace(/[^a-z0-9.]+/g, "-")
  return base || "file"
}

// The client only ever suggests which event a photo belongs to (its slug,
// or a working title for one not saved yet); this is what actually decides
// the folder name, so a crafted value can't escape into an unrelated
// Cloudinary/bucket path.
function sanitizeFolderSegment(segment: string) {
  const base = segment
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
  return base || "untitled"
}

// Mints short-lived credentials so the admin's browser can upload a
// (client-compressed) photo/video directly to Cloudinary and to the
// object-storage backup bucket, bypassing our own serverless function
// entirely (see lib/media/cloudinary.ts and lib/media/object-storage.ts
// for why that matters on Vercel). Every event gets its own folder
// (events/<event-slug>) so photos from different events don't all pile
// into one flat Cloudinary folder.
export async function getUploadCredentials(
  fileName: string,
  contentType: string,
  eventFolder: string
): Promise<MediaUploadCredentials> {
  await requireAdmin()

  const unique = `${Date.now()}-${randomUUID().slice(0, 8)}-${sanitizeFileName(fileName)}`
  const folder = `events/${sanitizeFolderSegment(eventFolder)}`

  const cloudinary = signCloudinaryUpload(folder)
  const backup = await presignBackupUpload(`${folder}/${unique}`, contentType)

  return { cloudinary, backup }
}
