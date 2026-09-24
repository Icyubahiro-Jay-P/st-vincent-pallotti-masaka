import Link from "@/components/locale-link"
import { ArrowRight } from "lucide-react"

import { Crest } from "@/components/crest"
import { Button } from "@/components/ui/button"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { getLocale } from "@/lib/i18n/get-locale"

export default async function NotFound() {
  const locale = await getLocale()
  const nf = getDictionary(locale).notFound

  return (
    <section className="flex flex-col items-center gap-6 px-4 py-24 text-center">
      <Crest size={64} />
      <p className="font-heading text-6xl font-semibold text-primary">
        {nf.code}
      </p>
      <h1 className="font-heading text-2xl font-semibold text-foreground">
        {nf.title}
      </h1>
      <p className="max-w-sm text-sm/relaxed text-muted-foreground">
        {nf.description}
      </p>
      <Button render={<Link href="/" />} className="h-11 px-6 text-sm">
        {nf.cta}
        <ArrowRight data-icon="inline-end" />
      </Button>
    </section>
  )
}
