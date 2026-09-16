/**
 * A coiled spiral accent, the single most recognisable imigongo motif
 * (traditionally a raised, rope-like coil). Built from straight steps with
 * rounded joins rather than true arcs, so the geometry stays exact while the
 * rounded corners still read as an organic coil. Ring spacing (6 units) is
 * kept comfortably wider than the stroke (3.5): at tighter spacing the
 * stroke overlaps itself and the whole coil fills in solid instead of
 * reading as nested rings. Adaptive: pass a foreground-token className so
 * it renders correctly on any surface.
 */
export function ImigongoSpiral({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role="presentation"
      aria-hidden="true"
    >
      <path
        d="M50 50 L56 50 L56 56 L44 56 L44 44 L62 44 L62 62 L38 62 L38 38 L68 38 L68 68"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
