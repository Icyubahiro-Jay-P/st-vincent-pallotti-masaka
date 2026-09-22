import { neon } from "@neondatabase/serverless"
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http"

import * as schema from "./schema"

type Db = NeonHttpDatabase<typeof schema>

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
