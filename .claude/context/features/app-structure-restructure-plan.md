# App Internal Structure — Restructure Plan

## Status

**Proposed — not started.** Awaiting approval before any code changes.

## 1. Why

Every app in `apps/` invented its own internal layout. There is no documented rule for
where a component, a type, a constant, or a pure helper belongs inside an application,
so four apps have four answers:

| App | Internal folders | `App.tsx` contains |
| ----------- | -------------------------------- | ------------------------------------------------ |
| `shell` | `components/ pages/ lib/ store/` | Route table only ✅ |
| `invoice` | `pages/` | Route table only ✅ |
| `workorder` | `store/` | Header, toolbar, query wiring, list, empty state |
| `lead` | `store/` | Header, toolbar, query wiring, list, empty state |
| `settings` | `constants/` | Header, search, tabs, filter logic, grid, empty state |

`shell` is the only app that has grown enough to discover the right shape. The three
remotes that came later did not inherit it, because nothing wrote it down and the
`remote-app` generator emits a flat `src/` with no folders at all.

The immediate trigger is `apps/settings`: 101 lines in `App.tsx` doing seven jobs, and a
`constants/` folder that holds two resolver functions, a mock data catalogue, and half the
module's types — while the other half sit inline in `setting-tabs.ts`. Fixing settings
alone would leave the same trap set for the next remote, so this plan sets the convention,
enforces it mechanically, and then applies it everywhere.

## 2. Goals

1. One documented, non-negotiable internal structure for every app under `apps/`.
2. Mechanical enforcement, so drift fails CI rather than relying on review.
3. `settings`, `invoice` and `shell` migrated to it. (`workorder` and `lead` are
   deliberately deferred — see §11.)
4. `settings` left in a shape that the edit-on-card-click feature can build on directly.

## 3. Non-Goals

- **No behaviour changes.** Every screen renders identically before and after. This is a
  move-and-split refactor; any bug fix or feature is a separate change.
- **Not restructuring `libs/`.** The library layout (`src/index.ts` barrel + `src/lib/*`)
  is Nx-generated, consistent, and out of scope.
- **Not building the settings data-access lib.** Extracting `settings.ts` into
  `libs/settings/data-access` is real and needed, but it is a data-layer change, not a
  structural one. Phase 4 marks the seam; the lib itself is follow-on work.
- **Not adding the router to settings.** Sequenced deliberately — see §7.

## 4. The canonical structure

```
apps/<app>/src/
  index.ts               MF indirection — dynamic import('./bootstrap') only
  bootstrap.tsx          standalone React root
  standalone-runtime.ts  standalone CmsRuntime + configureCustomFetch
  error-boundary.tsx     RemoteErrorBoundary
  styles.css             Tailwind entry
  vite-env.d.ts

  App.tsx                AppProps + route table + error boundary. Nothing else.

  types/                 types used by two or more sibling folders
  constants/             literal values only — no functions
  lib/                   pure functions, no React, no JSX
  hooks/                 custom hooks (create when the first one appears)
  components/            presentational components
  pages/                 route targets
  store/                 zustand: store.ts / types.ts / constants.ts
```

### Rules

**R1 — `App.tsx` holds no markup.** It declares `AppProps { runtime: CmsRuntime }`, wraps
in `RemoteErrorBoundary`, and returns a `<Routes>` table. Screen markup lives in `pages/`.
This is the single rule that prevents a repeat of settings.

**R2 — types placement.** A type used by two or more sibling folders goes in `src/types/`,
one file per domain concept, re-exported from `src/types/index.ts`. A type used by exactly
one folder stays in that folder's own `types.ts`. This preserves the existing
`store/types.ts` triple in shell, workorder and lead — those types are store-only.

**R3 — how a closed set is declared is the author's call.** The workspace currently uses
string-literal unions throughout (`SettingsTabKey`, `SettingCardTone`) and nothing here
changes that, but `enum` is permitted and no lint rule forbids it. This plan governs
*where* a type declaration lives, not *how* it is written. (One build constraint, not a
style rule: `const enum` does not work under `isolatedModules`, which Vite requires. Plain
`enum` is fine.)

**R4 — `constants/` holds data, `lib/` holds behaviour.** If it is a function, it is not a
constant. A lookup map is a constant; the function that reads the map is not.

**R5 — naming.** Files exporting a React component are PascalCase and match the export
(`SetupHeader.tsx`). Everything else is kebab-case (`resolve-setting-icon.ts`). Page
components are suffixed `Page` (`SetupPage.tsx`). This follows the existing
`Components: PascalCase` rule in coding-standards.md; it just was not applied to `pages/`.

**R6 — `.tsx` only when the file contains JSX.** A file that merely references component
identifiers is `.ts`.

**R7 — stories are colocated** next to the component they cover, as
`components/TopNav.stories.tsx` already is.

## 5. Enforcement

Documentation alone will not hold. Two gates:

| Gate | Mechanism | Catches |
| ---- | --------- | ------- |
| E1 | The `remote-app` generator template emits the full folder skeleton with `.gitkeep`s, a route-table `App.tsx`, and a starter `pages/<Name>Page.tsx` | R1, R5 — new apps are born correct |
| E2 | Section added to `.claude/context/coding-standards.md`, which is loaded into context on every session via `CLAUDE.md` | All rules, for humans and for Claude |

E1 is the real forcing function. Every remote after this inherits the shape for free
rather than copying whichever sibling the author happened to open first.

No ESLint rule is added. The structural rules here are about file placement, which
`@nx/enforce-module-boundaries` cannot express and a custom rule would be disproportionate
to write — R1 and R4 are review-time judgements, caught by E1 making the correct shape the
path of least resistance.

## 6. Phases

Each phase is independently committable and leaves the workspace green
(`lint`, `typecheck`, `build`, `test:query`, `storybook:test`).

### Phase 0 — Write the convention down

- Add an **Application Internal Structure** section to
  `.claude/context/coding-standards.md` (§4 of this document). **Done** — the section is
  written; the rest of this plan is reviewable against it.
- No code moves in this phase.

### Phase 1 — `settings` (the largest change)

Target tree:

```
apps/settings/src/
  App.tsx                        AppProps + RemoteErrorBoundary + <SetupPage />
  types/
    index.ts                     barrel
    setting-category.types.ts    SettingCategory, SettingCount
    setting-tab.types.ts         SettingTab, SettingsTabKey
  constants/
    setting-tabs.ts              SETTING_TABS only
    setting-icons.ts             SETTING_ICON_MAP, COMPANY_TONE_MAP, TONE_CYCLE  (.ts — no JSX)
    settings.ts                  the catalogue — unchanged, marked as the data-access seam
  lib/
    resolve-setting-icon.ts      resolveSettingIcon, resolveSettingTone
    filter-settings.ts           the search predicate, extracted from the useMemo
  components/
    SetupHeader.tsx              Heading1 + subtitle + search TextInput
    SetupTabs.tsx                TabsList + one TabsContent per tab
    SettingCategoryGrid.tsx      SettingCardGrid + card mapping + icon/tone resolution
    SettingsEmptyState.tsx       the "No settings match" status region
  pages/
    SetupPage.tsx                owns tab + query state, composes the above
```

Moves, precisely:

| From | To |
| ---- | -- |
| `constants/types.ts` → `SettingCategory`, `SettingCount` | `types/setting-category.types.ts` |
| `constants/types.ts` → `SettingsTabKey` | `types/setting-tab.types.ts` |
| `constants/setting-tabs.ts` → `interface SettingTab` (currently inline) | `types/setting-tab.types.ts` |
| `constants/setting-icons.tsx` → the three maps | `constants/setting-icons.ts` |
| `constants/setting-icons.tsx` → the two resolvers | `lib/resolve-setting-icon.ts` |
| `App.tsx:29-37` → the `useMemo` filter body | `lib/filter-settings.ts` |
| `App.tsx:42-57` → header block | `components/SetupHeader.tsx` |
| `App.tsx:63-69` → `TabsList` | `components/SetupTabs.tsx` |
| `App.tsx:77-91` → grid + card map | `components/SettingCategoryGrid.tsx` |
| `App.tsx:72-75` → empty state | `components/SettingsEmptyState.tsx` |
| `App.tsx:24-98` → remaining state + composition | `pages/SetupPage.tsx` |

Fixed in passing, because the split makes them one-liners and leaving them would mean
touching the same files twice:

- **`AppProps { runtime: CmsRuntime }` added.** The shell already passes `runtime`
  (`apps/shell/src/App.tsx:114`) and settings currently ignores it. `data-tenant` gets
  stamped like every other remote.
- **One `TabsContent` per tab** instead of a single panel chasing `activeTab`, restoring
  the tab↔panel ARIA association.
- **`className='cursor-pointer'`** on `TabsTrigger` — single quotes and out of prop order.
  Removed from the call site and moved into the primitive; see Phase 1a below.

Explicitly **not** fixed here (behaviour changes, tracked separately): search being scoped
to the active tab, cards having no `onClick`, absence of `RequireAuth`.

New stories: `SettingCategoryGrid.stories.tsx`, `SetupHeader.stories.tsx`. The four
existing `App.stories.tsx` stories **stay at the top level, unmoved** — correcting an
earlier draft of this plan, which said they'd move to `pages/SetupPage.stories.tsx`.
`invoice` is the precedent: it has a `pages/` folder and keeps `App.stories.tsx` testing
the exposed `App` entry through `withCmsRuntime`, with no `pages/*.stories.tsx` files at
all. Settings follows the same shape — `App.stories.tsx` is the regression net proving
Phase 1 changed no behaviour, and `SetupPage` gets no dedicated story file since it takes
no props and is fully exercised through `App`.

### Phase 1a — `cursor-pointer` into `TabsTrigger` (`libs/ui`)

Settings currently patches the pointer cursor on at the call site. The affordance is right
but the location is wrong: Base UI's `Tabs.Tab` renders a real `<button>`, which browsers
default to `cursor: default`, so *every* tab in the product has the same gap — not just
settings.

Add `cursor-pointer` to the base string of `tabsTriggerVariants`
(`libs/ui/src/components/ui/tabs/tabs.tsx:53`), then drop it from the settings call site.

- **Blast radius is two files.** `TabsTrigger` has exactly two product consumers:
  `apps/settings/src/App.tsx` and `apps/shell/src/pages/LoginPage.tsx` (the segmented
  identifier tabs). Both should have it; neither does today.
- **Disabled tabs are already safe.** The base string carries
  `disabled:pointer-events-none`, and `pointer-events: none` suppresses the cursor, so a
  disabled tab will not falsely advertise itself as clickable. No extra `disabled:` variant
  needed.
- Ships as its own commit ahead of the settings split, since it is a design-system change
  with its own consumers, not part of the app restructure. `tabs.stories.tsx` covers it.

Because this crosses into `libs/ui`, it is the one part of the plan with a visible
before/after outside settings — worth an explicit look in the browser on the login screen.

### `workorder` and `lead` — deferred, not in scope

Both are demo scaffolds (~100 lines each) with the same seven-jobs-in-`App.tsx` problem as
settings, and both will likely be rewritten wholesale when they get real features.
Restructuring them now would be work thrown away. **Decision: skip.** The rewrite adopts
the convention in §4 when it happens; until then they are the two known exceptions to it.

### Phase 2 — `invoice`

Closest to correct already. Only R5 violations:

| From | To |
| ---- | -- |
| `pages/list.tsx` (exports `InvoiceListPage`) | `pages/InvoiceListPage.tsx` |
| `pages/detail.tsx` (exports `InvoiceDetailPage`) | `pages/InvoiceDetailPage.tsx` |
| `pages/payment.tsx` (exports `InvoicePaymentPage`) | `pages/InvoicePaymentPage.tsx` |

Also extract the inline `INVOICES` mock array out of `pages/list.tsx` into
`constants/invoices.ts` (R4 — it is literal data sitting in a component file).

### Phase 3 — `shell`

Already compliant in shape. Two adjustments:

- `pages/LoginPage.tsx` — already correct, no change.
- `components/nav-config.tsx` contains JSX (icon elements), so `.tsx` is correct under R6.
  Verify rather than assume; leave if it holds.
- Audit `store/types.ts` against R2 — if any of those types are consumed outside `store/`,
  they move to `types/`. Otherwise they stay put, which is the expected outcome.

### Phase 4 — Generator + docs close-out

- Update `tools/generators/remote-app/files/src/` to emit the full skeleton (E1).
- Update `libs/ui/README.md` and `.claude/context/current-feature.md` history.
- Note the `libs/settings/data-access` seam as follow-on work.

## 7. Sequencing note

This plan deliberately lands **before** the router work and the edit-on-card-click
feature. Adding routes to settings means `App.tsx` becomes the route table and today's
body becomes `SetupPage.tsx` — which is exactly the Phase 1 split. Doing the feature
first would mean performing that split anyway, mixed into a feature diff where the
behaviour changes and the file moves are indistinguishable in review.

Order: **restructure (no behaviour change) → router + auth → edit-on-card-click.**

## 8. Risks

| Risk | Mitigation |
| ---- | ---------- |
| A move-and-split silently changes rendering | Existing stories move unchanged and must pass byte-for-byte in behaviour; `storybook:test` runs per phase |
| Module Federation shared-scope regressions from touching entry files | `App.tsx` stays the only MF-exposed module in every app; `exposes` config is not touched in any phase |
| Prettier CRLF→LF blowup | Per `current-feature.md`: **do not run `pnpm run format`** on this checkout. Format only touched files |
| Import churn breaks `@nx/enforce-module-boundaries` | All moves are intra-app; no new cross-boundary imports are introduced |
| Phase 1 conflicts with in-flight settings work | Land Phase 0 + 1 before starting the feature spec implementation |

## 9. Verification per phase

`pnpm run lint`, `pnpm run typecheck`, `pnpm run build`, `pnpm run test:query`,
`pnpm run storybook:test`, plus a browser pass on the touched app in both federated
(`pnpm run dev`) and standalone modes.

Two pre-existing failures are expected and unrelated — the `<%= name %>` phantom Nx
project, and the MF DTS `#TYPE-001` warning. Both are documented in `current-feature.md`.

## 10. Open questions

None outstanding. All three questions raised during drafting are resolved in §11.

## 11. Decisions taken

- **Enums are allowed; no lint rule.** An earlier draft banned TypeScript `enum` in favour
  of string-literal unions and proposed an ESLint rule to enforce it. Rejected: how a
  closed set is declared is left to the author. The plan governs where a declaration
  lives, not how it is written. R3 and the former E1 gate were removed accordingly.

- **R2 confirmed as written.** Shared types (two or more sibling folders) go in `types/`;
  single-consumer types stay colocated in the folder that owns them. The alternative —
  "all types in `types/`, always" — was rejected because it would dissolve the existing
  `store/types.ts` triple in `shell`, `workorder` and `lead` for no gain.

- **`workorder` and `lead` are out of scope.** Both are demo scaffolds likely to be
  rewritten wholesale; restructuring them now is work thrown away. They remain the two
  documented exceptions to §4 until their rewrites adopt it.

- **`cursor-pointer` moves into `libs/ui`.** Rather than dropping it from the settings call
  site, it goes into the base of `tabsTriggerVariants`, affecting every `TabsTrigger`
  consumer — which is the correct scope, since the missing pointer cursor is a property of
  the primitive, not of settings. Ships as its own commit; see Phase 1a.
