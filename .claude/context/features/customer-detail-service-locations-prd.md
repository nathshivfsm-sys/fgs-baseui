# PRD & implementation plan — Customer Detail: Service Locations section

**Status:** Draft for review (spec + ordered plan; no code in this doc).  
**Product decisions (locked):** no Membership column; toolbar uses API **`search`** query param (generic, per swagger); **Filter** is enabled (Customer type popover).  
**Figma:** file `QyVZOQ6F8iXu2JR4PVcB4U`  
- Empty state: node `15:8946`  
- Populated list: node `15:10035`  
**Screenshots:** `.claude/context/screenshots/customerSLListingBlank.png`, `customerSLListing.png`  
**Related:** [create-service-location-for-bill-to-prd.md](create-service-location-for-bill-to-prd.md) (Add Location create flow), [customer-catalog-api-prd.md](customer-catalog-api-prd.md) (nested SL routes deferred there).

---

## 1. Overview

On **Customer Detail**, the **Service Locations** scroll section (anchor id `customer-service-locations`) must match Figma: an empty state when the Bill To has no locations, and a paginated, sortable table with Active/Inactive tabs when locations exist. Data comes from CRM **`GET /api/v1/customer/{id}/servicelocation`** (and related read endpoints). This replaces the current placeholder copy in `CustomerDetailScrollSections`.

**Audience:** dispatchers and office staff managing Bill To customers.  
**Why now:** detail header/metrics/basic details exist; service locations are the first substantive downstream section and unblock “Add Location” from More Options.

---

## 2. Problem statement

Users open a customer record but cannot see or manage service locations on that record. The section nav promises “Service Locations” yet shows only stub text. Without list API wiring, Add Location has no context and no way to confirm existing properties.

---

## 3. Goals / non-goals

**Goals**

- Render Figma-accurate **empty** and **populated** states inside the existing detail section card.
- Load locations for the **current Bill To customer id** with paging, sorting, API **`search`**, **Customer type filter**, and Active/Inactive tabs driven by API `isActive` + `summary` counts.
- Reuse established catalog list patterns (`DataTable`, `CatalogStatusTabBar`-style toolbar, `describeCatalogError`).
- Add contract + data-access + MSW + integration test for the nested list (and detail read for row View).

**Non-goals (this release)**

- Full **create / edit** service location screens (separate PRD; only **navigate** from CTAs when routes exist).
- **Membership** column (omitted from UI; not in list DTO).
- Company-wide **`GET /servicelocation`** (tenant list); scope is **per customer** only.
- Invoice, Notes, Attachments, Aging, Activity sections (remain placeholders).

---

## 4. User stories

1. As a dispatcher, I want to see all **active** service locations for a Bill To, so I know where we can schedule work.
2. As a dispatcher, I want to switch to **inactive** locations, so I can find historical properties without mixing them into daily work.
3. As a dispatcher, I want to **search** service locations with the same generic search the API supports, so I can find a row quickly without field-specific filters.
4. As a dispatcher, I want to **filter** by customer type, so I can narrow the list without guessing search text.
5. As a dispatcher, when there are **no** locations, I want a clear empty state and **Add location**, so I know the next step.
6. As a dispatcher, I want **Edit** and **View** actions on a row, so I can maintain or inspect a location (routes may ship in a follow-up).
7. As a dispatcher, I want tab counts **Active (n)** / **Inactive (n)** to match the server, so I trust the list.

---

## 5. Design reference

### 5.1 Placement in app

- Section is one of `CUSTOMER_DETAIL_SECTIONS` (`customer-service-locations`).
- Sticky **section nav** already scrolls to `#customer-service-locations`; only the **body** of that section changes.
- Screenshots show the section **below** the sticky header (tabs in screenshot = section nav, not a second tab bar).

### 5.2 Empty state (Figma `15:8946`, `customerSLListingBlank.png`)

| Element | Spec |
|--------|------|
| Container | White card, border `#f7f7f7`, radius 8px, shadow “shadow 1”, min height ~empty content centered |
| Title | **Service Location** (singular), 18px bold, top-left padding ~19px |
| Icon | Building-multiple glyph, ~40px, gray |
| Message | **No service location yet!** — `#828A9B`, 18px medium |
| CTA | **Add location** — outline primary (`#3538BF` border/text), light fill `#F0F6FC`, plus icon, 14px medium |

When `totalCount === 0` for **both** active and inactive (or first load with empty summary), show this empty state **instead of** the table chrome (no Active/Inactive toolbar required if truly zero locations globally for customer).

### 5.3 Populated list (Figma `15:10035`, `customerSLListing.png`)

| Element | Spec |
|--------|------|
| Container | White card, border `#e5e7eb`, radius 10px, shadow 1, vertical padding 16–20px |
| Toolbar row | Bottom border `#e5e7eb` ~1.5px; flex wrap |
| Status tabs | **Active (6)** selected — blue `#2563EB` underline; **Inactive (2)** muted `#6B7280` |
| Search | Compact input, magnifier, placeholder **Search service locations** (or reuse customer-list-style **Search…**); debounced value sent as query param **`search`** unchanged — no client-side field restriction |
| Filter | Outline **Filter** button opens a popover (same interaction model as `CustomerListFilter`): **Customer type** select (Any + `customerTypeSchema` values); Apply / Clear; active filter count on button when applied |
| Primary CTA | **+ Add Location** — outline `#1F54C8`, matches header More Options copy |
| Table header | Background `#FAFAFF`, labels `#1F54C8`, 13px medium; sort icons on **#ID**, **name**, **Address**, **Phone no.** (match customer list sort behavior) |
| Columns | **#ID** → `locationNumber` as action link color; **name** semibold `#2E323C`; **Display Name**; **Address** truncated; **Email** lowercase; **Phone no.**; **Action** edit + view icon buttons (no Membership column) |
| Rows | ~60px height, border `#F3F4F6` |
| Footer | Left: “Showing {from} to {to} of {total} **users**” in Figma — product copy: **locations**; right: page size select (default 10), pagination controls |

### 5.4 Icons

- Prefer existing `@cms/ui` icons (`EditIcon`, eye/view icon if present, `BuildingIcon` or new **building-multiple** icon traced from Figma for empty state).

### 5.5 Filter popover (enabled)

- Mirror `CustomersPage` → `CustomerListFilter`: `Popover` + draft state, Apply resets page to 1, Clear removes filters.
- **Customer type:** single select, default **Any** (empty value); options from `@cms/customer-contract` `customerTypeSchema` labels (reuse create-customer form option labels where possible).
- Optional **applied criteria bar** below toolbar when search and/or filter active (same pattern as `CustomerListCriteriaBar`), e.g. `Customer type: Commercial`.

---

## 6. Functional requirements

| ID | Requirement |
|----|-------------|
| FR-1 | When the customer detail page loads, the Service Locations section fetches `GET /customer/{customerId}/servicelocation` with `includeSummary: true`. |
| FR-2 | Default tab is **Active** (`isActive: true`). Switching tabs resets to page 1 and sets `isActive` false for Inactive. |
| FR-3 | Tab labels show `Active ({summary.activeCount})` and `Inactive ({summary.inactiveCount})` from the latest list response summary. |
| FR-4 | Search debounces and sends the API **`search`** query param (trimmed string); UI does not reinterpret or narrow fields — backend defines match scope. **MSW** mirrors customer list: `matchesSearch` over summary fields `locationNumber`, `name`, `displayName`, `formattedAddress`, `email`, `phone`, `city`, `postalCode`. Clearing search omits `search` and reloads the list. |
| FR-4b | **Filter** opens popover; **Customer type** filter sends `customerType` on the list request (see §7.1); Apply/Clear behave like customer list filters; changing filter resets to page 1. |
| FR-5 | Column sort maps to `sortBy` / `sortDirection` (fields must match swagger-allowed sort keys; default sort TBD with backend — propose `name` asc). |
| FR-6 | Pagination uses `page` (1-based API) and `pageSize` (default **10** per Figma, not swagger default 25). |
| FR-7 | If `totalCount === 0` and not loading, show **empty state** (FR-8). If `totalCount > 0` on current tab, show table; if current tab count is 0 but other tab has rows, show **empty table message** for that tab (reuse customer list empty search copy pattern). |
| FR-8 | Empty state **Add location** and toolbar **Add Location** navigate to the create flow with Bill To preselected (see [create-service-location-for-bill-to-prd.md](create-service-location-for-bill-to-prd.md)); until route exists, wire handlers as no-op or navigate to agreed path. |
| FR-9 | Row **#ID** displays `locationNumber` or em dash; styled as link color, optional navigation to view route. |
| FR-10 | Row **View** loads detail via `GET /customer/{customerId}/servicelocation/{locationId}` when view route/modal exists; v1 may navigate to stub route. |
| FR-11 | Row **Edit** navigates to edit route or defers with disabled state + tooltip if edit screen not built. |
| FR-12 | Loading: skeleton or table loading state; errors use `describeCatalogError` with customer-appropriate messages; 404 on customer propagates from detail page, not duplicated here. |
| FR-13 | Section title in empty state: **Service Location**; populated state may omit duplicate H1 if toolbar is self-explanatory — align with screenshot (no extra title above toolbar in populated frame). |
| FR-14 | More Options **Create New Location** uses the same navigation handler as **Add Location** (DRY). |

---

## 7. API integration (CRM swagger)

**Source:** `https://api-dev.fieldwhizey.com/swagger/crm/v1/swagger.json`  
**Base path (via `customFetch`):** `/customer/{id}/servicelocation`

### 7.1 List (primary)

`GET /customer/{id}/servicelocation`

| Query | Purpose |
|-------|---------|
| `page`, `pageSize` | Pagination |
| `sortBy`, `sortDirection` | Column sort |
| `search` | Toolbar free-text search (swagger string; field scope defined by CRM service, not documented in OpenAPI) |
| `customerType` | Filter popover (see below) |
| `isActive` | Active vs inactive tab |
| `includeSummary` | `activeCount`, `inactiveCount` |

**Filter param note:** Published nested list swagger today lists only `search`, not `customerType`. Company list `GET /servicelocation` supports `customerType` as an array. For this feature:

- Add optional `customerType?: CustomerType` (or `customerType[]`) to `ServiceLocationListParams` in contract.
- **MSW** filters seeded rows by `customerType` when param is present.
- **Integration test** asserts filter behavior against MSW.
- Track **backend follow-up** to add `customerType` to `GET /customer/{id}/servicelocation` if not already deployed (same enum as summary DTO).

**Response envelope:** `ApiResponse<CrmServiceLocationListResultDto>`

**`CrmServiceLocationListResultDto`:** `items`, `page`, `pageSize`, `totalCount`, `summary?`

**`CrmServiceLocationListSummaryDto`:** `activeCount`, `inactiveCount`

**`CrmServiceLocationSummaryDto` (row):** `id`, `locationNumber`, `name`, `displayName`, `formattedAddress`, `email`, `phone`, `isActive`, `customerType`, `city`, `postalCode`, `createdOn`, `createdBy`

**Errors:** `404` if customer not found.

### 7.2 Detail (for View action)

`GET /customer/{id}/servicelocation/{locationId}` → `CrmServiceLocationDetailDto` (full address, contacts, flags, etc.).

### 7.3 Out of scope for listing PRD but linked

| Method | Path | Use |
|--------|------|-----|
| POST | `/customer/{id}/servicelocation` | Create (Add Location) |
| PUT | `/customer/{id}/servicelocation/{locationId}` | Edit |

### 7.4 Contract module (`@cms/customer-contract`)

Add to `libs/customer/contract/src/lib/` (new `service-location.schema.ts` or extend `customer.schema.ts`):

- `serviceLocationSummaryDtoSchema`
- `serviceLocationListSummaryDtoSchema`
- `serviceLocationListResultDtoSchema`
- `serviceLocationDetailDtoSchema` (read fields from swagger detail DTO)
- `serviceLocationListResponseSchema` (+ detail response)
- `ServiceLocationListParams` extending shared `SetupListParams` with `isActive?`, `includeSummary?`, `customerType?` (filter)

Reuse existing `serviceLocationCreateDtoSchema` for POST in the create PRD; add `serviceLocationCreatedDtoSchema` when implementing create.

### 7.5 Data-access (`@cms/customer-data-access`)

New folder `libs/customer/data-access/src/lib/service-location/` (mirror `customer/`):

- `service-location.endpoints.ts` — `customerServiceLocationListEndpoint(customerId, params)`, `customerServiceLocationDetailEndpoint(customerId, locationId)`
- `service-location.keys.ts` — `['customer', customerId, 'service-locations', params]`
- `service-location.queries.ts` — `serviceLocationListQueryOptions`, `serviceLocationDetailQueryOptions`
- Export from lib barrel

### 7.6 MSW (`libs/shared/mocks/src/handlers/customer.ts` or `service-location.ts`)

- Seed 6 active + 2 inactive locations for demo customer **501** (Rivera / existing MSW customer).
- Honor `isActive`, `search` (generic `matchesSearch` over list summary fields), `customerType`, paging, sort.
- Return summary counts consistent with seed.
- `404` for unknown `customerId`.

### 7.7 Integration test

Extend `tools/integration/src/crm-customer.integration.test.ts` (or new `crm-service-location.integration.test.ts`):

- List returns 200, parses Zod, summary counts match items when `includeSummary: true`.
- Inactive tab returns only inactive rows.
- Customer type filter returns only matching rows; combined with `search`.
- Detail 200 for seeded id; 404 for bad location id.

---

## 8. UI implementation plan (ordered)

Traceability: **API** = contract/MSW/tests; **UI** = customer app pages.

| Step | Task | FR | Files (primary) | Depends on |
|------|------|-----|-------------------|------------|
| 1 | **Contract DTOs** for list summary, list result, detail | FR-1 | `libs/customer/contract/src/lib/service-location.schema.ts`, `index.ts` | — |
| 2 | **Endpoints + query options** | FR-1–FR-6 | `libs/customer/data-access/src/lib/service-location/*`, barrel | 1 |
| 3 | **MSW list + detail** handlers + seed data | FR-1, FR-12 | `libs/shared/mocks/src/handlers/customer.ts` or new handler | 1 |
| 4 | **Integration tests** for list/detail | FR-1 | `tools/integration/src/crm-customer.integration.test.ts` | 2, 3 |
| 5 | **Page constants** — copy, column ids, default page size 10 | FR-6, FR-13 | `CustomerDetailPage/constant/` (new `service-locations.ts` or section copy) | — |
| 6 | **`CustomerDetailServiceLocationsSection`** — empty vs populated branch | FR-7, FR-8, FR-13 | `component/CustomerDetailServiceLocationsSection.tsx`, types | 2 |
| 7 | **`CustomerDetailServiceLocationEmptyState`** | FR-8 | `component/CustomerDetailServiceLocationEmptyState.tsx` | 6 |
| 8 | **`CustomerDetailServiceLocationTablePanel`** — tabs, search, table, pagination (clone patterns from `CustomerTablePanel` + `CatalogStatusTabBar`) | FR-2–FR-6, FR-9–FR-11 | `component/CustomerDetailServiceLocationTablePanel.tsx`, `util/` mappers | 2, 6 |
| 8b | **`CustomerDetailServiceLocationFilter`** + criteria bar util (customer type); wire `onFilterClick` on tab bar | FR-4b | `component/CustomerDetailServiceLocationFilter.tsx`, `util/service-location-list-filters.ts` | 8 |
| 9 | **Wire section** — replace placeholder in `CustomerDetailScrollSections` for `customer-service-locations` only; pass `customerId`, `queryClient`, `onAddLocation` | FR-1 | `CustomerDetailScrollSections.tsx`, `CustomerDetailPage.tsx` | 6–8 |
| 10 | **Navigation hooks** — `onAddLocation` from section + More Options popover; path constant `/customers/:customerId/service-locations/new` | FR-8, FR-14 | `CustomerDetailPage`, `constant/paths.ts`, popover | Create SL PRD route |
| 11 | **Icons / polish** — building-multiple empty icon | FR-13 | `@cms/ui` icons, table column defs | 7, 8 |
| 12 | **Manual QA** — customer 501 empty vs seeded, tab counts, search, sort, pagination, error state | All | — | 9 |

### 8.1 Suggested component tree

```text
CustomerDetailScrollSections
  └── CustomerDetailServiceLocationsSection (id=customer-service-locations)
        ├── CustomerDetailServiceLocationEmptyState   (total === 0)
        └── CustomerDetailServiceLocationTablePanel   (else)
              ├── CatalogStatusTabBar (reuse; Filter opens CustomerDetailServiceLocationFilter)
              ├── CustomerDetailServiceLocationCriteriaBar (optional, when search/filter applied)
              └── DataTable<ServiceLocationSummaryDto>
```

### 8.2 DataTable columns (v1)

| Column id | Source field | Notes |
|-----------|--------------|--------|
| `locationNumber` | `locationNumber` | Link styling; sortable |
| `name` | `name` | Semibold; sortable |
| `displayName` | `displayName` | |
| `formattedAddress` | `formattedAddress` | Truncate with title tooltip |
| `email` | `email` | Lowercase display |
| `phone` | `phone` | `formatLocaleMobile` if applicable |
| `actions` | — | Edit + View icon buttons |

---

## 9. Edge cases & error states

- **Customer still loading:** section shows skeleton; do not fetch until `customerId` valid and detail query succeeded.
- **List error:** inline message in section card; retry button refreshes query.
- **Empty active tab, inactive has rows:** show inactive empty copy (“No active service locations”) not global empty state.
- **Global zero locations:** empty state even if summary `{0,0}`.
- **Search no matches:** “No service locations match your search” (mirror customers page).
- **Filter no matches:** “No service locations match your filters” when only filter applied or search+filter yield zero rows.
- **Very long address/email:** truncate; full value in `title` attribute.
- **Stale tab counts after create:** invalidate `serviceLocationListQueryOptions` keys on successful create (when create flow lands).

---

## 10. Success metrics

- Service Locations section matches Figma empty and populated layouts on reference viewports.
- List data matches CRM/MSW for seed customer; tab counts align with `summary`.
- No placeholder “content will appear here” text for this section.
- Integration test green for list + detail read paths.

---

## 11. Open questions / assumptions

1. ~~Membership column~~ — **Removed** from scope per product.
2. ~~Search~~ — **Locked:** use API **`search`** param only (generic); MSW multi-field `matchesSearch`; placeholder **Search service locations**.
3. ~~Filter~~ — **Locked:** enabled; **Customer type** popover (Any + enum values).
4. **Footer copy:** Figma “128 users”; use **locations** and `totalCount` from API.
5. **Empty vs populated title:** Empty uses “Service Location”; populated frame has no section H1 — **no duplicate title** above toolbar when populated.
6. **`customerType` on nested list API:** Swagger snapshot for `GET /customer/{id}/servicelocation` may not list `customerType` yet; contract + MSW include it; confirm with backend before relying on production filtering.
7. **View/Edit destinations:** View → future detail drawer/page; Edit → future edit route; listing PRD only **wires navigation stubs**.
8. **Default page size:** Figma **10** overrides swagger default **25**.
9. **Sortable fields:** Confirm allowed `sortBy` values with backend (map column ids to API names).
10. **Create route owner:** `apps/customer` route `/customers/:customerId/service-locations/new` per create SL PRD.

---

## 12. Next step after approval

Run **`feature-implementation-planner`** (or **`catalog-endpoint-implementation-planner`** for steps 1–4 only) against this doc, then implement in order **1 → 12**.
