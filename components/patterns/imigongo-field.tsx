/**
 * A tiled field of the same imigongo-inspired triangles, sized for use as a
 * full panel background (e.g. behind the hero crest) rather than a rule.
 */
export function ImigongoField({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      role="presentation"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern
          id="imigongo-field"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <polygon points="0,40 20,40 0,20" fill="currentColor" opacity="0.5" />
          <polygon points="20,40 40,40 40,20" fill="currentColor" opacity="0.18" />
          <polygon points="0,0 20,0 0,20" fill="currentColor" opacity="0.18" />
          <polygon points="20,0 40,0 40,20" fill="currentColor" opacity="0.32" />
          <circle cx="20" cy="20" r="3" fill="currentColor" opacity="0.4" />
        </pattern>
      </defs>
      <rect width="200" height="200" fill="url(#imigongo-field)" />
    </svg>
  )
}
