/**
 * A coiled spiral accent, the single most recognisable imigongo motif
 * (traditionally a raised, rope-like coil). Built from straight steps with
 * rounded joins rather than true arcs, so the geometry stays exact while the
 * rounded corners still read as an organic coil. Adaptive: pass a
 * foreground-token className so it renders correctly on any surface.
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
        d="M50 50 L54 50 L54 54 L46 54 L46 46 L58 46 L58 58 L42 58 L42 42 L62 42 L62 62 L38 62 L38 38 L66 38 L66 66"
        fill="none"
        stroke="currentColor"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
