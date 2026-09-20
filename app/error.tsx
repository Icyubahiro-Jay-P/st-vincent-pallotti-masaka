"use client"

import { Crest } from "@/components/crest"
import { Button } from "@/components/ui/button"

// Next's error boundary contract: this file must be a Client Component and
// receives exactly these two props. It catches errors thrown below the root
// layout — a root-layout error instead hits global-error.tsx, which this
// can't catch (per Next's docs).
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background px-4 text-center">
      <Crest size={64} />
      <div className="flex flex-col gap-1.5">
        <h1 className="font-heading text-xl font-semibold text-foreground">
          Something went wrong
        </h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          We hit an unexpected error loading this page. Please try again, or
          come back in a moment.
        </p>
        {error.digest && (
          <p className="text-xs text-muted-foreground/70">
            Reference: {error.digest}
          </p>
        )}
      </div>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  )
}
