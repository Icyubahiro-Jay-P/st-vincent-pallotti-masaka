#!/usr/bin/env node
// ponytail: plain fetch + exit code, no test framework — this only needs
// to fail loudly on a broken deploy, not report granular results.

const baseUrl = process.argv[2]
if (!baseUrl) {
  console.error("Usage: node scripts/smoke-test.mjs <deployment-url>")
  process.exit(1)
}

const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET
const headers = bypassSecret
  ? { "x-vercel-protection-bypass": bypassSecret }
  : {}

const ROUTES = ["/", "/admin/login", "/news", "/admissions"]
const ERROR_MARKERS = ["Something went wrong", "Application error"]

async function checkRoute(path) {
  const url = new URL(path, baseUrl).toString()
  const res = await fetch(url, { redirect: "manual", headers })

  if (res.status >= 400) {
    throw new Error(`${path} -> HTTP ${res.status}`)
  }

  const body = await res.text()
  const hit = ERROR_MARKERS.find((marker) => body.includes(marker))
  if (hit) {
    throw new Error(`${path} -> error boundary text found: "${hit}"`)
  }

  console.log(`ok: ${path} (${res.status})`)
}

const results = await Promise.allSettled(ROUTES.map(checkRoute))
const failures = results.filter((r) => r.status === "rejected")

if (failures.length > 0) {
  for (const f of failures) console.error(String(f.reason))
  console.error(`${failures.length}/${ROUTES.length} smoke checks failed`)
  process.exit(1)
}

console.log(`all ${ROUTES.length} smoke checks passed`)
