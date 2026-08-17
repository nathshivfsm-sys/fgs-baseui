# Current Feature

## Status

Implementing `context/features/monorepo-architecture-remediation-prd.md`. Phases
1-4 done and verified (lint, typecheck, full build, `test:query`, real browser
checks). Requirements 30-31 (`nx release`/Verdaccio publish wiring) deferred —
publish target and trigger undecided by choice, not implemented. Not yet
committed.

## Notes

Surprises not already covered by the PRD itself:

- Verifying Phase 4 in a browser (not just typecheck) surfaced a pre-existing,
  unrelated runtime bug: `workorder`/`lead`/`shell` were missing `workspace:*`
  deps for the Phase-3 data-access libs and `@cms/shared-api` in their own
  `package.json`s, and `tools/integration` (home of `test:query`, part of CI's
  fast lane) had no `package.json` at all and wasn't covered by any
  `pnpm-workspace.yaml` glob — `test:query` was silently broken. Fixed.
- Built an unplanned Nx generator, `tools/generators/remote-app` (invoke via
  `npx nx g ./tools/generators/remote-app:remote-app <name>`), after this work
  exposed how manual and error-prone adding a new remote app was. It does not
  auto-wire a sidebar entry (icon/section/label is a design call); prints
  instructions instead. Proved it via `apps/invoice`, kept per user's choice —
  its pre-existing "Invoice" nav-config.tsx placeholder pointed at `/invoices`
  (plural) while the generator creates `/invoice` (singular, no pluralization);
  repointed it.

## History

- [Top nav + sidebar shell](features/top-nav-sidebar-prd.md) — completed,
  verified in browser, commit `cc0f939`. Branch point for the work above.
