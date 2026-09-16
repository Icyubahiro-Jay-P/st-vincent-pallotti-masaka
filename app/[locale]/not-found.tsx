import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Crest } from "@/components/crest"
import { Button } from "@/components/ui/button"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { defaultLocale } from "@/lib/i18n/config"

// A not-found.tsx inside a dynamic segment can't read the unmatched
// params, so this always renders in the default language. Good enough for
// a 404 page.
export default function NotFound() {
  const dict = getDictionary(defaultLocale)
  const nf = dict.notFound

  return (
    <section className="flex flex-col items-center gap-6 px-4 py-24 text-center">
      <Crest size={64} />
      <p className="font-heading text-6xl font-semibold text-primary">{nf.code}</p>
      <h1 className="font-heading text-2xl font-semibold text-foreground">
        {nf.title}
      </h1>
      <p className="max-w-sm text-sm/relaxed text-muted-foreground">
        {nf.description}
      </p>
      <Button render={<Link href={`/${defaultLocale}`} />} className="h-11 px-6 text-sm">
        {nf.cta}
        <ArrowRight data-icon="inline-end" />
      </Button>
    </section>
  )
}
