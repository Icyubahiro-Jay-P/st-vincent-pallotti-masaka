import Image from "next/image"
import { cn } from "@/lib/utils"

/**
 * The school's own crest sits on a plain white field, so it's mounted on a
 * white medallion with a gold ring here, which keeps it legible on the navy
 * header/footer and in dark mode, rather than showing a stray white box.
 */
export function Crest({
  size = 44,
  ringClassName,
  className,
}: {
  size?: number
  ringClassName?: string
  className?: string
}) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-full bg-white ring-2 ring-gold",
        ringClassName
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src="/badge.jpg"
        alt="Saint Vincent Pallotti School Masaka crest"
        width={size}
        height={size}
        className={cn("rounded-full object-cover p-[2px]", className)}
        priority
      />
    </span>
  )
}
