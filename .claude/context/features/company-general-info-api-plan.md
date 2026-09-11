# Implementation Plan — Company General Info (API-backed edit form)

**Source spec:** [company-general-info-api-prd.md](company-general-info-api-prd.md)
**Branch:** `feature/company-general-info-api`, cut from `feature/api-login-access-token`
at `147e29f`. The login branch is left intact: it's pushed and still awaiting its own
review.

**Codebase context:** Nx + Vite Module Federation; the `settings` remote (port 5104) is
mounted by the shell at `/settings/*`. Data access follows the existing
`@cms/settings-data-access` split (`schemas/`, `queries/`, `mutations/`, plus
`query-keys.ts`) and the `refreshAccessToken` pattern: `customFetch<unknown>` followed by
a Zod parse. The form uses React Hook Form, `zodResolver` and `FormProvider` (already in
`CompanySettingsForm.tsx`). `SelectField` and `SwitchField` are controlled components, so
they bind through RHF `Controller`, not `register`. Stories inject loaders through the
`loadCompanySettings`/`saveCompanySettings` props on `App`.

## Resolved Assumptions

- **Branch:** new branch rather than renaming (decided above).
- **Addresses:** read-only from GET; Edit is inert; never sent in PATCH (intake).
- **Old PTO / tax-code / business-unit sections:** removed and their files deleted (intake).
- **PATCH response:** ignored; the detail query is invalidated on success (PRD OQ-3).
- **Company Size / Time Zone:** static option lists in `constants/` (PRD OQ-4).
- **Save feedback:** `Callout`, since the workspace has no toast (PRD OQ-7).
- **Inert controls:** rendered as designed with `type="button"` and no handler (PRD OQ-8).
- **`companyId` (was OQ-1), resolved:** `data.user.companyId` (number `1`) is the path
  key; the user confirmed that `GET /company/1` produced the captured response.
- **DTO (was OQ-2), resolved:** real response captured; PRD FR-7 updated.
- **Code and Company Number:** both read-only, never PATCHed (user decision after
  seeing that `companyNumber` equals the path key and `code` is a generated slug).
- **Phone:** API stores digits with the country code (`15551234567`). The form shows it
  formatted and sends digits-only (PRD §6.4).

## Task Breakdown

| #  | Task | Maps to | File(s) | Depends on |
| -- | ---- | ------- | ------- | ---------- |
| 0  | **Capture real API responses**: the `/auth/refresh` body (to locate `companyId`), `GET /company/{id}`, and ideally one PATCH success and one 400 body. Save redacted copies (tokens stripped) as fixtures. | OQ-1, OQ-2, OQ-3 | `libs/settings/data-access/src/lib/fixtures/company.response.json` | — |
| 1  | Save the Figma screenshot as a durable reference. It was pasted in chat and can't be written to disk from there, so the user has to do this. | §5 | `.claude/context/screenshots/company-general-info-edit.png` | — |
| 2  | **Carry `companyId` from login.** Add `companyId` (string or number, coerced to string) to `authUserSchema`; add `readonly companyId?: string` to `UserDetails`; map it in `toUserDetails`; update the README's dropped-keys list. | FR-1, FR-2 | `libs/shared/auth-data-access/src/lib/auth.schema.ts`, `…/README.md`, `libs/platform-contract/src/lib/platform-contract.ts`, `apps/shell/src/lib/authenticate-with-api.ts` | 0 |
| 3  | **Rewrite settings data access.** (a) `companyResponseSchema` (envelope + DTO + address) and `companyGeneralInfoFormSchema` with §6.4 rules. (b) Pure mappers `toCompanyGeneralInfo(dto)` and `toCompanyPatch(values, dirtyFields)`: dirty-only, `''`→`null` only for cleared nullable fields, and never `companyId` or addresses. (c) `loadCompanySettings`: `customFetch<unknown>('/company/'+id, { signal })`, then parse, then map. (d) `saveCompanySettings`: `PATCH` with a JSON body. (e) `companySettingsQueryOptions` keeps its signature, key, `staleTime` and `meta`. (f) Update `index.ts`; delete `mocks/company-settings.mock.ts` and the orphaned root `company-settings.queries.ts` / `company-settings.schema.ts`. (g) Add `@cms/shared-api: workspace:*` to `package.json` (not currently declared). | FR-5 – FR-11 | `libs/settings/data-access/src/lib/schemas/company-settings.schema.ts`, `…/mappers/company-settings.mappers.ts` (new), `…/queries/company-settings.queries.ts`, `…/mutations/company-settings.mutations.ts`, `…/index.ts`, `…/package.json`, 3 deletions | 0 |
| 4  | **Rewrite `test:query` coverage** (it currently tests the deleted mock store). Cover: the envelope parse against the Task 0 fixture; the DTO→form mapper, including nulls; dirty-only patch mapping; load/save through `customFetch` with a stubbed global `fetch`, asserting the URL, method, body and `signal`; `ApiError` propagating out of `queryFn`. Adjust `query-runtime.integration.test.ts` only if the loader type changes. | FR-6, FR-8, FR-9, §7 | `tools/integration/src/company-settings.integration.test.ts`, `tools/integration/src/query-runtime.integration.test.ts` | 3 |
| 5  | **Settings-app constants and pure helpers.** `COMPANY_SIZE_OPTIONS`, `TIME_ZONE_OPTIONS`, `NON_WORKING_DAYS_PREVIEW` (data only); `formatAddress()` returning display lines; `describeCompanyError(error)` mapping status to the §7 messages. | FR-15, FR-21, §7, OQ-4 | `apps/settings/src/constants/company-options.ts`, `…/constants/non-working-days.ts`, `…/lib/format-address.ts`, `…/lib/describe-company-error.ts` | — |
| 6  | **Presentational section components**, each reading the form through `useFormContext`: Company Information, Contact Information, Addresses (read-only cards, inert Edit), Branding (UI only), Company Defaults (`Controller` for the Time Zone select and Status switch, with the label switching Active/Inactive), and the Non-Working Days panel (static `DataTable`, labelled inert row actions, static pager). Unknown API select values are injected as an option. | FR-14, FR-15, FR-20 – FR-22, §6.4, §7 | `apps/settings/src/components/general-info/*.tsx` (6 new) | 5 |
| 7  | **Rebuild `CompanySettingsForm`** to the Figma layout: two-column card with a vertical divider (stacking below `lg`), form grids collapsing below `sm`, and a Cancel/Save footer outside the card. Save is disabled unless `isDirty` and while pending. Keep `mode: 'onBlur'` (RHF focuses the first invalid field by default). `values:` binding kept so invalidation re-seeds the form. Delete the three `*FieldArray.tsx` files. | FR-16, FR-18, FR-19 | `apps/settings/src/components/CompanySettingsForm.tsx`, delete `components/sections/{Ptos,TaxCodes,BusinessUnits}FieldArray.tsx` | 3, 6 |
| 8  | **Page and route wiring.** `App.tsx` passes `runtime.currentUser.companyId`. The page handles a missing `companyId` with a callout and `enabled: false`, shows a two-column `Skeleton` while loading, shows load errors via `describeCompanyError`, and on success calls `invalidateQueries(detail)` and shows the success callout. Keep the 409 message, the breadcrumb, and the new header copy. | FR-3, FR-4, FR-12, FR-13, FR-17, §7 | `apps/settings/src/App.tsx`, `apps/settings/src/pages/CompanySettingsPage.tsx` | 2, 3, 7 |
| 9  | **Standalone runtime:** give `standaloneUser` a `companyId` (`VITE_DEV_COMPANY_ID`, falling back to a fixture) so the page renders standalone. See Notes for Review: standalone *API calls* are a PRD overreach. | FR-2 (parity) | `apps/settings/src/standalone-runtime.ts`, `apps/settings/src/vite-env.d.ts` | 2 |
| 10 | **Storybook.** The fixture becomes a General Info form-model fixture; `storyUser` gets a `companyId`, overridable (including to `undefined`) through a new `storyCompanyId` prop. Stories: Loaded, Loading, Load error (403), Missing companyId, Validation (`play`: clear Name, blur, assert the message), Save success (`play`: edit Phone, Save, assert the spy received a dirty-only patch), Save 409. Fix or re-baseline the 3 pre-existing `settings/App.stories.tsx` failures. | §8 | `.storybook/fixtures/feature-data.ts`, `.storybook/fixtures/runtime.tsx`, `apps/settings/src/App.stories.tsx` | 7, 8 |
| 11 | **Verify.** `lint`, `typecheck`, `test:query`, `storybook:test` (baseline 227/237 at `147e29f`), the shell's `vite build` (`nx build shell` is blocked by the pre-existing `ui:build` error), and a grep of `dist/` for leaked tokens or hostnames. Then a browser pass through the shell dev server with a real login: load, edit one field, check Network for a dirty-only PATCH, reload to confirm it persisted, and check each error state. | §8 | — | 1–10 |
| 12 | **Docs.** Update `current-feature.md` (status and history) and the PRD's open-questions table with Task 0's answers. | workflow | `.claude/context/current-feature.md`, the PRD | 11 |

**Suggested commits** (each only after you approve; none yet):

1. `feat(auth)`: `companyId` on the session (Task 2).
2. `feat(settings-data-access)`: real GET/PATCH, mappers, tests (Tasks 3–4).
3. `feat(settings)`: General Info screen to Figma (Tasks 5–10).
4. `docs`: spec, plan, `current-feature.md` (Task 12).

## Out of Scope This Pass

- Non-Working Days CRUD, logo upload/remove, and address editing (PRD Non-Goals). All are
  rendered but inert.
- An unsaved-changes guard, token refresh-on-expiry, and `tenantId` → `TENANT_NAMES`
  reconciliation.
- Per-field mapping of server validation errors. Only the top-level `message` is shown
  unless Task 0 reveals a usable field-error shape.

## Notes for Review

- **PRD overreach: standalone API calls.** §6.6 says adding `getAuthToken` to
  `apps/settings/src/standalone-runtime.ts` lets the standalone dev server call the API.
  It doesn't. The standalone app runs on its own origin (`127.0.0.1:5104`), so it can't
  see the shell's `sessionStorage` token, and `apps/settings/vite.config.ts` has no
  `/api/v1` proxy, so CORS would block the call anyway. Task 9 is scoped to a
  `companyId` only, so the page renders. Real API testing happens through the shell
  (port 4200). Making standalone work needs a proxy plus a token source; that belongs
  in a separate change. I haven't edited the PRD for this.
- **The browser pass writes to a live dev-tenant record.** Task 11's PATCH changes real
  company data. Plan: edit a low-risk field (e.g. Website), then save it back to its
  original value. Don't toggle Status (PRD OQ-6).
- **Upload icon.** No confirmed glyph for "Upload / Change" in `libs/ui/src/icons`, and
  Figma is inaccessible. Default: reuse `export-icon` if it's the same up-arrow; if it
  isn't, leave the button text-only and flag it rather than approximating a trace.
- **Stale sessions.** Anyone signed in before Task 2 lands has no `companyId` and will
  see the "sign in again" callout (FR-4). That's expected, not a bug.
