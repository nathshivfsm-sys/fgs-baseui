# Implementation Plan — Create Service Location (existing Bill To)

**Source spec:** [create-service-location-for-bill-to-prd.md](create-service-location-for-bill-to-prd.md) (FR-1–FR-11; §10 confirmed)  
**Figma:** `QyVZOQ6F8iXu2JR4PVcB4U` — node `67:465` (panes), page chrome + footer from `67:427` / [servicelocation-existingcustomer.png](../screenshots/servicelocation-existingcustomer.png)  
**Branch:** `feature/customer-create-service-location`  
**Owner MFE:** `apps/customer` — `/customers/:customerId/service-locations/new`

## Progress tracker

| Step | Status | Deliverable |
|------|--------|-------------|
| 1 | Pending | Contract — `serviceLocationCreatedDtoSchema` + response envelope |
| 2 | Pending | Data-access — SL create form schema, mapper, mutation |
| 3 | Pending | MSW — `POST …/servicelocation` |
| 4 | Pending | Integration tests — create + cache invalidation |
| 5 | Pending | `@cms/customer-ui` — create-SL form + Bill To search/summary |
| 6 | Pending | App shared paths (optional consolidate) |
| 7 | Pending | `CreateServiceLocationPage` + routing |
| 8 | Pending | Error copy, typecheck, manual QA |

**Already done (entry only):** Customer Detail navigates via `serviceLocationCreatePath` (Add Location, empty state, More Options).

---

## Resolved decisions (PRD §10)

- Route always includes `:customerId`; no standalone create URL.
- **Search Bill To**; list search with `isActive: true`.
- Bill To change → `navigate(serviceLocationCreatePath(id), { replace: true })`; SL form kept.
- Cancel/Back → Customer Details for URL customer; discard dialog when dirty.
- Success → Customer Details overview + toast; no auto-scroll to SL section.

---

## Architecture

```text
CustomerDetailPage (Add Location)
        │
        ▼
CreateServiceLocationPage  ──GET──► customerDetailQueryOptions(customerId)
        │                    ──POST─► createServiceLocationMutation(customerId)
        │
        ├── Left: CreateServiceLocationForm → ServiceLocationSection (reuse)
        └── Right: BillToSearchCombobox + BillToSummaryCard (read-only)
```

**Form reuse strategy:** `ServiceLocationSection` is bound to `serviceLocation.*` on `CustomerCreateForm`. The create-SL page form shape is **`{ serviceLocation: ServiceLocationFormValues }`** only (no `creationOption`, no AR fields). RHF generic can stay `CustomerCreateForm` with dummy defaults for unused AR fields **or** introduce a narrow type + pass `ServiceLocationSection` a widened `UseFormReturn` — **preferred:** export `ServiceLocationFormValues`, `emptyServiceLocationFormValues`, and `serviceLocationOnlyFormSchema` from data-access; page form uses `defaultValues: { serviceLocation: emptyServiceLocationFormValues() }` and cast/`FormProvider` typing compatible with `ServiceLocationSection` (add optional `CreateServiceLocationFormValues` type in UI if needed).

**Mapper DRY:** Extract shared `mapServiceLocationFormToCreateDto(sl: ServiceLocationFormValues): ServiceLocationCreateDto` from the tail of `toCustomerCreateDto` in `customer.form.ts`; call from both customer create and `toServiceLocationCreateDto`.

---

## A. Contract (`@cms/customer-contract`)

| Task | FR | Files | Notes |
|------|-----|-------|-------|
| A1 | FR-8 | `libs/customer/contract/src/lib/service-location.schema.ts` | Add `serviceLocationCreatedDtoSchema`: `serviceLocationId`, `customerId`, `locationSequence`, `locationNumber` (align swagger `CrmServiceLocationCreatedDto`). |
| A2 | FR-8 | same + `src/index.ts` | `serviceLocationCreateResponseSchema = setupResponseSchema(serviceLocationCreatedDtoSchema)`; export types. |

**Acceptance:** Zod parses a sample 201 JSON; no duplicate create body schema (keep `serviceLocationCreateDtoSchema` on `customer.schema.ts`).

---

## B. Data-access (`@cms/customer-data-access`)

| Task | FR | Files | Notes |
|------|-----|-------|-------|
| B1 | FR-7 | `service-location/service-location.form.ts` | `serviceLocationOnlyFormSchema = z.object({ serviceLocation: serviceLocationFormSchema }).superRefine(refineServiceLocationOnly)` — **move** `serviceLocationFormSchema` + SL superRefine from `customer.form.ts` into shared module under `service-location/` or `customer/form-shared.ts` to avoid drift. |
| B2 | FR-7 | same | `emptyServiceLocationOnlyForm()`, `toServiceLocationCreateDto(values)` → calls shared mapper. |
| B3 | FR-8 | `service-location.mutations.ts` | `createServiceLocation(customerId, body)` POST `customerServiceLocationCollectionEndpoint(customerId)`; parse create response. |
| B4 | FR-8 | same | `createServiceLocationMutationOptions(queryClient, customerId)` — `onSuccess`: invalidate `serviceLocationKeys.lists()` for that customer (or `list(customerId)` prefix). |
| B5 | — | `service-location/index.ts`, lib root barrel | Export form + mutation. |

**Acceptance:** Unit-level mapper tests can live in integration file; form rejects missing name/displayName/address same as create-customer SL mode.

---

## C. MSW

| Task | FR | Files | Notes |
|------|-----|-------|-------|
| C1 | FR-8 | `libs/shared/mocks/src/handlers/service-location.ts` | `POST */customer/:id/servicelocation`: validate customer exists + active in customer seed; append to in-memory `ServiceLocationRecord[]`; assign next id/sequence/locationNumber; return 201 + created DTO. |
| C2 | FR-10 | same | 404 unknown/inactive customer; 400 if required body fields missing (mirror contract). |

**Acceptance:** Customer 501 POST adds row visible on subsequent GET list; 999 → 404.

---

## D. Integration tests

| Task | FR | Files | Notes |
|------|-----|-------|-------|
| D1 | FR-8 | `tools/integration/src/crm-customer.integration.test.ts` | Happy path: mutate create, then `serviceLocationListQueryOptions(501)` count increases. |
| D2 | FR-10 | same + `fixtures/crm-service-location-response.ts` if needed | 404 + 400 cases; `ApiError` status. |

**Run:** `pnpm exec nx run integration:test-query --testPathPattern=crm-customer` (or project’s documented command).

---

## E. UI library (`@cms/customer-ui`)

New folder: `libs/customer/ui/src/lib/create-service-location-form/` (mirror `create-customer-form/` layout: `component/`, `constant/`, `types/`, `util/`, `index.ts`).

| Task | FR | Component / file | Notes |
|------|-----|------------------|-------|
| E1 | FR-3, FR-7 | `CreateServiceLocationForm.tsx` | RHF + `serviceLocationOnlyFormSchema`; single `SectionCard` grid: left column only `ServiceLocationSection`; **no** `CreationOptionSelector`, **no** `ArCustomerSection`. Form id e.g. `CREATE_SERVICE_LOCATION_FORM_ID`. |
| E2 | FR-4 | `BillToSummaryCard.tsx` | Props: `customer?: CustomerDetailDto`, `paymentTermLabel`, `loading`, `errorMessage`. Initials via same helper as detail (`getCustomerInitials` — import from app or duplicate minimal util in lib). Icons: reuse `@cms/ui` / detail overview icons. |
| E3 | FR-5, FR-6 | `BillToSearchField.tsx` | Controlled search string; debounce ~300ms; `useQuery(customerListQueryOptions({ search, isActive: true, pageSize: 20 }))`; popover/list pick → `onSelectCustomer(customerId)`. Placeholder **Search Bill To**. Empty: “No customers found.” Row label: `displayName ?? name` + `customerNumber`. |
| E4 | FR-3 | `CreateServiceLocationLayout.tsx` (optional) | Two-pane wrapper matching Figma grid (`md:grid-cols-2`); right column stacks search + card. |
| E5 | — | `constant/copy.ts` | Title, breadcrumb labels, button **Create Service Location**, success/error toasts. |
| E6 | — | `libs/customer/ui/src/index.ts` | Barrel exports. |

**Acceptance:** Storybook optional — form renders with MSW customer 501 detail in right pane.

---

## F. App — shared paths (small DRY)

| Task | FR | Files | Notes |
|------|-----|-------|-------|
| F1 | FR-9 | `apps/customer/src/shared/constant/paths.ts` | Move or re-export: `CUSTOMERS_LIST_PATH`, `customerDetailPath`, `serviceLocationCreatePath` (today split between CreateCustomerPage and CustomerDetailPage). Update both pages to import from `shared/constant`. |

---

## G. App — `CreateServiceLocationPage`

**Folder structure** (page-folder-structure rule):

```text
apps/customer/src/pages/CreateServiceLocationPage/
  CreateServiceLocationPage.tsx
  index.ts
  component/
    CreateServiceLocationHeader.tsx      # breadcrumb, title, subtitle, Back
    CreateServiceLocationFormFooter.tsx  # Cancel + submit (form attribute)
    BillToCustomerPanel.tsx              # composes BillToSearchField + BillToSummaryCard
    index.ts
  constant/
    copy.ts
    index.ts                             # re-export paths from shared if needed
  types/
    create-service-location-page.types.ts
    index.ts
  util/
    describe-create-service-location-error.ts
    index.ts
```

| Task | FR | Notes |
|------|-----|-------|
| G1 | FR-1, FR-4 | Parse `customerId` from `useParams`; invalid id → same pattern as `CustomerDetailPage`. |
| G2 | FR-4 | `useQuery(customerDetailQueryOptions(customerId))` drives summary card; loading/error states. |
| G3 | FR-6 | `handleBillToSelect(id)` → `navigate(serviceLocationCreatePath(id), { replace: true })`. Do **not** reset form ref (keep RHF state in parent keyed by stable key — **do not** remount form on customerId change; only card refetches). |
| G4 | FR-8 | Submit: `createServiceLocationMutation.mutateAsync(toServiceLocationCreateDto(values))`; toast; `navigate(customerDetailPath(customerId))`; `skipGuardRef` on success. |
| G5 | FR-9 | Copy discard guard from `CreateCustomerPage` (`useUnsavedChangesGuard`, `DiscardChangesDialog` — import dialog from create-customer **component** or move dialog to `@cms/customer-ui` if already shared). Cancel/Back → `customerDetailPath(customerId)`. |
| G6 | FR-6 | Layout: header `px-8`; body two columns; pinned footer like create-customer. |
| G7 | FR-2 | **Routing** in `apps/customer/src/App.tsx`: |

```tsx
<Route path=":customerId">
  <Route index element={<CustomerDetailPage queryClient={...} />} />
  <Route
    path="service-locations/new"
    element={<CreateServiceLocationPage queryClient={...} />}
  />
</Route>
```

| G8 | — | `pages/index.ts` export; `data-testid="create-service-location-page"`. |

**Header copy (confirmed):** Breadcrumb `Customers` (link) → `{customer display name}` (optional link to detail) → `Create Service Location`; title **Create Service Location**; subtitle **Add a service location to an existing Bill To customer.**

---

## H. Verification

| Task | Command / action |
|------|------------------|
| H1 | `pnpm exec nx run customer:typecheck` |
| H2 | `pnpm exec nx run customer-data-access:typecheck` (if separate) |
| H3 | Integration tests (section D) |
| H4 | Manual: `/customers/501` → Add Location → card shows 501; search pick 502 → URL `/customers/502/service-locations/new`, form fields unchanged; create → `/customers/502`, new SL in list |

---

## Implementation order

1. **A1–A2** → **B1–B5** → **C1–C2** → **D1–D2** (API complete).  
2. **E1–E6** (UI blocks).  
3. **F1** (paths, can parallel with G).  
4. **G1–G8** → **H1–H4**.

---

## Out of scope

- `/service-locations` global list in shell.
- SL edit/view routes.
- Post-create scroll to Service Locations section.
- Inline tag creation.
- Changing Bill To clears SL form (product chose **keep** form).

---

## Risk / notes

| Topic | Mitigation |
|-------|------------|
| Form remount on `:customerId` param change | Keep `CreateServiceLocationForm` state in page; avoid `key={customerId}` on form. |
| `ServiceLocationSection` types | Tied to `CustomerCreateForm`; use intersection or widen props to `{ serviceLocation: ServiceLocationFormValues }`. |
| Duplicate path constants | Step F1 before or with page work. |
| `serviceLocationType` field | Hidden in section UI but required in schema — confirm `ServiceLocationSection` still exposes type select (it should per create-customer). |
