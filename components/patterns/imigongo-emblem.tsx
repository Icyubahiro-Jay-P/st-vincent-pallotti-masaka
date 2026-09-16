/**
 * A single imigongo-inspired composition, not a tiled pattern: a solid
 * triangular wedge ("ibaba") balanced diagonally against an outlined
 * mirror wedge, a coil ("the cycle of life") filling the negative space
 * between them, and one small diamond ("abashi") accent. Real panels use
 * a few large confident shapes with strong positive/negative contrast
 * rather than a repeating decorative texture, so this draws each shape
 * once instead of tiling. The coil's path is duplicated from
 * imigongo-spiral.tsx rather than nesting that component, since nested
 * <svg> sizing is inconsistent across browsers for an unverifiable visual.
 */
export function ImigongoEmblem({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="presentation"
      aria-hidden="true"
    >
      <polygon points="0,0 150,0 0,150" fill="currentColor" />
      <polygon
        points="200,200 50,200 200,50"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <polygon points="30,155 48,173 30,191 12,173" fill="currentColor" />
      <g transform="translate(65 65) scale(0.7)">
        <path
          d="M50 50 L54 50 L54 54 L46 54 L46 46 L58 46 L58 58 L42 58 L42 42 L62 42 L62 62 L38 62 L38 38 L66 38 L66 66"
          fill="none"
          stroke="currentColor"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  )
}
