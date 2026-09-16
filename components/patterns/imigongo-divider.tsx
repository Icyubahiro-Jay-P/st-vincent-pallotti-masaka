/**
 * A bold triangular band inspired by imigongo, the traditional Rwandan
 * relief art, used as a section rule so the site's Rwandan setting shows up
 * as a real graphic motif rather than a stock photo. Real imigongo panels
 * are carved and painted in stark black and white (occasionally red-brown),
 * so this renders as solid marks alternating with open, outlined ones in a
 * single adaptive color rather than a tinted wash: pass a foreground-token
 * className (e.g. text-foreground or text-ink-foreground) so it reads as
 * true black-on-light or white-on-dark in both themes.
 */
export function ImigongoDivider({ className }: { className?: string }) {
  const count = 8
  const width = 20

  return (
    <svg
      viewBox={`0 0 ${count * width} 20`}
      preserveAspectRatio="xMidYMid meet"
      className={className}
      role="presentation"
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, i) => {
        const x = i * width
        const points = `${x},20 ${x + width},20 ${x + width / 2},0`
        const solid = i % 2 === 0
        return (
          <polygon
            key={i}
            points={points}
            fill={solid ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={solid ? 0 : 1.5}
            strokeLinejoin="round"
          />
        )
      })}
    </svg>
  )
}
