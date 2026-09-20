import { v2 as cloudinary } from "cloudinary"

function getConfig() {
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  if (!apiKey || !apiSecret || !cloudName) {
    throw new Error(
      "Cloudinary is not configured: set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in .env"
    )
  }
  return { apiKey, apiSecret, cloudName }
}

export type CloudinaryUploadCredentials = {
  cloudName: string
  apiKey: string
  timestamp: number
  signature: string
  folder: string
}

// Mints a short-lived signature so the admin's browser can upload directly
// to Cloudinary (POST to https://api.cloudinary.com/v1_1/<cloud>/auto/upload)
// without routing the file through our own serverless function — Vercel
// caps request bodies well under the video size ceiling this feature needs.
export function signCloudinaryUpload(folder: string): CloudinaryUploadCredentials {
  const { apiKey, apiSecret, cloudName } = getConfig()
  const timestamp = Math.round(Date.now() / 1000)
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    apiSecret
  )
  return { cloudName, apiKey, timestamp, signature, folder }
}
