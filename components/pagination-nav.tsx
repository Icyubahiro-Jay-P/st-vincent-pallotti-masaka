import Link from "next/link"

import { Button } from "@/components/ui/button"

export function PaginationNav({
  page,
  totalPages,
  buildHref,
}: {
  page: number
  totalPages: number
  buildHref: (page: number) => string
}) {
  if (totalPages <= 1) return null

  const isFirst = page <= 1
  const isLast = page >= totalPages

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-3 pt-4"
    >
      <Button
        render={
          isFirst ? (
            <span />
          ) : (
            <Link href={buildHref(Math.max(1, page - 1))} rel="prev" />
          )
        }
        variant="outline"
        size="sm"
        disabled={isFirst}
      >
        Previous
      </Button>
      <span className="text-xs text-muted-foreground">
        Page {page} of {totalPages}
      </span>
      <Button
        render={
          isLast ? (
            <span />
          ) : (
            <Link href={buildHref(Math.min(totalPages, page + 1))} rel="next" />
          )
        }
        variant="outline"
        size="sm"
        disabled={isLast}
      >
        Next
      </Button>
    </nav>
  )
}
