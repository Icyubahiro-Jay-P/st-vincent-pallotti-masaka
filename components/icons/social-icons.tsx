// Lucide dropped brand/social marks, so these are small hand-built glyphs
// (basic shapes, not traced brand artwork) sized to match lucide's 24x24 grid.

export function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <circle
        cx="12"
        cy="12"
        r="4.25"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <circle cx="17.15" cy="6.85" r="1.15" fill="currentColor" />
    </svg>
  )
}

export function YoutubeGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="2.5"
        y="5.5"
        width="19"
        height="13"
        rx="4"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path d="M10.3 9.3v5.4l4.9-2.7-4.9-2.7Z" fill="currentColor" />
    </svg>
  )
}

export function FacebookGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M13.6 21V13h2.1l.3-2.6h-2.4V8.7c0-.75.2-1.26 1.28-1.26h1.37V5.12C15.94 5.08 15.13 5 14.18 5c-1.97 0-3.32 1.2-3.32 3.42v1.98H8.75V13h2.11v8h2.74Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function XGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M5 5l14 14M19 5 5 19"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
      />
    </svg>
  )
}
