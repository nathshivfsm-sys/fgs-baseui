# Company Non-Working Days — API-backed list and CRUD

**Status:** Spec, in implementation. **Branch (proposed):** `feature/company-non-working-days-api`.

**Design:** pasted screenshots of the existing General Info **Non-Working Days** panel and the **Create Business Unit** dialog (layout reference). No Figma file was provided this pass. The in-repo Zone create/edit dialog (`ZoneFormDialog`) is the code reference for the modal.

The product copy says “Non-Working Days”; the Setup swagger resource is `NonWorkingDate` (`/nonworkingdate`). This spec uses that API. “PTO” in the request means this panel, not a separate leave-balance resource.

---

## 1. Overview

Settings › Company › General Info already renders a Non-Working Days table to match the design, but the rows are a static preview. Catalog endpoints for this resource already exist in `@cms/settings-contract` and `@cms/settings-data-access` (list, detail, lookup, POST, PUT, PATCH) with MSW coverage.

This feature wires the panel to those endpoints so an office manager can list, add, edit, and delete company holidays. Writes go to the backend; the list query is **not** refetched after a successful create, update, or delete. The table updates from the mutation response (or the deleted id) via the TanStack Query cache.

## 2. Problem Statement

- The panel looks live (Add, pencil, trash, pager) but does nothing. Holiday data cannot be loaded or changed.
- Refetching the list after every write would flash the table and hit `/nonworkingdate` again even though the write already returned the saved row.

## 3. Goals / Non-Goals

### Goals

1. Load the paged `/nonworkingdate` list into the existing table (Date, Day, Description, Actions).
2. Add a holiday in a dialog modeled on Create Business Unit / `ZoneFormDialog`; POST the body; patch the list cache; do not GET the list again.
3. Edit from the same dialog, prefilled from the **list row** (no detail GET); PUT; patch the list cache; no list GET.
4. Delete only after a confirmation dialog; DELETE; remove the row from the list cache; no list GET.
5. Reuse `@cms/ui` (`Dialog`, `Table`, `Button`, `IconButton`, `TextInput`, `SectionCard`, `Callout`, `Skeleton`) and the page-owned `FormTextInput` / Zone dialog patterns. Follow existing spacing, tokens, and named-handler rules.
6. Keep the panel usable on stacked General Info (below `lg`) and on a ~390px viewport.

### Non-Goals

- Branding / logo upload, address editing, and company PATCH (unchanged).
- Lookup endpoint consumption, detail GET for the edit form, search, sort UI, or active/inactive tabs.
- Soft-delete via `PATCH isActive` (this pass uses DELETE).
- A new date-picker component in `@cms/ui`. Date uses the existing `TextInput` with `type="date"` (ISO `YYYY-MM-DD`, same as the wire field).
- Moving this panel off General Info onto its own Setup card.

## 4. User Stories

1. As an **office manager**, I want to see the company’s real holidays in Non-Working Days, so I know which dates are blocked.
2. As an **office manager**, I want to add a holiday (date + description) in a dialog and Save, so it persists without a full table reload.
3. As an **office manager**, I want to edit a holiday in the same dialog with the current values filled in, so I can correct a date or name without retyping everything.
4. As an **office manager**, I want to confirm before a holiday is deleted, so I don’t remove one by accident.
5. As an **office manager**, I want a clear error if a load or write fails, so I know whether to retry or sign in again.

## 5. Design Reference

**Panel (screenshot 1):** right column of General Info. Title “Non-Working Days”, subtitle “Define company holidays and non working days.”, `+ Add Non-Working Day` (subtle/outline primary). Table columns Date (`MM/DD/YYYY`) · Day (weekday name) · Description · Actions (blue pencil, red trash). Pager `‹ n ›` bottom-right. Keep this chrome; do not replace it with `DataTable`.

**Add/Edit dialog (screenshot 2 — Create Business Unit as layout):** centered modal, title + short description, top-right X. Inner `SectionCard` (`soft` / `panel`) with a two-column field grid that stacks to one column on small viewports. Footer Cancel (outline/surface) and primary Save, right-aligned, **outside** the inner card. Edit uses the same layout with “Edit …” title and fields prefilled.

**Delete confirm:** same `Dialog` primitive (no AlertDialog in `@cms/ui`). Title, one-line consequence, Cancel + destructive Delete. X may remain; Cancel and X both dismiss without calling DELETE.

## 6. Functional Requirements

### 6.1 Load

- **FR-1** On mount of the General Info form (company GET already succeeded), the panel must call `GET /nonworkingdate` through `nonWorkingDateListQueryOptions` / `customFetch`. Default params: `page` (1-based) and `pageSize: 10`. No `isActive` filter (inactive rows such as the MSW Christmas seed remain visible, matching the design’s six holidays).
- **FR-2** Map each `NonWorkingDateSummaryDto` to the table: `nonWorkingDate` → Date `MM/DD/YYYY` and Day (English weekday via `Intl`, parsed as a local calendar date so ISO `YYYY-MM-DD` is not shifted by UTC). `name` → Description (`—` when null/empty).
- **FR-3** While the list is pending, the panel shows row skeletons in the table region (not the whole General Info skeleton). On error, a panel `Callout` with `describeNonWorkingDateError`. On empty success, a short empty copy (“No non-working days yet.”) and the Add button still enabled.
- **FR-4** The pager is live. Changing page updates list params and **may** GET that page (new query key). Previous is disabled on page 1; next is disabled on the last page. This is not a post-mutation refetch.

### 6.2 Cache rule (no list refetch after writes)

- **FR-5** Create, update, and delete mutation factories must **not** `invalidateQueries` on `nonWorkingDateKeys.all` or `lists()`. After a successful write they `setQueriesData` on `nonWorkingDateKeys.lists()`:
  - **Create:** insert the returned detail DTO into the current page’s `items` (date-sorted), cap to `pageSize`, increment `totalCount`. Also `setQueryData` for `detail(id)`.
  - **Update:** replace the matching `id` in each cached list; `setQueryData` for `detail(id)`.
  - **Delete:** remove the matching `id`, decrement `totalCount` (min 0). `removeQueries` for that detail key.
- **FR-6** The panel’s list `useQuery` sets `refetchOnWindowFocus: false` and `staleTime: Infinity` so a successful write (or tab focus) cannot trigger a second list GET. Pagination still fetches because the key changes.
- **FR-7** Edit must not `GET /nonworkingdate/{id}`. Prefill from the list row passed into the dialog.

### 6.3 Add / Edit dialog

- **FR-8** One dialog component, create vs edit from `row == null`. Clone `ZoneFormDialog`: `Dialog` + header + `FormProvider` + `SectionCard` + page `FormTextInput`.
- **FR-9** Fields (two-column, `grid-cols-1 sm:grid-cols-2`):
  - **Date** (required) — `type="date"`, form + wire key `nonWorkingDate`.
  - **Description** (required on the form) — maps to wire `name`.
  - Day of week is **not** a field; the table derives it.
- **FR-10** Form schema lives in `@cms/settings-data-access` (`non-working-date.form.ts`), not in the page `types/` folder. Wire DTOs stay in `@cms/settings-contract`. Mappers: `emptyNonWorkingDateForm`, `toNonWorkingDateFormValues`, `toNonWorkingDateWriteDto`.
- **FR-11** Save in create mode POSTs `NonWorkingDateCreateDto`. Save in edit mode PUTs `NonWorkingDateUpdateDto` for that `id`. Pending disables Cancel and shows `loading` on Save. Success closes the dialog. Validation (`onBlur`) runs before the network; invalid Save sends nothing.
- **FR-12** Copy: create title “Create Non-Working Day”, description “Add a company holiday or non-working day.”; edit title “Edit Non-Working Day”, description “Update this company holiday or non-working day.” Save label “Save Non-Working Day” (`variant="action"`). Cancel `variant="outline"`.

### 6.4 Delete

- **FR-13** Trash opens a confirmation dialog (does not DELETE yet). Copy names the holiday when `name` is present, otherwise the formatted date.
- **FR-14** Confirm calls `DELETE /nonworkingdate/{id}` (new data-access + MSW handler; see assumptions). Pending on the destructive button. Success closes the dialog and applies FR-5. Cancel / X / overlay dismiss with no network call.

### 6.5 Errors, layout, structure

- **FR-15** Write errors surface in a panel `Callout` (`describeNonWorkingDateError`: 401 session, 403 permission, 404 not found, 409 conflict, else `ApiError.message`). They must not reuse or overwrite the company-form save Callout.
- **FR-16** Add / Edit / Delete do not dirty or submit the company General Info form.
- **FR-17** Pass `queryClient` from `CompanySettingsEditor` → `CompanySettingsForm` → `NonWorkingDaysPanel`. The panel owns list query, mutations, and dialogs (same idea as `ZoneTablePanel` + page dialogs, colocated because only this panel uses them).
- **FR-18** Delete `NON_WORKING_DAYS_PREVIEW` and `NonWorkingDay`. Import table rows as `NonWorkingDateSummaryDto` from `@cms/settings-contract`.
- **FR-19** Responsive: table stays in `Table`’s overflow-x container; dialog grid stacks below `sm`; Add button wraps under the title (`flex-wrap`); stacked General Info column (`lg`) already in place — do not introduce a new breakpoint token.

## 7. Edge Cases & Error States

- List GET 401 / 403 / 404 / 500 / network → panel Callout, table not shown.
- Create/update/delete 400 (validation from API) → Callout with `error.message`; dialog stays open on write failure.
- Create/update 409 → “This non-working day was updated by another user.”
- Delete 404 → “Non-working day not found.”
- Empty list → empty copy, pager shows page 1 with next/prev disabled.
- Delete last row on a page > 1 → stay on that page with remaining (possibly empty) items; do **not** change `page` (that would GET another page).
- Duplicate date: no client uniqueness check unless the API returns 400; show the API message.
- Company GET still pending/error → panel is not mounted (unchanged editor gating).

## 8. Success Metrics

- Opening General Info issues one company GET and one non-working-date list GET; Add/Edit/Delete issue only POST/PUT/DELETE (no extra list GET) in Network.
- Storybook covers list render, add, edit (prefill), delete confirm, and “no list GET after write”.
- `test:query` still covers list URL plus create; create assertion is cache-upsert, not `isInvalidated`.
- Layout readable at desktop (two-column General Info) and ~390px.

## 9. Open Questions / Assumptions

| ID | Topic | Assumption used to implement |
| -- | ----- | ---------------------------- |
| OQ-1 | DELETE verb | Swagger catalog modules in this repo (Tax, Zone, NonWorkingDate) shipped without DELETE. The request needs delete. **Assumption:** add `DELETE /nonworkingdate/{id}` (204 empty body, same as attachments). If the live API 405s, that is a follow-up with the backend. |
| OQ-2 | `name` required | Wire `name` is nullable. Form requires Description so the table is not a date-only row. |
| OQ-3 | Inactive rows | List has no `isActive` filter so the six design holidays (including MSW’s inactive Christmas) show. |
| OQ-4 | Page size | `10`, matching Zone’s table, not the six-row screenshot (that is the seed size). |
| OQ-5 | Success toast | No toast in `@cms/ui`. Optional short success Callout in the panel (`Non-working day added` / `updated` / `deleted`), same as Zone. |
| OQ-6 | Detail GET on edit | Not used; list row is enough (`summary` ≡ `detail` in the contract). |
