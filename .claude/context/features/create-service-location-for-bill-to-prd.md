# PRD — Create Service Location for an existing Bill To (AR Customer)

**Status:** Requirements confirmed (assumptions in §10 approved). Implementation plan: [customer-create-service-location-plan.md](customer-create-service-location-plan.md).
**Figma:** file `QyVZOQ6F8iXu2JR4PVcB4U`, node `67:465` (two-pane body — Service Location + AR Customer summary). Full page chrome (breadcrumb, title, footer) aligns with node `67:427` / screenshot [servicelocation-existingcustomer.png](../screenshots/servicelocation-existingcustomer.png).
**Related:** [customer-create-bill-to-service-location-plan.md](customer-create-bill-to-service-location-plan.md) (create Bill To ± SL at `/customers/new`); [customer-detail-service-locations-prd.md](customer-detail-service-locations-prd.md) (list on Customer Details).

## 1. Overview

From Customer Details, **Add Service Location** (and equivalent actions) navigates to a dedicated **Create Service Location** screen. The user fills only the **Service Location** form (left pane). The **Bill To (AR customer)** is shown read-only in the right pane, prefilled from the URL `customerId`. The user may **search and pick a different Bill To**; selecting one **updates the URL** to that customer’s id and refreshes the summary card. Submit creates one Service Location under the Bill To currently in the URL.

There is **no** “Bill To Customer & Service Location” vs “Bill To Customer Only” option on this screen — that selector exists only on **Create Customer**.

## 2. Problem Statement

Bill To customers often need additional service locations after creation. Customer Details already lists locations and exposes Add actions, but the create screen was not built. Reusing the existing Service Location UI avoids duplicate validation and address behavior.

## 3. Goals / Non-Goals

**Goals**

- Navigate from Customer Details with the current Bill To prefilled (no AR form fields).
- Reuse `@cms/customer-ui` Service Location section (fields, address dialog, tags, business unit, Can Receive, tax) and the same validation rules as create-customer’s SL mode.
- Allow changing the Bill To via **Search Bill To** without leaving the page; URL reflects the selected customer.
- Single `POST` to attach the location to the Bill To in the URL.
- Unsaved-changes guard on Cancel / Back when the SL form is dirty.

**Non-Goals**

- Creating or editing the Bill To on this screen (right pane is display + search only).
- **CreationOptionSelector** or “Same as Service Location” (N/A — no AR form).
- Service Location edit/delete, bulk create, or global `/service-locations` catalog list (unless explicitly added later).
- Inline tag creation, geocoding beyond existing address dialog.

## 4. User Stories

1. As a dispatcher on Customer Details, I click **Add Service Location**, land on create with that customer already selected, so I can enter the new property immediately.
2. As a dispatcher, I search for another Bill To and select them, so the location is created under the correct customer if I started from the wrong detail page.
3. As a dispatcher, I see Bill To name, address, phone, email, website, and payment terms before submit, so I confirm the parent customer.
4. As a dispatcher, after success I return to Customer Details and see the new location in the list.

## 5. Design Reference (node `67:465` + screenshot)

**Left — Service Location Information**

- Location Name*, Display Name*, Customer Type (select).
- Address: “+ Address”, card with Service Address, edit/delete.
- Primary Contact: name, email, phone.
- Can Receive: Estimates, Invoices, Appointments (default all checked, same as create-customer).
- Tax sub-header; Tags multi-select; Business Unit select.

**Right — AR Customer Information**

- Section header with **Search Bill To** (search icon + placeholder “Search Bill To”).
- Summary card: initials avatar, display/name, address (pin), phone, email, website (link), payment terms (e.g. Net 45).

**Page chrome (from screenshot / related frames)**

- Breadcrumb, title **Create Service Location**, Back, pinned footer: **Cancel**, primary **Create Service Location** (map pin).
- Copy should **not** say “Create AR Customer & Service Location” (that belongs to `/customers/new`).

## 6. Functional Requirements

| ID | Requirement |
| -- | ----------- |
| FR-1 | **Entry:** Customer Details **Add Service Location** (section empty state, table toolbar, More Options → Create New Location) navigates to `/customers/:customerId/service-locations/new`. `:customerId` is the Bill To from the detail page. |
| FR-2 | **Route:** Customer MFE owns the route. Nested under existing `:customerId` route: `service-locations/new` **before** any future `:locationId` segment. |
| FR-3 | **Layout:** Two-pane layout matching Figma. **No** creation-option cards. Left = editable SL only. Right = read-only Bill To summary + search. |
| FR-4 | **Prefill:** On load, `GET /customer/{id}` loads the Bill To for `:customerId`. Summary card shows detail fields; loading skeleton while pending; error + search fallback if 404/inactive. |
| FR-5 | **Search:** Search uses customer **list** API with generic `search` (same as Customers list — name, display name, customer number, etc.). Debounced typeahead or combobox; active customers only unless product says otherwise. Empty: “No customers found.” |
| FR-6 | **Select customer:** Choosing a search result sets the Bill To, loads detail for the card, and **replaces the URL** with `/customers/{newId}/service-locations/new` (`replace: true` preferred so Back from detail does not loop through prior ids). **Service Location form values are preserved** when the Bill To changes. |
| FR-7 | **Submit enabled** when Bill To is loaded/selected and all required SL fields pass validation (same required set as create-customer SL: Location Name*, Display Name*, Customer Type, Service Location Type, address required, email/phone format when provided). |
| FR-8 | **Submit:** `POST /api/v1/customer/{id}/servicelocation` with `CrmServiceLocationCreateDto` body; `{id}` is URL `customerId`. Success toast; navigate to `/customers/{id}` (Customer Details). New location is active. |
| FR-9 | **Cancel / Back:** No create. If SL form dirty, discard confirmation (reuse create-customer dialog pattern). If clean, navigate to Customer Details for current URL `customerId` (assumption — see Open Questions). |
| FR-10 | Submit pending state disables double submit. Errors keep form data and show `describeCatalogError` / API message. |
| FR-11 | Invalid `:customerId` in URL: page-level invalid-id message with link back to customers list (same pattern as Customer Details). |

## 7. Edge Cases & Error States

- Bill To deleted/inactive between load and submit → 404 on POST; message “This customer is no longer available”; clear selection or force re-search; keep SL form.
- Search/network failure → inline error; retry by searching again.
- Long names/addresses in summary card wrap; no horizontal overflow on page.
- Browser refresh with dirty form → native beforeunload via existing guard.
- Deep link with valid id but user lacks permission → 403 messaging on detail fetch.

## 8. Success Metrics

- Users can add a location from Customer Details in one flow without re-entering Bill To data.
- Wrong-customer mistakes reduced via summary card + optional search.
- No duplicate SL form implementation in the app layer.

## 9. Technical Notes (for implementation plan)

- **Endpoint:** `POST {customerDetailEndpoint(customerId)}/servicelocation` — collection URL already in `@cms/customer-data-access`; add create mutation + `serviceLocationCreatedDtoSchema` in `@cms/customer-contract` (see customer-detail-service-locations PRD).
- **Form:** New `serviceLocationCreateFormSchema` + `toServiceLocationCreateDto` in data-access (SL fields only), or narrow reuse from customer form mapper — do not POST `creationOption` / nested customer create.
- **UI reuse:** `ServiceLocationSection`, address dialog, form wrappers from `@cms/customer-ui`. New right-pane components: `BillToSearchField`, `BillToSummaryCard` (page or lib).
- **Queries:** `customerDetailQueryOptions`, `customerListQueryOptions({ search, isActive: true, pageSize })`, `paymentTermLookupQueryOptions` for terms label.
- **MSW:** Extend `libs/shared/mocks/src/handlers/service-location.ts` with POST create, 201 body, 404 unknown customer, 400 validation.
- **Navigation constant:** `serviceLocationCreatePath(customerId)` already exists in Customer Detail `paths.ts`.

## 10. Resolved decisions (confirmed)

| # | Topic | Decision |
| - | ----- | -------- |
| 1 | Standalone entry | **V1:** only `/customers/:customerId/service-locations/new` (always have an id from detail or manual URL). No `/service-locations/new` without customer. |
| 2 | Cancel / Back target | Navigate to **Customer Details** for current URL customer, not customers list. |
| 3 | Search label | Figma **“Search Bill To”** (not “Search customer”). |
| 4 | Searchable customers | **Active only** (`isActive: true` on list params if supported). |
| 5 | Summary card fields | Phone/email/website from Bill To primary contact + `website`; payment term from `defaultPaymentTermId` + lookup. Address from formatted billing address on detail DTO. |
| 6 | Header copy | Breadcrumb e.g. `Customers > {name} > Create Service Location` or `Customers > Create Service Location`; subtitle e.g. “Add a service location to an existing Bill To customer.” |
| 7 | After create | Land on Customer Details **overview** (not auto-scroll to new row). Optional scroll-to-section is a nice-to-have. |
| 8 | Icons on summary card | Reuse `@cms/ui` icons where they exist (MapPin, Phone, Email, Link, PaymentTerms); match Customer Detail overview where possible. |
