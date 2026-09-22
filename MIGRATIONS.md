# Migration runbook (manual, expand/contract)

Migrations are NOT part of the deploy pipeline (`npm run db:migrate` /
`drizzle-kit migrate` stays a manual, human-run command against Neon). Blue
and green deployments can both be live against the same database for the
window between a green deployment going live via `vercel promote` and blue
no longer being a plausible rollback target — so schema changes must stay
safe for *both* the old and new app code to run against at once.

## Rule of thumb: expand, deploy, contract — as separate releases

1. **Expand** — ship an additive-only migration (new nullable column, new
   table, new index) *before* any app code depends on it. Run
   `npm run db:migrate` manually, confirm it applied cleanly, then push the
   code that reads/writes the new column. Old (blue) code must still run
   fine against the expanded schema — it just ignores the new column.
2. **Deploy** — push app code through the normal blue-green flow. Rollback
   via `vercel promote <previous-deployment-id>` stays safe because the
   schema is still backward-compatible with the prior release.
3. **Contract** — only once you're confident you won't roll back past the
   expand step, ship a *separate* migration that drops/renames/tightens
   anything the old code needed. Never combine contract with the release
   that stops needing the old shape — that removes your rollback safety net.

## Never in one migration

- Renaming or dropping a column/table still read by the currently-live
  (blue) deployment.
- Adding a `NOT NULL` constraint without a safe default, in the same
  release as code that starts relying on it.
- Changing a column's type in place — add new column, backfill, swap reads,
  drop old column, as separate steps.

## Before running `npm run db:migrate` against production

- [ ] Migration is additive-only (or a contract step for a release that's
      been stable for a while).
- [ ] Old app code (whatever's still a plausible rollback target) still
      works against the new schema.
- [ ] Applied and verified locally / against a scratch DB first.
- [ ] Run `npm run db:migrate` manually — intentionally never wired into
      CI or the deploy workflow.
