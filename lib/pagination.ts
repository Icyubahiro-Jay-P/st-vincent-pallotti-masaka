export const PAGE_SIZE = 20

export function parsePage(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value
  const page = Number.parseInt(raw ?? "1", 10)
  return Number.isFinite(page) && page > 0 ? page : 1
}

export function totalPages(totalCount: number): number {
  return Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
}
