/**
 * A tiled field of imigongo-style diamonds (paired triangles), sized for use
 * as a full panel background. Real panels alternate solid and open shapes in
 * black and white, so this alternates a solid diamond with an outlined one
 * per tile rather than varying the opacity of a single tint. Pass an
 * adaptive foreground-token className (text-foreground / text-ink-foreground)
 * so it reads correctly on both light and dark surfaces.
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
          <polygon points="10,1 19,10 10,19 1,10" fill="currentColor" />
          <polygon
            points="30,21 39,30 30,39 21,30"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </pattern>
      </defs>
      <rect width="200" height="200" fill="url(#imigongo-field)" />
    </svg>
  )
}
