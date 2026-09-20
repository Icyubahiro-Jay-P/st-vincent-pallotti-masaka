// Client-side only. Vercel serverless functions can't run a long-lived
// ffmpeg process, so video compression happens in the admin's browser via
// ffmpeg.wasm (self-hosted core in public/ffmpeg/, dynamically imported so
// it never touches the public site's bundle).
import type { FFmpeg } from "@ffmpeg/ffmpeg"

const MAX_BYTES = 24 * 1024 * 1024 // stay safely under the 25MB hard ceiling
const AUDIO_BITRATE = 96_000 // bits/sec
const MIN_VIDEO_BITRATE = 300_000 // bits/sec, floor so tiny/long clips stay watchable

let ffmpegPromise: Promise<FFmpeg> | null = null

async function loadFFmpeg(): Promise<FFmpeg> {
  if (!ffmpegPromise) {
    ffmpegPromise = (async () => {
      const { FFmpeg } = await import("@ffmpeg/ffmpeg")
      const { toBlobURL } = await import("@ffmpeg/util")
      const ffmpeg = new FFmpeg()
      const baseURL = "/ffmpeg"
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
      })
      return ffmpeg
    })()
  }
  return ffmpegPromise
}

function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video")
    video.preload = "metadata"
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src)
      resolve(video.duration || 0)
    }
    video.onerror = () => {
      URL.revokeObjectURL(video.src)
      reject(new Error("Could not read video metadata"))
    }
    video.src = URL.createObjectURL(file)
  })
}

export async function compressVideo(
  file: File,
  onProgress?: (ratio: number) => void
): Promise<File> {
  if (!file.type.startsWith("video/") || file.size <= MAX_BYTES) {
    return file
  }

  const duration = await getVideoDuration(file)
  if (!duration || !Number.isFinite(duration)) {
    // Can't safely target a bitrate without a duration; leave the file
    // as-is rather than risk an unbounded encode.
    return file
  }

  const ffmpeg = await loadFFmpeg()
  const progressHandler = onProgress
    ? ({ progress }: { progress: number }) =>
        onProgress(Math.min(1, Math.max(0, progress)))
    : undefined
  if (progressHandler) ffmpeg.on("progress", progressHandler)

  try {
    const targetBits = MAX_BYTES * 8 * 0.92 // headroom for container overhead
    const videoBitrate = Math.max(
      MIN_VIDEO_BITRATE,
      Math.floor(targetBits / duration) - AUDIO_BITRATE
    )

    const inputExt = file.name.match(/\.\w+$/)?.[0] ?? ".mp4"
    const inputName = `input${inputExt}`
    const outputName = "output.mp4"

    const { fetchFile } = await import("@ffmpeg/util")
    await ffmpeg.writeFile(inputName, await fetchFile(file))
    await ffmpeg.exec([
      "-i",
      inputName,
      "-b:v",
      `${videoBitrate}`,
      "-maxrate",
      `${videoBitrate}`,
      "-bufsize",
      `${videoBitrate * 2}`,
      "-b:a",
      `${AUDIO_BITRATE}`,
      "-vf",
      "scale='min(1280,iw)':-2",
      "-preset",
      "veryfast",
      "-movflags",
      "+faststart",
      outputName,
    ])

    const data = await ffmpeg.readFile(outputName)
    await ffmpeg.deleteFile(inputName)
    await ffmpeg.deleteFile(outputName)

    // Copy into a fresh Uint8Array: ffmpeg.wasm's FileData buffer type is
    // ArrayBufferLike (includes SharedArrayBuffer), which BlobPart rejects.
    const bytes = new Uint8Array(data as Uint8Array)
    const newName = file.name.replace(/\.\w+$/, "") + ".mp4"
    return new File([bytes], newName, { type: "video/mp4" })
  } finally {
    if (progressHandler) ffmpeg.off("progress", progressHandler)
  }
}
