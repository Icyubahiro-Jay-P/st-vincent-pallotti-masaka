import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"

import { siteConfig } from "@/lib/site-config"

// Link-preview card (WhatsApp, Facebook, X) for every public page. Pages
// that set their own openGraph point back here via ogImages() in
// lib/i18n/alternates.ts. Colors are the site's --primary tokens from
// app/globals.css (navy light-mode primary, gold dark-mode primary).
export const alt = siteConfig.name
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const navy = "#1c2b45"
const gold = "#d9a53a"

export default async function Image() {
  const badge = await readFile(join(process.cwd(), "public/badge.jpg"))
  const badgeSrc = `data:image/jpeg;base64,${badge.toString("base64")}`

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        gap: 64,
        padding: "0 96px",
        background: navy,
        color: "white",
        borderBottom: `16px solid ${gold}`,
      }}
    >
      <img
        src={badgeSrc}
        width={260}
        height={260}
        alt=""
        style={{ borderRadius: 24 }}
      />
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.1 }}>
          {siteConfig.name}
        </div>
        <div
          style={{ width: 120, height: 6, background: gold, margin: "36px 0" }}
        />
        <div style={{ fontSize: 40, color: gold }}>{siteConfig.motto}</div>
        <div style={{ fontSize: 30, marginTop: 16, opacity: 0.8 }}>
          {siteConfig.location}
        </div>
      </div>
    </div>,
    size
  )
}
