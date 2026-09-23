import { S3Client } from "@aws-sdk/client-s3"
import { createPresignedPost } from "@aws-sdk/s3-presigned-post"

function getConfig() {
  const endpoint = process.env.AWS_ENDPOINT_URL_S3
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
  const region = process.env.AWS_REGION
  const bucket = process.env.BUCKET_NAME
  if (!endpoint || !accessKeyId || !secretAccessKey || !region || !bucket) {
    throw new Error(
      "Object storage is not configured: set AWS_ENDPOINT_URL_S3, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION and BUCKET_NAME in .env"
    )
  }
  return { endpoint, accessKeyId, secretAccessKey, region, bucket }
}

let client: S3Client | null = null

function getClient(config: ReturnType<typeof getConfig>) {
  if (!client) {
    client = new S3Client({
      endpoint: config.endpoint,
      region: config.region,
      // Neon's S3-compatible endpoint only has a TLS cert for
      // *.storage.<project>...neon.tech, one subdomain level deep. The SDK's
      // default virtual-hosted-style addressing puts the bucket in ANOTHER
      // subdomain level (<bucket>.<endpoint>), which doesn't match that cert
      // and fails TLS validation. Path-style keeps the bucket in the URL
      // path instead, matching the cert Neon actually serves.
      forcePathStyle: true,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    })
  }
  return client
}

export type BackupUploadCredentials = {
  url: string
  fields: Record<string, string>
  key: string
}

const MAX_BACKUP_BYTES = 30 * 1024 * 1024 // headroom above the 25MB video ceiling

// Presigned POST so the raw/original file goes straight from the admin's
// browser into the private backup bucket, the same direct-upload pattern
// as Cloudinary, so the file never touches our serverless function.
export async function presignBackupUpload(
  key: string,
  contentType: string
): Promise<BackupUploadCredentials> {
  const config = getConfig()
  const { url, fields } = await createPresignedPost(getClient(config), {
    Bucket: config.bucket,
    Key: key,
    Conditions: [
      ["content-length-range", 0, MAX_BACKUP_BYTES],
      ["eq", "$Content-Type", contentType],
    ],
    Fields: { "Content-Type": contentType },
    Expires: 300,
  })
  return { url, fields, key }
}

// For server-side scripts that PutObject directly (e.g. scripts/import-assets.ts).
export function getBackupStorage() {
  const config = getConfig()
  return { client: getClient(config), bucket: config.bucket }
}
