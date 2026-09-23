import type { ImageLoaderProps } from "next/image"

// Asks Cloudinary for a resized, browser-friendly version of a delivery URL.
// f_auto picks WebP/AVIF/JPEG per browser, so HEIC originals still display,
// and Cloudinary does the optimizing instead of the Next image optimizer.
// Non-Cloudinary URLs (legacy Vercel Blob covers) pass through unchanged.
export function cloudinaryUrl(src: string, width: number, quality?: number) {
  if (!src.includes("res.cloudinary.com") || !src.includes("/upload/")) {
    return src
  }
  const transform = `f_auto,q_${quality ?? "auto"},c_limit,w_${width}`
  return src.replace("/upload/", `/upload/${transform}/`)
}

export function cloudinaryLoader({ src, width, quality }: ImageLoaderProps) {
  return cloudinaryUrl(src, width, quality)
}
