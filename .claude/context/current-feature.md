# Current Feature

## Status

No feature currently in progress.

## Notes

(none)

## History

- [Navigation shell UI refresh — top nav & sidebar](features/nav-shell-ui-refresh-prd.md) —
  completed, verified, **not yet committed**. Branch `feature/navigation-ui-updates`.
  Verified: `lint`, `typecheck`, `storybook:typecheck`, `build` (all 9 projects),
  `test:query` (4/4), `storybook:test` (187/187, including the shell's new stories), plus
  real-browser checks of both sidebar states, the account menu, dark mode, and the
  responsive tenant-name behaviour below. The PRD is up to date with the actual
  implementation, including everything discovered while building (see its §11).
  - Presentation-layer refresh of the existing shell, not new navigation capability.
    Routes, section grouping, and the collapse mechanism are unchanged.
  - Three intake decisions: the tenant name becomes static text (workspace switcher
    removed), the theme toggle is removed entirely, and `UserDetails` gains an optional
    `avatarUrl`.
  - Removing the theme toggle leaves no UI route to dark mode — the persisted preference
    still applies at boot, but nothing in the UI can change it anymore. Needs a
    replacement entry point before dark mode ships to users; not solved here.
  - Mid-build, the collapsed sidebar was redirected away from its Figma frame (icon-only,
    tooltip-driven) to keep every label visible, stacked under its icon and wrapping as
    needed — PRD §6.3/§11 explain why. The reference behind that decision was a screenshot
    pasted mid-conversation, not a Figma node, and it was never saved to
    `.claude/context/screenshots/` — a gap worth closing since every other visual in the
    PRD has a durable, linkable source and this one doesn't.
  - The top nav's responsive behaviour needed real design work, not just breakpoint
    tweaks: an early attempt hid the tenant name below `lg` and only afterward discovered
    the reveal classes had no matching `hidden` base, so the elements were never actually
    hiding — they were always rendered and getting flex-shrunk into unreadable stubs
    ("Nor…", "N."). A two-row header redesign was tried and rejected by the user as not
    looking right. The shipped fix, directed by the user: the tenant name stays inline
    ≥1240px and relocates into the account dropdown (above the user's name, its own
    divider) below that — a new `--breakpoint-nav: 77.5rem` token in `theme.css` marks
    the cutoff precisely rather than approximating with a stock Tailwind breakpoint.
  - A `pnpm install`/`nx run-many` side effect silently rewrote `package.json`'s `dev`
    script parallelism (3→4) at some point this session. Unrelated to this feature;
    reverted before marking complete. Worth a light eye on `git status` after heavy Nx
    usage in this repo in case it recurs.

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
