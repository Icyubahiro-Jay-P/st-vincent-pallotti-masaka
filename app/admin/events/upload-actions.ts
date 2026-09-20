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

// Mints short-lived credentials so the admin's browser can upload a
// (client-compressed) photo/video directly to Cloudinary and to the
// object-storage backup bucket, bypassing our own serverless function
// entirely — see lib/media/cloudinary.ts and lib/media/object-storage.ts
// for why that matters on Vercel.
export async function getUploadCredentials(
  fileName: string,
  contentType: string
): Promise<MediaUploadCredentials> {
  await requireAdmin()

  const unique = `${Date.now()}-${randomUUID().slice(0, 8)}-${sanitizeFileName(fileName)}`

  const cloudinary = signCloudinaryUpload("events")
  const backup = await presignBackupUpload(`events/${unique}`, contentType)

  return { cloudinary, backup }
}
