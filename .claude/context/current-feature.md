# Current Feature

## Status

**Zone & Postal Code page** — implemented and browser-verified on
`feature/setup-tax-zone-api`. Settings route `company/zone-postal-code`
lists zones from `@cms/settings-data-access` against the Figma Zone &
Postal Code frame (node `127:915`). Setup cards for Zone and Postal
Codes navigate here. Postal codes have no API yet; that pane shows an
empty-state callout. Create Zone uses the Figma dialog (node `127:1176`):
two-column Code / Zone Name, description textarea, Cancel/Save. Edit
reuses the same layout.

## History

**Setup catalog APIs (Tax, TaxAuthority, Zone)** — implemented and verified
locally on `feature/setup-tax-zone-api`. Adds TanStack
Query options factories in `@cms/settings-data-access` from the FGS Setup
Service swagger (`/swagger/setup/v1/swagger.json`). One module folder per
resource (endpoints, keys, queries, mutations). Wire request/response DTOs live
in `@cms/settings-contract` (`libs/settings/contract`) so data-access, MSW, and
UI share one type.

Wire operations per module: list, detail, lookup, create (POST), update (PUT),
patch (PATCH). Responses are parsed with Zod; mutations invalidate their own
keys.

MSW handlers (one file per module) seed in-memory Tax / TaxAuthority / Zone
catalogs and cover list, detail, lookup, POST, PUT, and PATCH. Writes persist
for the session and parse request bodies with the same contract schemas.

Verified: `typecheck` and `lint` clean for `settings-contract`, `settings-data-access`,
and `shared-mocks`; `test:query` 33/33.

The Cursor rule for this layout is `.cursor/rules/mfe-lib-folder-structure.mdc`.

**MSW mock APIs (login + Settings)** — implemented and browser-verified
on `refactor/settings-data-flow`. Shared handlers in `@cms/shared-mocks`
(`libs/shared/mocks`), started from app bootstrap when
`VITE_USE_MOCK_API=true`. Query functions and `customFetch` are unchanged.

Verified: mock login returns Jordan Reed / companyId 1; Settings General Info
loads and saves against the in-memory company mock. With the flag `false`,
login hits the real `/api/v1/auth/refresh` (404 from Vite with no proxy) and
the leftover service worker is unregistered.

**Page-owned app structure** — implemented and verified locally, **not yet
committed**. Colocates page-only components, constants, types, and utils under
`pages/<PageName>/`, imports folders through `index.ts`, and uses `util/` instead
of app-local `lib/`. A Cursor rule lives at `.cursor/rules/page-folder-structure.mdc`.
No behaviour change.

### Verification

- `typecheck` and `lint` clean for `settings`, `invoice`, `shell`, `lead`, `workorder`.
- `test:query` 24/24.
- Vite production builds clean for `settings`, `invoice`, `lead`, `workorder`, `shell`.
- `ui:build` still fails on the pre-existing `DispatchBoardSpike.tsx:419` error.

**Settings data-flow refactor (scalability review follow-up)** — implemented and verified
locally, **not yet committed**. Branch `refactor/settings-data-flow`, cut from
`feature/company-general-info-api` at `3703ba9`.

No behaviour change. It removes the patterns that would not survive the next ten settings
forms, and makes the `UI → Form → Validation → Mutation → Cache → UI` path readable in one
pass by a person or an agent.

| Change | Why |
| ------------------------------------------------------------- | ------------------------------------------------------- |
| `AppProps` back to `{ runtime }`; `loadCompanySettings` / `saveCompanySettings` props and the `load` parameter on the query factory deleted | Per-endpoint DI props grew the remote's public interface with every endpoint, and made "does this call the network?" unanswerable from the screen |
| Stories drive `globalThis.fetch` via `createStoryApi()` in `.storybook/fixtures/api.ts` | One seam for every endpoint, at the same place `tools/integration` already stubs; stories now cover `customFetch` → Zod → mappers and assert the real PATCH body |
| New `companySettingsMutationOptions(companyId, queryClient)` | The write path and its invalidation now sit next to the key factory instead of being re-derived in the page |
| Save feedback derived from `mutation.isSuccess` / `mutation.error` | Two mirrored `useState`s plus six setter calls were one fact with two sources of truth |
| `CompanySettingsEditor` mounted only when `companyId` exists | Removes three `companyId ?? ''` fallbacks, the `enabled` flag, and a phantom `['company-settings', '']` cache entry |
| `SETTINGS_QUERY_KEYS` alias deleted | Two public names for one key factory |
| `companyGeneralInfoSchema` → `companyGeneralInfoFormSchema` | Makes the wire/form schema split obvious from the import list |
| `as Resolver<CompanyGeneralInfo>` cast deleted | Unnecessary (verified), and it would hide a real input/output mismatch the first time a schema uses `.default()` or `z.coerce` |
| `resetOptions: { keepDirtyValues: true }` | A background refetch of a changed record would otherwise discard in-progress edits |
| New `components/form/FormTextInput.tsx` + `FormSelectField.tsx` | Cuts the per-field `register` / `Controller` boilerplate to one line; the bespoke `isActive` switch stays a bare `Controller` |
| `forms-implementation-guide.md` rewritten (758 → ~150 lines) | The old guide described hooks, PTO/tax/BU schemas and file paths that no longer exist, so any agent following it would have built a second, wrong pattern. Now listed in `CLAUDE.md` and summarised in `coding-standards.md` |

### Verification

- `test:query` 24/24 (one new: the mutation factory invalidates the detail key).
- `typecheck` and `lint` clean for `settings`, `settings-data-access`, `integration`, `shell`.
- `storybook:typecheck`: only the pre-existing `DispatchBoardSpike.tsx:419` error.
- `storybook:test` 233/240 — the same 7 pre-existing failures (`TopNav` ×6,
  `LoginPage > Successful Login`). All 13 settings stories pass.
- `settings:build` and `shell:build` clean. `ui:build` fails on the pre-existing
  `DispatchBoardSpike.tsx:419` FullCalendar typing error, untouched here.
- Not re-run in a real browser against the live API; the save path is covered by the
  story assertions on the recorded PATCH body.

**[Company General Info — API-backed edit form](features/company-general-info-api-prd.md)**
— spec and [implementation plan](features/company-general-info-api-plan.md) written;
**implemented and verified locally, not yet committed, not browser-tested against the
live API**. Branch `feature/company-general-info-api`, cut from
`feature/api-login-access-token` at `147e29f`.

Rebuilds the Settings › Company › General Info screen to the Figma design (node
`75-6519`), loads it from `GET /api/v1/company/{companyId}` and saves with
`PATCH /api/v1/company/{companyId}` (dirty fields only). `companyId` comes from the
`/auth/refresh` login response via `UserDetails.companyId`. Branding / Logo and
Non-Working Days are UI only; addresses are read-only. The old PTO / tax-code /
business-unit sections and the in-memory mock store are removed.

The schema is built from a real `GET /company/1` response (redacted fixture in
`tools/integration/src/fixtures/company-response.ts`). `companyId` is
`data.user.companyId` (number `1`), which equals the company's `companyNumber`, not
its `id` (`52`). Code and Company Number are read-only by decision.

### Verification

- `test:query` 16/16 (11 new: mapping, phone round-trip, dirty-only PATCH, URL, bearer,
  abort signal, `ApiError` propagation).
- `typecheck` and `lint` clean on all 14 real projects. The only failure is the
  pre-existing phantom `<%= name %>` generator-template project.
- `storybook:typecheck`: only the pre-existing `DispatchBoardSpike.tsx:419` error.
- `storybook:test` 231/239. The 7 failures are all pre-existing (`TopNav` ×6,
  `LoginPage > Successful Login` ×1). The 3 old `settings/App.stories.tsx` failures are
  gone, and all 10 settings stories pass. One run also flaked `drawer.stories > Default`,
  which passed 4/4 twice in isolation.
- The storybook a11y check caught a contrast failure on the logo placeholder (4.39:1).
  Fixed with existing tokens (`surface-sunken` / `foreground-muted`).
- `vite build` is clean for `settings` and `shell`, and a grep of both `dist/`
  directories finds no token and no API hostname.
- **Browser pass (Playwright script against the running dev servers):**
  - The first live run found that the API rejects every company call without
    `X-Tenant-Id`. Fixed globally, per user decision: `user.tenantId` is captured at
    login into `AuthSession.tenantId` (`sessionStorage` key `fgs.auth.tenant`), and
    `configureCustomFetch({ getTenantId: getSessionTenantId })` in the shell sends it on
    every request. With the header added, the live GET returned 200 and the screen
    rendered real data matching the Figma layout.
  - The dev API then went unreachable (TCP connect times out, even direct to the host;
    general internet is fine). The **live save is still untested**.
  - Everything else ran against a stateful mock seeded from the captured real
    response: **32/32 checks, no page errors**. Coverage: grid navigation, bearer and
    `X-Tenant-Id` on GET and PATCH, field population, read-only fields, select labels,
    status switch, addresses, UI-only panels, validation (no PATCH sent, focus on the
    first invalid field), Cancel, dirty-only PATCH, re-seed after save, persistence
    across reload, GET 401/403/404/500/400-tenant/malformed/network/slow (skeleton),
    PATCH 204/409/400/403/network, double-click (one PATCH), no-`companyId` session,
    and a 390px viewport.
  - Five defects found and fixed during the pass:
    1. Missing `X-Tenant-Id` (above).
    2. `customFetch` ignored the API's `errors: string[]` envelope and showed
       "API request failed with HTTP 400". It now falls back to `errors[]`.
    3. `customFetch` threw on a `204` or an empty body, turning a completed save into
       "Could not save". It now resolves `undefined`.
    4. Cancel and the "Setup" breadcrumb went to `/workorders`. Both used `'../..'`,
       which is route-relative and climbs out of `/settings/*`; they now use `'..'`.
       This bug came from `feature/edit-company-settings`.
    5. The save result callout rendered off-screen above a long form (now scrolled into
       view), section titles had no gap (Tailwind v4 `space-y` loses to `m-0`, so
       `gap` is used instead), and on mobile the card overflowed its column (the grid
       had no base `grid-cols-1`).
- After the fixes: `test:query` 23/23, `typecheck` and `lint` clean (phantom project
  aside), `storybook:test` 233/240 (the same 7 pre-existing failures; all 11 settings
  stories pass, including a new Cancel story).
- Dev-server note: adding an export to an MF-shared lib (`getSessionTenantId` in
  `@cms/shared-auth`) needs a shell dev-server restart, because the MF plugin caches
  the shared module's export list at startup. Touching `apps/shell/vite.config.ts`
  triggers the restart.

### Deviations from the plan

- The test fixture lives in `tools/integration/src/fixtures/` (next to its only
  consumer), not in the lib.
- The standalone runtime gets a fixed `companyId` with no `VITE_DEV_COMPANY_ID` env var.
  Standalone can't reach the API anyway (see plan Notes for Review).
- "Upload / Change" is text-only. `ExportIcon` has a tray the design's bare arrow lacks,
  and Figma is still inaccessible for a trace.
- Phone uses a plain `TextInput` (`type="tel"`) rather than `PhoneInput`: the design
  shows no country selector.
- `@cms/shared-api` was added as a `workspace:*` dependency of both
  `settings-data-access` and `tools/integration`; `pnpm-lock.yaml` changed by 6 lines.

## History

**[Real login: fetch `accessToken` from `/auth/refresh`](features/api-login-access-token.md)** — implemented and **committed on
`feature/api-login-access-token`, not yet merged or reviewed**. Branched from
`feature/edit-company-settings` at `fb8a387`. Local development only.

| Commit | Scope |
| --------- | ------------------------------------------------------------------- |
| `c529d44` | `feat(auth-data-access)` — the new lib, Zod schema, `refreshAccessToken()` |
| `7c62ecd` | `feat(shell)` — Authenticate adapter, bootstrap wiring, env-gated dev proxy |

Replaces the browser-side `authenticateDemoUser` placeholder with a real network call.
Clicking **Next** on the login screen POSTs a fixed refresh token to
`https://api-dev.fieldwhizey.com/api/v1/auth/refresh`; the response's `accessToken` and
`user` block become the session, so the signed-in name/email come from the API and every
later request carries `Authorization: Bearer <accessToken>`.

| Piece | Where |
| ------------------------------------- | ------------------------------------------------- |
| Zod schema + `refreshAccessToken()`    | new lib `libs/shared/auth-data-access` (`@cms/auth-data-access`) |
| `Authenticate` adapter (DTO → session) | `apps/shell/src/lib/authenticate-with-api.ts` |
| Wiring                                 | `<AuthProvider authenticate={authenticateWithApi}>` in `bootstrap.tsx` |
| Credentials + dev proxy target         | `apps/shell/.env.local` (gitignored); template in `.env.example` |

### Notes

- **Token propagation needed no new code.** `runtime.ts` already calls
  `configureCustomFetch({ getAuthToken: getSessionToken })`, `getSessionToken` re-reads
  storage on every request, and `@cms/shared-api` is a Module Federation singleton — so
  one call covers the host and all four remotes. Confirmed in the dev server's
  transformed output: the adapter imports `ApiError` through `loadShare`, not an alias.
- The endpoint takes only `refreshToken`, so the email typed on the login screen is never
  sent — the identity is whoever the token belongs to. `LoginPage.tsx` is unchanged.
- The fixed refresh token is sent on every login by decision; the rotated `refreshToken`
  in the response is deliberately discarded, as are `idToken` and `expiresIn`. There is
  no refresh-on-expiry yet, so a stale token surfaces as a 401 message on the login card.
- `tenantId` (52 in the response) is **not** wired in — the shell's tenant drives a
  `TENANT_NAMES` lookup in `store/constants.ts` and that is a separate decision.
- `demo-credentials.ts` is intentionally kept: `AuthProvider`'s `authenticate` prop still
  defaults to it, which is what lets every Storybook story run without a network call.
- **CORS blocks the direct call** (confirmed in the browser), so `vite.config.ts` proxies
  `/api/v1` and `VITE_API_URL` is the relative `/api/v1`. `customFetch` only concatenates
  `baseUrl + endpoint`, so no application code knows the difference.

Full write-up, including the response mapping and the two leak-prevention gates, is in
[features/api-login-access-token.md](features/api-login-access-token.md).

### Keeping local-only wiring out of other environments

Both mechanisms below are gated so nothing local can reach `develop` or a deployment.

- **The proxy target is not hardcoded.** `vite.config.ts` reads
  `VITE_DEV_API_PROXY_TARGET` via `loadEnv` and configures a proxy only when it is set,
  so no API hostname is committed and any environment that does not set it gets no proxy.
  It is also a `server` option, which Vite applies only to the dev server. Both branches
  verified against a running server: with the variable set, a GET through `/api/v1`
  returns the API's own nginx 401; with it empty, the same URL returns Vite's HTML
  fallback.
- **The refresh token cannot ship in a bundle.** This was a real leak, caught by grepping
  `dist/`: Vite inlines every `import.meta.env.VITE_*` reference as a string literal at
  build time, so `vite build` on any machine holding a `.env.local` baked the credential
  into `bootstrap-*.js`. `authenticateWithApi` now early-returns behind
  `if (!import.meta.env.DEV)`, which is `false` in a build, so the token read is dead code
  the minifier drops. Re-verified: the token and the hostname are both absent from a
  fresh `vite build`, while the guard's message is present — proving the retained branch.

### Verification

- `typecheck` clean; `lint` clean (including the new lib and `shell`); `test:query` 8/8;
  shell production build clean via `vite build`.
- `storybook:test`: 227/237, **identical to the baseline measured at `fb8a387`** — the
  same 10 failures in the same 3 files (`TopNav.stories.tsx` ×6,
  `settings/App.stories.tsx` ×3, `LoginPage.stories.tsx > Successful Login` ×1). All
  pre-existing; this change adds none. The LoginPage one is a route mismatch in the
  story: `LoginPage` redirects to `/today`, which the story's `MemoryRouter` does not
  declare.
- `nx build shell` cannot complete through Nx because its dependency `ui:build` fails at
  `HEAD` on an unrelated pre-existing TS error —
  `libs/ui/src/spike/dispatch-board/DispatchBoardSpike.tsx:419`, `slotLabelFormat` not in
  `ViewOptions` (last touched by `5a3fc37`). The shell's own Vite build is clean.
- Browser check was run by the user, not scripted here. It surfaced the CORS failure that
  produced the proxy above; the post-fix confirmation was the user's and is not captured
  in this repo. Worth a scripted Playwright pass later, as the login redesign had.

### Follow-ups

- The refresh token in `.env.local` is a live dev-tenant credential; rotate it on the IdP.
- The four remotes' `standalone-runtime.ts` still call `configureCustomFetch` without
  `getAuthToken`, so standalone dev servers send no bearer token. Harmless today (all
  data-access libs return mocks) but worth parity when a real endpoint is consumed.

## History

- **Edit company settings (General Info form)** — in progress on
  `feature/edit-company-settings`. Implements the React Hook Form + Zod settings form
  from `forms-implementation-guide.md`, adapted to this repo: a
  `@cms/settings-data-access` library (mock GET/PATCH, no backend yet) and the edit
  screen in the `settings` remote, not the shell. Opened from the Setup grid's General
  Info card. Figma nodes (Login file `7p0XZMKlDyqp3F59bXA9Aj`) were not readable without
  a Figma login, so layout follows existing Service Location form patterns
  (`SectionCard` soft/panel, `TextInput`/`PhoneInput`/`Textarea` `soft` variant).
## History

- [Replace native HTML typography with `@cms/ui` Typography] — in progress on
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
