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

  return (
    <div className="flex items-center justify-center gap-3 pt-4">
      <Button
        render={<Link href={buildHref(Math.max(1, page - 1))} />}
        variant="outline"
        size="sm"
        disabled={page <= 1}
      >
        Previous
      </Button>
      <span className="text-xs text-muted-foreground">
        Page {page} of {totalPages}
      </span>
      <Button
        render={<Link href={buildHref(Math.min(totalPages, page + 1))} />}
        variant="outline"
        size="sm"
        disabled={page >= totalPages}
      >
        Next
      </Button>
    </div>
  )
}
