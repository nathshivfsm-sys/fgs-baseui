# Code Review — `feature/setup-tax-zone-api`

**Scope:** `git diff origin/develop...origin/feature/setup-tax-zone-api` (commit `a8042bc` —
Zone & Postal Code page, 32 files, ~1,200 insertions).

**Verification:** `nx lint settings` clean. `tsc --noEmit -p apps/settings/tsconfig.json`
red on one error (Must Fix #1); no type errors in the new page/component code itself.

---

## Must Fix

Blocks merge — either breaks the build or risks corrupting saved data.

### 1. Typecheck is red — `HttpResponse` used without its generic
**File:** [libs/shared/mocks/src/handlers/util/setup-http.ts:30](libs/shared/mocks/src/handlers/util/setup-http.ts#L30)

msw 2.11.6 declares `HttpResponse` as `HttpResponse<BodyType>` with no default type
parameter. Using it as a bare annotation fails with `TS2314`. `pnpm run typecheck`
does not pass on this branch as-is.

**Fix:** `HttpResponse<unknown>`.

### 2. Editing an inactive zone can silently reactivate it
**File:** [libs/settings/data-access/src/lib/zone/zone.form.ts:29](libs/settings/data-access/src/lib/zone/zone.form.ts#L29)

`toZoneWriteDto` omits `isActive`, and `updateZone` sends the result via `PUT`
(replace semantics). Editing a zone from the Inactive tab may drop `isActive`
from the payload and the server may interpret the missing field as "active" —
a status change nobody asked for. The MSW mock's `assignDefined` masks this
locally (Storybook can't catch it), so it needs confirming against the real
Setup Service, or the write path should go through `patchZone` instead of a
full replace.

---

## High

Silent failure on a real user action — the operator believes something
succeeded (or applied) when it didn't.

### 3. Failed save leaves the dialog open with the error hidden behind it
**File:** [apps/settings/src/pages/ZonePostalCodePage/ZonePostalCodePage.tsx:81](apps/settings/src/pages/ZonePostalCodePage/ZonePostalCodePage.tsx#L81)

The dialog only closes on `onSuccess`, so it correctly stays open on failure —
but the "Could not save" `Callout` renders on the page body, underneath
`DialogContent`'s portalled backdrop. The user sees no feedback at all and is
likely to resubmit. Move the error into `DialogContent`.

### 4. Row Activate/Deactivate has no error handling
**File:** [apps/settings/src/pages/ZonePostalCodePage/component/ZoneTablePanel.tsx:65](apps/settings/src/pages/ZonePostalCodePage/component/ZoneTablePanel.tsx#L65)

`patchMutation` (the status toggle) has no `onError`, and its `error` is never
rendered — the page-level banner only reads the create/update mutations. A
403/409/network failure on toggle is a silent no-op; the operator believes the
status changed. `describeZoneError` is already imported in this file, used
only for the list query's error.

---

## Medium

Confusing or misleading UI, but no data-loss risk.

### 5. Success/error banners use sticky mutation flags that never reset
**File:** [apps/settings/src/pages/ZonePostalCodePage/ZonePostalCodePage.tsx:48](apps/settings/src/pages/ZonePostalCodePage/ZonePostalCodePage.tsx#L48)

`saveMessage`/`writeError` read mutation state that is never cleared. Edit
then create in the same session can show "Zone updated" for what was actually
a create; a stale error can render next to a later success banner; neither
clears on navigation away from the page.

### 6. "Inactive" count can flash 0 or stick at 0 silently
**File:** [apps/settings/src/pages/ZonePostalCodePage/ZonePostalCodePage.tsx:44](apps/settings/src/pages/ZonePostalCodePage/ZonePostalCodePage.tsx#L44)

`inactiveCount = allLookup.length − activeLookup.length` across two
unsynchronized lookup queries, clamped with `Math.max(0, …)`. It flashes
"Inactive (0)" while the second lookup is still loading, and if `allLookup`
fails, it sticks at 0 with no error surfaced. The list query's `totalCount`
is the authoritative source and should be used instead.

---

## Low

### 7. Clearing sort can send an inconsistent query
**File:** [apps/settings/src/pages/ZonePostalCodePage/component/ZoneTablePanel.tsx:51](apps/settings/src/pages/ZonePostalCodePage/component/ZoneTablePanel.tsx#L51)

`sortDirection` is derived independently of `sortBy`. The reachable third
click of "Clear sorting" can send `sortDirection=asc` with no `sortBy` set.

---

## Clean on inspection

- Relative navigation (`SETUP_PATH = '..'`, and the
  `navigate('company/zone-postal-code?catalog=postal')` search-param form)
  both resolve correctly.
- Workspace deps on `@cms/settings-contract`, `zod`, `react-hook-form` are all
  declared.
- RHF's `values` + `useEffect` reset pair has a deep-equal guard and does not
  clobber in-progress typing.
- The `columns` `useMemo` dependency array carries no stale closure.
- `zoneKeys.all` invalidation correctly covers both list and lookup queries.

---

*Reviewed by Claude against `develop` at the time of writing. Re-run
`pnpm run lint` / `pnpm run typecheck` after fixes to confirm.*
