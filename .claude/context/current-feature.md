# Current Feature

## Status

[Auth-based routing](features/auth-based-routing.md) — implemented and verified on
`feature/auth-based-routing`, **not yet committed** (awaiting review).

Shared `@cms/shared-auth` library (session, `useAuth`, `RequireAuth`), a dummy login
screen in the shell, and a hybrid public/private route table in the `invoice` remote:
`/invoice/payment/:invoiceId` is public, `/invoice` and `/invoice/:invoiceId` are
guarded. Public pages render under a logo-only top bar instead of the authenticated
sidebar and top nav.

## Notes

- Verified with `lint`, `typecheck`, `build`, `test:query`, `storybook:test`
  (122/122), plus a 23-check scripted browser pass run against **both** the dev servers
  and the production `vite preview` build.
- Two pre-existing failures are unrelated to this work and were not fixed:
  - `<%= name %>:lint` / `<%= name %>:typecheck` — Nx registers
    `tools/generators/remote-app/files/project.json` (an EJS template) as a phantom
    project whose targets point at `apps/<%= name %>`, a path that never exists.
  - `[ Module Federation DTS ] Failed to generate type declaration #TYPE-001` — emitted
    by every remote build including untouched ones (`lead`, `workorder`); non-fatal,
    the build succeeds.
- **Do not run `pnpm run format`** on this checkout — Prettier rewrites CRLF to LF across
  every tracked file, producing a ~250-file diff. Format only the files you touched.

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
- Radix UI → Base UI migration (`@cms/ui`) — all six interactive primitives
  migrated, `@radix-ui/*` removed, and a new `Combobox` added, on
  `feature/shadcn-cli-alignment`. Verified end-to-end (lint, typecheck,
  full build, `storybook:test` 82/82 cold cache, `test:query`, `pnpm audit`).
  - `bee6fe4` — add `@base-ui/react` dependency
  - `84fc5dc` — migrate Switch (spike; established the conventions reused below)
  - `c2710d1` — migrate Tabs
  - `427909f` — migrate RadioGroup
  - `e7872d4` — migrate Select
  - `32fc758` — add DropdownMenu stories (behavioral baseline, written before migrating it)
  - `c2132da` — migrate DropdownMenu + `TopNav.tsx` (landed together; MF shares `@cms/ui` as a singleton)
  - `c3bc058` — replace Button's `asChild` with Base UI's `render`
  - `bbb3bd9` — remove Radix dependencies (point of no return, tagged `pre-radix-removal`)
  - `b15c329` — add `Combobox` (the actual capability payoff — Radix never shipped one)
  - `fbf824f` — docs cleanup (`libs/ui/README.md`)
  - `b7625d0` — point `components.json` at the Base UI shadcn registry
    (`style: "base-nova"`, was `"new-york"`); also found via live testing
    that `npx shadcn add` didn't run in this repo at all (pre-existing
    alias-resolution mismatch, unrelated to Radix vs Base UI, not fixed
    in that commit). **Since fixed** — `tsconfig.base.json` now declares the
    `@cms/ui/*` wildcard, so the CLI resolves its aliases and `shadcn add`
    works, provided an explicit `--path` is passed; see `libs/ui/README.md`.
  - Known issue: the interactive `pnpm run storybook` dev preview renders
    `Switch`'s initial checked state wrong; isolated to that dev-server path
    only (not `storybook:test`, not the production build). Root cause not
    found after three attempts; documented in `libs/ui/README.md`.
