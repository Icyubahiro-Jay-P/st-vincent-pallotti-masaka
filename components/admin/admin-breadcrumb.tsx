import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function AdminBreadcrumb({
  items,
}: {
  items: { label: string; href?: string }[]
}) {
  const backHref =
    items.length >= 2 ? items[items.length - 2].href : items[0]?.href

  return (
    <div className="flex flex-col gap-2">
      {backHref && (
        <Link
          href={backHref}
          className="inline-flex w-fit items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-3.5" />
          Back
        </Link>
      )}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-xs text-muted-foreground"
      >
        {items.map((item, index) => (
          <span key={item.label} className="flex items-center gap-1.5">
            {index > 0 && <ChevronRight className="size-3 shrink-0" />}
            {item.href ? (
              <Link href={item.href} className="hover:text-foreground">
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground" aria-current="page">
                {item.label}
              </span>
            )}
          </span>
        ))}
      </nav>
    </div>
  )
}
