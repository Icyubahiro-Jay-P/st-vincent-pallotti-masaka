import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Crest } from "@/components/crest"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <section className="flex flex-col items-center gap-6 px-4 py-24 text-center">
      <Crest size={64} />
      <p className="font-heading text-6xl font-semibold text-primary">404</p>
      <h1 className="font-heading text-2xl font-semibold text-foreground">
        This page has stepped out
      </h1>
      <p className="max-w-sm text-sm/relaxed text-muted-foreground">
        The page you&rsquo;re looking for doesn&rsquo;t exist. Let&rsquo;s get
        you back on the path.
      </p>
      <Button render={<Link href="/" />} className="h-11 px-6 text-sm">
        Back to Homepage
        <ArrowRight data-icon="inline-end" />
      </Button>
    </section>
  )
}
