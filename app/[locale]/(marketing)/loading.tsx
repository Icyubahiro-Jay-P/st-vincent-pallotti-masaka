export default function Loading() {
  return (
    <div className="flex flex-col gap-px bg-border">
      <div className="h-96 animate-pulse bg-muted" />
      <div className="h-64 animate-pulse bg-muted" />
      <div className="h-64 animate-pulse bg-muted" />
    </div>
  )
}
