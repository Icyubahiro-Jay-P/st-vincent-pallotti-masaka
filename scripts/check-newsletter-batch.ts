import assert from "node:assert/strict"

import { chunk } from "@/lib/newsletter/send-event-newsletter"

const sizes = chunk(Array.from({ length: 250 }), 100).map(
  (group) => group.length
)
assert.deepEqual(sizes, [100, 100, 50], `expected [100, 100, 50], got ${sizes}`)

assert.deepEqual(chunk([], 100), [], "empty input should chunk to no groups")
assert.deepEqual(chunk(Array.from({ length: 5 }), 100), [
  Array.from({ length: 5 }),
])

console.log("[check-newsletter-batch] chunk() ok")
