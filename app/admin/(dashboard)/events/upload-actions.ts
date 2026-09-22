"use server"

import { randomUUID } from "node:crypto"

import { requireAdmin } from "@/lib/require-admin"
import { signCloudinaryUpload } from "@/lib/media/cloudinary"
import { presignBackupUpload } from "@/lib/media/object-storage"

export type MediaUploadCredentials = {
  cloudinary: ReturnType<typeof signCloudinaryUpload>
  backup: Awaited<ReturnType<typeof presignBackupUpload>>
}

// Server-side backstop: the client already restricts the file picker to
// image/video and compresses down to well under this size (see
// lib/media/compress-image.ts, compress-video.ts's "25MB hard ceiling"),
// but a valid admin session could call this action directly, bypassing all
// of that, so it has to be enforced here too, not just in the UI.
const ALLOWED_CONTENT_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
])
import { MAX_UPLOAD_BYTES } from "@/lib/media/upload-limits"

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
  eventFolder: string,
  fileSize: number
): Promise<MediaUploadCredentials> {
  await requireAdmin()

  if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
    throw new Error(`Unsupported file type: ${contentType}`)
  }
  if (fileSize > MAX_UPLOAD_BYTES) {
    throw new Error("File is too large (25MB max).")
  }

  const unique = `${Date.now()}-${randomUUID().slice(0, 8)}-${sanitizeFileName(fileName)}`
  const folder = `events/${sanitizeFolderSegment(eventFolder)}`

  const cloudinary = signCloudinaryUpload(folder)
  const backup = await presignBackupUpload(`${folder}/${unique}`, contentType)

  return { cloudinary, backup }
}
