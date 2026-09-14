# Implementation Plan — Company Non-Working Days (API-backed CRUD)

**Source spec:** [company-non-working-days-api-prd.md](company-non-working-days-api-prd.md)
**Branch:** `feature/company-non-working-days-api`
**Codebase context:** Settings remote. Catalog DTOs already live in `@cms/settings-contract`; list/create/update/patch factories and MSW already exist under `libs/settings/data-access/src/lib/non-working-date/` and `libs/shared/mocks/src/handlers/non-working-date.ts`. UI reference: `ZoneFormDialog` + `ZonePostalCodePage`. Panel today: static `NonWorkingDaysPanel` + `NON_WORKING_DAYS_PREVIEW`.

## Resolved Assumptions

- DELETE is added even though the original catalog module omitted it (PRD OQ-1).
- Form requires Description; wire `name` may still be null on older rows (PRD OQ-2).
- List unfiltered by `isActive`; `pageSize` 10 (PRD OQ-3, OQ-4).
- Edit is prefilled from the list row; no detail GET (PRD OQ-6).
- Mutation factories **replace** `invalidateQueries` with `setQueriesData` for this resource only (Tax/Zone stay on invalidate).
- Panel-local Callout for PTO errors/success so company Save feedback stays separate.

## Task Breakdown

| # | Task | Maps to | File(s) | Depends on |
| - | ---- | ------- | ------- | ---------- |
| 1 | Form schema + mappers in data-access (`non-working-date.form.ts`); export from module barrel. | FR-9, FR-10 | `libs/settings/data-access/src/lib/non-working-date/non-working-date.form.ts`, `…/index.ts` | — |
| 2 | DELETE function + mutation; change create/update/patch `onSuccess` from invalidate to list/detail cache upsert/remove. Export delete. | FR-5, FR-14 | `…/non-working-date.mutations.ts`, `…/index.ts` | — |
| 3 | MSW `http.delete` for `/api/v1/nonworkingdate/:id` (204). Keep lookup handler **before** `:id`. | FR-14, OQ-1 | `libs/shared/mocks/src/handlers/non-working-date.ts` | 2 |
| 4 | `test:query`: create upserts the seeded list cache and does **not** mark it invalidated; add delete 204 + cache remove. | FR-5, FR-6 | `tools/integration/src/setup-catalog.integration.test.ts` | 2 |
| 5 | Page utils + copy: `formatNonWorkingDate`, `weekdayName`, `describeNonWorkingDateError`; dialog strings. Delete preview rows and `NonWorkingDay` type. | FR-2, FR-15, FR-18 | `apps/settings/src/pages/CompanySettingsPage/util/*`, `constant/non-working-days.ts`, delete `types/non-working-day.types.ts` | — |
| 6 | `NonWorkingDayFormDialog` (Zone clone) and `NonWorkingDayDeleteDialog`. | FR-8–FR-14, FR-19 | `…/component/general-info/NonWorkingDayFormDialog.tsx`, `…/NonWorkingDayDeleteDialog.tsx` | 1, 5 |
| 7 | Rewrite `NonWorkingDaysPanel`: list query, pager, add/edit/delete, cache-safe query options, skeletons/empty/error. Pass `queryClient` through form + editor. | FR-1–FR-7, FR-16, FR-17, FR-19 | `NonWorkingDaysPanel.tsx`, `CompanySettingsForm.tsx`, `CompanySettingsPage.tsx` | 2, 5, 6 |
| 8 | Storybook: NWD list fixture + handlers on every General Info story that mounts the form; stories for add, edit prefill, delete, and assert no list GET after writes. | §8 | `.storybook/fixtures/feature-data.ts`, `apps/settings/src/App.stories.tsx` | 7 |
| 9 | Verify: lint/typecheck for touched projects, `test:query`, `storybook:test` settings stories. Browser pass if tools are up: list, add, edit, delete, Network has no extra list GET. | §8 | — | 1–8 |
| 10 | Docs: `current-feature.md` status. | workflow | `.claude/context/current-feature.md` | 9 |

**Suggested commits** (only after you approve; none yet):

1. `feat(settings-data-access)`: form schema, cache-updating mutations, DELETE (Tasks 1–2, 4).
2. `feat(shared-mocks)`: DELETE handler (Task 3).
3. `feat(settings)`: Non-Working Days panel + dialogs + stories (Tasks 5–8).
4. `docs`: spec, plan, `current-feature.md`.

## Out of Scope This Pass

- Logo, addresses, company PATCH, Zone/Tax mutation invalidation.
- Lookup, detail GET, `DataTable`, new Calendar date-picker.
- Changing `page` after deleting the last row on a later page (would GET).

## Notes for Review

- Live DELETE may 405 if swagger never had the verb; MSW and stories still cover the UI. Flag OQ-1 if the dev API rejects it.
- `setQueriesData` on `lists()` updates every mounted page key; a background page-2 cache could include a row created while viewing page 1. Acceptable vs refetching.
- General Info stories that mount the form **must** stub `GET /nonworkingdate` or they throw “No story API handler”.
