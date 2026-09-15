/**
 * A thin geometric rule inspired by imigongo, the traditional Rwandan
 * triangle-and-spiral relief art — used as a section divider so the site's
 * Rwandan setting shows up as a real graphic motif, not a stock photo.
 */
export function ImigongoDivider({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 12"
      preserveAspectRatio="xMidYMid meet"
      className={className}
      role="presentation"
      aria-hidden="true"
    >
      <g fill="currentColor">
        {Array.from({ length: 20 }).map((_, i) => (
          <polygon
            key={i}
            points={
              i % 2 === 0
                ? `${i * 12},12 ${i * 12 + 12},12 ${i * 12 + 6},0`
                : `${i * 12},0 ${i * 12 + 12},0 ${i * 12 + 6},12`
            }
            opacity={i % 4 === 0 ? 1 : i % 2 === 0 ? 0.55 : 0.25}
          />
        ))}
      </g>
    </svg>
  )
}
