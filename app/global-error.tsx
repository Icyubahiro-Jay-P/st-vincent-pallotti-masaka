"use client"

import "./globals.css"

// Catches errors thrown in the root layout itself, which app/error.tsx
// can't reach — per Next's contract this replaces the whole document, so it
// renders its own <html>/<body> and stays free of anything (fonts,
// providers, other components) that could itself fail to load.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body>
        <div
          style={{
            display: "flex",
            minHeight: "100svh",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            padding: "1rem",
            textAlign: "center",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <h1 style={{ fontSize: "1.25rem", fontWeight: 600 }}>
            Saint Vincent Pallotti School Masaka
          </h1>
          <p style={{ maxWidth: "24rem", color: "#666" }}>
            Something went wrong loading the site. Please try again.
          </p>
          {error.digest && (
            <p style={{ fontSize: "0.75rem", color: "#999" }}>
              Reference: {error.digest}
            </p>
          )}
          <button
            onClick={() => reset()}
            style={{
              padding: "0.5rem 1.25rem",
              background: "#1a2b4c",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
