# Current Feature

## Status

No feature currently in progress.

## Notes

(none)

## History

- [Top nav + sidebar shell](features/top-nav-sidebar-prd.md) — completed,
  verified in browser, commit `cc0f939`. Branch point for the work below.
- [Monorepo architecture remediation](features/monorepo-architecture-remediation-prd.md)
  — Phases 1-4 completed, verified (lint, typecheck, full build, `test:query`,
  real browser checks), committed `c24fb10`. Remaining items tracked in
  [defferred-work.md](defferred-work.md).
  - Surprises: Phase 4 browser verification surfaced a pre-existing, unrelated
    runtime bug — `workorder`/`lead`/`shell` were missing `workspace:*` deps
    for the Phase-3 data-access libs and `@cms/shared-api`, and
    `tools/integration` (home of `test:query`, part of CI's fast lane) had no
    `package.json` and wasn't covered by any `pnpm-workspace.yaml` glob, so
    `test:query` was silently broken. Fixed.
  - Built an unplanned Nx generator, `tools/generators/remote-app` (invoke via
    `npx nx g ./tools/generators/remote-app:remote-app <name>`), after this
    work exposed how manual and error-prone adding a new remote app was. It
    does not auto-wire a sidebar entry (icon/section/label is a design call);
    prints instructions instead. Proved it via `apps/invoice`, kept per
    user's choice — its pre-existing "Invoice" nav-config.tsx placeholder
    pointed at `/invoices` (plural) while the generator creates `/invoice`
    (singular, no pluralization); repointed it.
