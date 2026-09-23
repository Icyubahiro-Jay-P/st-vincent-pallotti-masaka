import { neon, neonConfig } from "@neondatabase/serverless"
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http"

import * as schema from "./schema"

type Db = NeonHttpDatabase<typeof schema>

// neon-http has no built-in query timeout, so a stuck Neon endpoint would
// hang a serverless function until the platform's own (much longer)
// timeout. fetchOptions is a static object merged into every request and
// can't hold a fresh AbortSignal per call, so fetchFunction (the driver's
// documented hook for swapping in a custom fetch) is the only lever that
// gives each query its own deadline. Reads get one retry because the
// free-tier compute scales to zero and the first query after a nap can
// time out or drop while it wakes; writes never retry, since a query that
// already timed out isn't safe to blindly re-send.
const QUERY_TIMEOUT_MS = 10_000

function isReadOnly(body: RequestInit["body"]) {
  if (typeof body !== "string") return false
  try {
    const parsed = JSON.parse(body)
    // Single query: { query }; transaction: { queries: [{ query }] }
    const queries: { query?: string }[] = parsed.queries ?? [parsed]
    return queries.every((q) => /^\s*select\b/i.test(q.query ?? ""))
  } catch {
    return false
  }
}

neonConfig.fetchFunction = async (url: string, init?: RequestInit) => {
  const attempt = () =>
    fetch(url, { ...init, signal: AbortSignal.timeout(QUERY_TIMEOUT_MS) })
  try {
    return await attempt()
  } catch (error) {
    if (!isReadOnly(init?.body)) throw error
    return attempt()
  }
}

function createDb(): Db {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set")
  }
  return drizzle(neon(process.env.DATABASE_URL), { schema })
}

let instance: Db | undefined

// Lazy: constructing the real client (and checking DATABASE_URL) only
// happens on first actual query, not on import. Next's build-time
// page-data collection imports every route module just to read its config
// exports (e.g. sitemap.ts's `dynamic = "force-dynamic"`) without running
// any handler code, so an eager throw/connection here would fail the build
// even for routes that correctly defer their DB access to request time.
export const db = new Proxy({} as Db, {
  get(_target, prop, receiver) {
    if (!instance) instance = createDb()
    return Reflect.get(instance, prop, receiver)
  },
})
