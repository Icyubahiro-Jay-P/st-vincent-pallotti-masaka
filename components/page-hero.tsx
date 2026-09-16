export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description?: string
}) {
  return (
    <section className="border-b border-border bg-ink py-14 text-ink-foreground sm:py-18">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">
          {eyebrow}
        </p>
        <h1 className="mt-3 max-w-2xl font-heading text-[clamp(2.25rem,1.8rem+2vw,3.5rem)] font-semibold tracking-tight">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 max-w-xl text-sm/relaxed text-ink-foreground/75">
            {description}
          </p>
        ) : null}
      </div>
    </section>
  )
}
