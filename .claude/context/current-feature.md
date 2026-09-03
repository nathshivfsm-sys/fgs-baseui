# Current Feature

## Status

**Replace native HTML typography with `@cms/ui` Typography** — in progress on
`feature/typography-component-migration`.

Settings already consumes `Heading1` / `BodySmall`. This pass replaces remaining
`<p>` / `<h1>`–`<h6>` usage in apps and shared UI with the existing level
components (`Heading1`–`Heading4`, `Body`, `BodySmall`), keeping heading
semantics and overlaying `className` / `color` / `bold` only where the current
visuals sit off the default scale (caption size, tenant wordmark, etc.).

Native `<label>`, `<span>`, SVG markup, and the Typography renderer itself are
out of scope.

## History

- [Login screen redesign — "Verify your account"](features/login-screen-redesign-prd.md)
— implemented and verified, **committed on `feature/navigation-ui-updates` (continuing
that branch per user direction rather than cutting a new one), not yet merged or
reviewed**.

Rebuilt `LoginPage` to match the Figma "Verify your account" screen: Email/Mobile Phone
segmented tabs (Email active by default — Figma defaults to Mobile Phone), no password
field, Next authenticates through the existing `@cms/shared-auth` `login()` call exactly
as the old Sign in button did. Mobile Phone renders for visual parity but has no SMS
backend, so its Next stays disabled. `PublicShell` (shared by `/login` and the invoice
remote's public payment page) gets the new brand banner and footer from the same frame.

Two commits, on top of `51f14fa` (tip of `feature/navigation-ui-updates` at the time):

| Commit | Scope |
| --------- | -------------------------------------------------------------- |
| `395db9b` | `feat(ui)` — segmented Tabs variant, four icons traced from the Login Figma frame |
| `28f49ed` | `feat(shell)` — LoginPage rebuild, PublicShell banner/footer |

## Notes

- Verified with `lint`, `typecheck` (both clean for `ui`/`shell` — one pre-existing,
  unrelated `TopNav.stories.tsx` typecheck failure at `HEAD` before this work started:
  it imports `MOCK_CURRENT_USER`, which `store/constants.ts` no longer exports), `build`
  (shell), `test:query` (4/4), `storybook:test` (202/202 after fixing two AA
  color-contrast failures the a11y checks caught — inactive segmented-tab text and the
  "or" divider text were both too light on their backgrounds; swapped to darker existing
  tokens rather than inventing new ones), plus a scripted Playwright pass against the
  real dev servers (login → redirect → authenticated shell, logout, Mobile-Phone-tab
  disabled-Next, and the invoice public payment page), zero console errors.
- Icons were traced from the actual Figma vector paths (via `get_design_context`), not
  approximated — `MailIcon`, `MobileIcon`, `PhoneLineIcon`, `HexLogoIcon` all live in
  `libs/ui/src/icons`. `PhoneLineIcon` is deliberately separate from the pre-existing
  `PhoneIcon` (used in `TopNav.tsx`) since the glyphs don't match.
- Intake decisions (asked up front, not guessed): password removed entirely rather than
  hidden behind a second step; Mobile Phone tab kept in the UI (not removed) but wired to
  do nothing; the new banner/footer apply to the shared `PublicShell`, not just the login
  page. Full rationale and remaining open questions (the demo password still being
  supplied invisibly to `login()`, footer/help-link destinations, "FSM" vs "FieldPro"
  naming) are in the PRD's §11.
- Auth-based routing's own status (below, in History) is unaffected by this — this
  feature only reshapes the login screen and public chrome on top of it.
- **Unplanned but load-bearing: `resolve.alias` was silently defeating Module Federation
  `singleton: true` for every `@cms/*` package.** An alias rewrites the bare specifier
  before the plugin can wrap the import in `loadShare`, so the shared scope was bypassed
  and each container bundled its own copy. Invisible until `@cms/shared-auth` added a
  React context — remotes then threw `useAuth must be used within an AuthProvider` in
  both dev and the production build. `libs/ui/README.md` had already flagged the
  plugin's warning about this as unexplained; it is now diagnosed and fixed.
  - Fix: each library's `package.json` `exports` points at its own source, and the alias
    is gone from all four apps plus the generator template. Storybook keeps aliasing
    (no MF there, and the workspace root has no `@cms/*` symlinks) — moved to
    `.storybook/aliases.ts` so it cannot be reached for from a federation config.
  - Cost: the `'@cms/ui/'` prefix-share had to go — the plugin resolves a prefix share
    against the package root, not through `exports`, and failed the build looking for
    `libs/ui/index.js`. `@cms/ui/<subpath>` imports still resolve but are no longer
    singletons. Safe today; nothing deep-imports.
  - Follow-up recorded in [defferred-work.md](defferred-work.md): publishing must
    generate a dist manifest rather than copy the source one through.
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

- [Auth-based routing](features/auth-based-routing.md) — implemented and verified,
  **committed on `feature/auth-based-routing` but not yet merged or reviewed**.

  Shared `@cms/shared-auth` library (session, `useAuth`, `RequireAuth`), a dummy login
  screen in the shell, and a hybrid public/private route table in the `invoice` remote:
  `/invoice/payment/:invoiceId` is public, `/invoice` and `/invoice/:invoiceId` are
  guarded. Public pages render under a logo-only top bar instead of the authenticated
  sidebar and top nav. (The login screen and public chrome built here were later
  redesigned — see Status above.)

  Five commits, branched from `develop` at `6f38d20`:

  | Commit | Scope |
  | --------- | -------------------------------------------------------------- |
  | `98b0cba` | `feat(shared-auth)` — the library, its MF singleton registration |
  | `f12980b` | `feat(shell)` — login page, guards on every nav route, logout, `getAuthToken` |
  | `a27a2be` | `feat(invoice)` — public payment route alongside guarded list/detail |
  | `b681120` | `docs` — this file |
  | `8c2f02b` | `fix(mf)` — the resolution fix below |

  - Verified with `lint`, `typecheck`, `build`, `test:query`, `storybook:test`
    (122/122), plus a 23-check scripted browser pass run against **both** the dev servers
    and the production `vite preview` build.

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
