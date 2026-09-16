/**
 * A carved-ridge band inspired by imigongo's zigzag "umuraza" (river)
 * motif: a handful of large triangular peaks rising from a shared solid
 * base, rather than small triangles floating with no base (which reads as
 * bunting/pennant trim, not a Rwandan motif). Fusing the peaks to a base
 * is what makes this read as one continuous carved ridge.
 */
export function ImigongoBand({ className }: { className?: string }) {
  const count = 4
  const width = 100 / count
  const baseY = 11

  return (
    <svg
      viewBox="0 0 100 14"
      preserveAspectRatio="none"
      className={className}
      role="presentation"
      aria-hidden="true"
    >
      <rect x="0" y={baseY} width="100" height="3" fill="currentColor" />
      {Array.from({ length: count }).map((_, i) => {
        const x = i * width
        const points = `${x},${baseY} ${x + width},${baseY} ${x + width / 2},0`
        const solid = i % 2 === 0
        return (
          <polygon
            key={i}
            points={points}
            fill={solid ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={solid ? 0 : 1.2}
            strokeLinejoin="round"
          />
        )
      })}
    </svg>
  )
}
