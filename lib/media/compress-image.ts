// Client-side only. Iteratively re-encodes an image via the native Canvas
// API (quality first, then dimensions) until it's under the target size.
// No image-processing dependency needed for this.
const DEFAULT_MAX_BYTES = 1.35 * 1024 * 1024 // ~1.3–1.4MB, per the 1.2–1.4MB spec

function canvasToBlob(
  canvas: HTMLCanvasElement,
  quality: number
): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality))
}

export async function compressImage(
  file: File,
  maxBytes: number = DEFAULT_MAX_BYTES
): Promise<File> {
  if (!file.type.startsWith("image/") || file.size <= maxBytes) {
    return file
  }

  const bitmap = await createImageBitmap(file)
  let width = bitmap.width
  let height = bitmap.height
  let quality = 0.9

  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  if (!ctx) return file

  let lastBlob: Blob | null = null

  for (let attempt = 0; attempt < 10; attempt++) {
    canvas.width = width
    canvas.height = height
    ctx.clearRect(0, 0, width, height)
    ctx.drawImage(bitmap, 0, 0, width, height)

    const blob = await canvasToBlob(canvas, quality)
    if (!blob) return file
    lastBlob = blob

    if (blob.size <= maxBytes) break

    // Alternate between dropping quality and shrinking dimensions so we
    // don't tank sharpness before trying a smaller image first.
    if (quality > 0.5) {
      quality -= 0.1
    } else {
      width = Math.round(width * 0.85)
      height = Math.round(height * 0.85)
    }

    if (width < 320 || height < 320) break
  }

  if (!lastBlob) return file

  const newName = file.name.replace(/\.\w+$/, "") + ".jpg"
  return new File([lastBlob], newName, { type: "image/jpeg" })
}
