# Implementation Plan — Create Customer (Bill To / Bill To + Service Location)

## MFE layout (updated)

| Layer | Owner | Contents |
| ----- | ----- | -------- |
| `apps/customer` | Customer remote | `/customers/*` — list, detail, **Create Customer** page shell (header, footer, routing, mutations) |
| `apps/lead` | Lead remote | `/leads/*` only — no customer screens |
| `apps/servicelocation` (planned) | Service location remote | Add SL to existing Bill To; reuses shared form from `@cms/customer-ui` |
| `@cms/customer-contract` / `@cms/customer-data-access` | Customer MFE libs | CRM wire DTOs, queries, `customerCreateFormSchema`, `toCustomerCreateDto` |
| `@cms/customer-ui` | Shared between customer + servicelocation | Create form: option selector, SL + AR sections, address dialog, Same-as, tags, form wrappers — **not** list/detail pages |

Shell loads **`customer`** remote for `/customers/*` (port **5105**). `@cms/lead-contract` remains for legacy references but new work uses `@cms/customer-contract`.

**Next migration step:** move `CreateCustomerPage/component|constant|types|util` (form-only) into `libs/customer/ui/src/lib/create-customer-form/` and import from `@cms/customer-ui` in both remotes.

**Source spec:** Acceptance criteria pasted in chat (no PRD file yet; the REQ list below is derived from it).
**Figma:** file `QyVZOQ6F8iXu2JR4PVcB4U` — node `22:472` (Create Service Location & AR Customer, two-pane) and node `67:427` (Create Service Location for an existing Bill To; see Scope note).
**Proposed branch:** `feature/customer-create-bill-to-service-location`
**Codebase context:** Lead remote (`apps/lead`), `CustomersPage` list already built. Wire DTOs, data-access factories, and MSW for `/customer` already exist (`@cms/lead-contract`, `@cms/lead-data-access`, `@cms/shared-mocks`). Form pattern reference: Settings `AddEmployeePage` (full-page form + pinned footer) and Company General Info (RHF + Zod, `FormTextInput` wrappers, address dialog, "Same as physical address").

## What already exists vs. what is missing

| Area | State |
| ---- | ----- |
| `POST /customer` DTO with `creationOption` + nested `serviceLocation` | Exists in `customer.schema.ts`; matches the live CRM swagger (`CrmCustomerCreateDto`, `CrmCustomerCreationOption = billToOnly \| billToAndServiceLocation`). One request creates both records, so the UI makes one call, not two. |
| `createCustomerMutationOptions` | Exists; invalidates `customerKeys.all`. |
| MSW `POST /customer` | Exists but does not generate `customerNumber` (it echoes `body.customerNumber ?? null`) and does not require `serviceLocation` for `billToAndServiceLocation`. |
| `CustomersPage` "Add customer" | Shows a "coming soon" toast. Needs to navigate. |
| Route `/customers/new` | Missing. `App.tsx` has `index` and `:customerId` only. |
| `CustomerDetailPage` | Stub ("not built yet"). AC requires navigating to it; the stub is acceptable this pass. |
| Lead app deps | No `react-hook-form`, `@hookform/resolvers`, `@cms/shared-data-access`, `@cms/shared-contract`. |
| Lookups needed by the form | Geo (country/state/city) exist in `@cms/shared-data-access`. **Payment terms, tags and business unit (GL break) lookups are now in `@cms/shared-contract` / `@cms/shared-data-access` (done, see Tasks 1-2).** `paymentTermLookupQueryOptions` (`id`, `name`), `tagLookupQueryOptions` (`id`, `tagCode`, `name`), `glBreakLookupQueryOptions` (`id`, `code`, `name`, `breakLevel`; moved from Settings, re-exported from `@cms/settings-data-access`). `gloBusinessTypeLookupQueryOptions` (`/glo/businesstype/lookup`) was also added to the geo-lookup module; the form does not use it yet. |
| Address UI + geo hook | `useGeoLookupOptions` and the address dialog are Settings-app-owned. Lead is the second consumer, so the hook must be promoted (not copied). |
| Unsaved-changes guard | All apps use `BrowserRouter` (not a data router), so `useBlocker` is unavailable. |

## Requirements (derived from the AC)

| ID | Requirement |
| -- | ----------- |
| REQ-1 | Create screen offers two mutually exclusive options: **Bill To Customer & Service Location** and **Bill To Customer Only**. One is selected by default. |
| REQ-2 | The selected option decides which sections and fields render. |
| REQ-3 | *Bill To + SL*: show Service Location and AR Customer sections. SL details are mandatory. "Same as Service Location" is available and populates the applicable AR fields, while keeping two separate records. Submit creates the Bill To and the SL, linked. |
| REQ-4 | *Bill To Only*: SL section is hidden entirely, "Same as Service Location" is hidden, no SL field is required or validated. Submit creates only the Bill To. A Bill To with zero SLs is valid. |
| REQ-5 | Switching option before save shows or hides the SL section. Hidden SL data is never submitted. Validation applies only to the visible option's fields. |
| REQ-6 | AR fields: Customer Name\*, Display Name\*, Customer Type, Billing Address, Primary Contact Name/Email/Phone, Website, Payment Terms\*, Tax Exempt. Mandatory checks plus Email/Phone/Website format checks. |
| REQ-7 | Primary button reads **Create Customer & Location** or **Create Customer** per option. On success: unique Customer ID, status Active, success toast, navigate to Customer Details. |
| REQ-8 | Cancel/Back never creates anything. If the form is dirty, confirm before discarding. |
| REQ-9 | Mandatory SL fields not on the form (service location type, GL breaks, etc.) come from default settings on the backend. The UI does not invent them. |

## Resolved Assumptions

- **Default option** is *Bill To Customer & Service Location* (it is the pre-selected card in the Figma frame). Confirm it is the agreed business rule.
- **One request.** The UI posts a single `POST /customer` with `creationOption`. Atomicity of the Bill To + SL creation is a backend responsibility (see Notes).
- **Customer ID** is generated by the backend. The UI sends no `customerNumber`. The new row is `isActive: true` by backend default; the UI does not send `isActive` on create.
- **`customerType`** exists only on the SL create DTO. It is not part of the Bill To DTO, and Figma's AR section has no such field. The AC lists "Customer Type" under AR Customer Information; this plan follows Figma and the API (SL-only). See Notes.
- **Same as Service Location** mirrors these SL fields into the AR section: customer/display name (from Location/Display name), the address, primary contact name/email/phone. It does not mirror tags, website, payment terms, tax exempt (SL has no equivalent). It is on by default as in Figma. While on, mirrored AR fields are read-only and follow SL edits live. Unchecking keeps the copied values and makes them editable. The two records are always sent separately.
- **Address** is a single address per record (flat fields in the DTO). Empty → "+ Address" button; set → address card with edit (pencil) and remove (trash). Address should be required and add address button should be disabled once a address was added.
- **Form state** keeps SL values in memory when the user switches to Bill To Only and back (no `shouldUnregister`), but the mapper ignores them in Bill To Only mode.
- **Tags** are chosen from the tag lookup (multi-select Combobox). Creating a new tag inline is out of scope.
- **Business Unit** (SL) maps to `break1Id` using GL breaks with `breakLevel` 1. `break2Id` is omitted (backend default).
- **Routing:** `/customers/new`, absolute-path navigation constants (as Settings does), to avoid the route-relative `'..'` bug noted in `current-feature.md`.

## Behaviour matrix

| Concern | Bill To & Service Location | Bill To Only |
| ------- | -------------------------- | ------------ |
| Page title | "Create Service Location & AR Customer" (Figma) | "Create AR Customer" (assumed; no Figma frame) |
| Sections | SL + AR | AR only |
| "Same as Service Location" | visible, default on | hidden, forced off |
| Required | SL: Location Name, Display Name. AR: Customer Name, Display Name, Payment Terms (Customer Name/Display Name skipped while Same-as is on, since they mirror required SL fields). | AR: Customer Name, Display Name, Payment Terms |
| Format checks | SL contact email/phone; AR contact email/phone, website | AR contact email/phone, website |
| Request body | `creationOption: 'billToAndServiceLocation'`, `serviceLocation: {...}` | `creationOption: 'billToOnly'`, no `serviceLocation` key |
| Button | Create Customer & Location | Create Customer |

## Task Breakdown

### A. Foundations (contract, data-access, mocks)

| # | Task | Maps to | File(s) | Depends on |
| - | ---- | ------- | ------- | ---------- |
| 1 | **DONE.** Shared contract + data-access for **payment term** and **tag** (full swagger set: list, detail, lookup, create, update, patch; `activeOnly` on lookups) plus `/glo/businesstype/lookup`. GL break **lookup** schema, endpoint, key and `glBreakLookupQueryOptions` moved from settings to shared; `@cms/settings-data-access` re-exports them and `libs/settings/data-access/package.json` now depends on `@cms/shared-data-access`. GL break lookup keys stay under the `['gl-break']` root so Settings mutations still invalidate them. | REQ-6, REQ-9 | `libs/shared/contract/src/lib/{payment-term,tag,gl-break-lookup}.schema.ts`, `libs/shared/data-access/src/lib/{payment-term,tag,gl-break-lookup}/*`, `libs/settings/data-access/src/lib/gl-break/*` | — |
| 2 | **DONE.** MSW handlers for payment term and tag (lookup, list, detail, create, update, patch). Seeds include Net 30 at id 2 so `defaultPaymentTermId: 2` resolves, plus an inactive term and tag. GL break lookup handler already existed (now typed from shared-contract). `test:query` coverage in `shared-catalog.integration.test.ts`. | REQ-6 | `libs/shared/mocks/src/handlers/{payment-term,tag}.ts`, `handlers/index.ts` | 1 |
| 3 | **DONE.** Form schema + mapper in `libs/lead/data-access/src/lib/customer/customer.form.ts`: `customerCreateFormSchema` as a `discriminatedUnion('creationOption', …)` so Bill To Only has no SL rules; `sameAsServiceLocation` handling in the AR required checks; Email/Phone/Website validators; `toCustomerCreateDto(values)` that resolves Same-as, composes `formattedAddress`, omits `serviceLocation` for Bill To Only, omits `customerNumber`, and sends `defaultPORequired: false`. Export from the module barrel. | REQ-3–REQ-6, REQ-9 | `customer.form.ts`, `customer/index.ts` | — |
| 4 | **DONE (product).** UI collects **Customer type** and **Service location type** on the SL section before submit (user confirmed enums are required on the form, not backend-only defaults). Contract left strict on `serviceLocationCreateDtoSchema`. | REQ-9 | `ServiceLocationSection.tsx`, `customer.schema.ts` | — |
| 5 | **DONE.** MSW `POST /customer`: generate `customerNumber` (`C-` + next), force `isActive: true`, return 400 when `billToAndServiceLocation` has no `serviceLocation`, ignore any `serviceLocation` for `billToOnly`. | REQ-3, REQ-4, REQ-7 | `libs/shared/mocks/src/handlers/customer.ts` | 4 |
| 6 | **DONE (partial).** `test:query`: mapper tests (Bill To Only drops hidden SL data, Same-as resolution, null vs `''`, no `customerNumber`), create request bodies per mode, `ApiError` propagation, list cache invalidated after create. Extend existing file. | REQ-3–REQ-5, REQ-7 | `tools/integration/src/crm-customer.integration.test.ts` | 3, 5 |

### B. App wiring

| # | Task | Maps to | File(s) | Depends on |
| - | ---- | ------- | ------- | ---------- |
| 7 | **DONE.** Add `react-hook-form`, `@hookform/resolvers` (same pins as Settings), `@cms/shared-data-access`, `@cms/shared-contract`, `zod` as needed to `apps/lead/package.json`; update lockfile. Check whether new shared packages need an entry in `tools/module-federation/shared.ts`. | all | `apps/lead/package.json`, `pnpm-lock.yaml`, `tools/module-federation/shared.ts` | — |
| 8 | **DONE.** Promote `useGeoLookupOptions` + `to-geo-select-options` to `@cms/shared-data-access`; Settings re-exports from app `shared/util`. so lead can use them (second consumer). Target: `@cms/shared-data-access` (takes `queryClient` explicitly, composes the existing geo factories). Settings re-points its imports. | REQ-6 | `libs/shared/data-access/src/lib/geo-lookup/*`, `apps/settings/src/shared/util/*` and its 7 consumers | 1 |
| 9 | **DONE.** Route + entry points: add `new` route before `:customerId`; `CustomersPage.handleAddCustomer` navigates to `/customers/new`; remove the "coming soon" toast. | REQ-1, REQ-7 | `apps/lead/src/App.tsx`, `pages/index.ts`, `CustomersPage.tsx` | 11 |

### C. Page: `apps/lead/src/pages/CreateCustomerPage/`

Page-owned folders: `component/`, `constant/`, `types/`, `util/`, each with `index.ts`. Props live in `types/`, handlers are named arrows, import through folder barrels.

| # | Task | Maps to | File(s) | Depends on |
| - | ---- | ------- | ------- | ---------- |
| 10 | **DONE.** `types/`, `constant/` (copy, labels, option values, paths `CUSTOMERS_LIST_PATH`, `CUSTOMER_DETAIL_PATH`, customer-type options, form id). | all | `types/create-customer-page.types.ts`, `constant/*` | 3 |
| 11 | **DONE.** `CreateCustomerPage.tsx`: thin orchestrator. `useMutation(createCustomerMutationOptions(queryClient))`, owns `useForm` (`zodResolver(customerCreateFormSchema)`, `mode: 'onBlur'`, default option), success toast + `navigate(detail path)`, error toast through `describeCreateCustomerError`. | REQ-7 | `CreateCustomerPage.tsx`, `index.ts` | 3, 10 |
| 12 | **DONE.** Form field wrappers for lead: `FormTextInput`, `FormSelectField`, `FormMultiSelectField` (tags), `FormCheckbox`, `FormPhoneInput`, `FormEmailInput`. Page-owned under `component/form/`. (Settings has the same wrappers per page; promoting all of them to one shared place is a follow-up.) | REQ-6 | `component/form/*` | 7 |
| 13 | **DONE.** `CreateCustomerHeader` (breadcrumb, title by option, subtitle, Back) and `CreationOptionSelector` (two selectable cards built from `RadioGroup` + `RadioGroupItem`; selected card uses the `#e9f2ff` tint from Figma mapped to existing tokens). | REQ-1, REQ-2 | `component/CreateCustomerHeader.tsx`, `CreationOptionSelector.tsx` | 10, 12 |
| 14 | **DONE.** Shared pieces used by both sections: `PrimaryContactFields`, `AddressCard` (map-pin tile, pencil, trash), `AddressFormDialog` + `AddressFormFields` (country → state → city cascade, reset dependents, reusing the Company address pattern), `TagsField`. Use existing icons; trace any missing glyph from Figma (`MapPinIcon`, pencil, trash first checked in `libs/ui/src/icons`). | REQ-3, REQ-6 | `component/*` | 8, 12 |
| 15 | **DONE.** `ServiceLocationSection` (includes **service location type** + **customer type** selects per Task 4): Location Name\*, Display Name\*, Customer Type select, address, primary contact, Can Receive (Estimates / Invoices / Appointments, all checked by default), Tax header + Tags, Business Unit select. Rendered only for `billToAndServiceLocation`. Unmounted, not CSS-hidden, so it cannot be focused or validated. | REQ-3, REQ-5 | `component/ServiceLocationSection.tsx` | 13, 14 |
| 16 | **DONE.** `ArCustomerSection`: Customer Name\*, Display Name\*, address, primary contact, Website, Payment Terms\*, Tax Exempt checkbox, Tags. "SAME AS SERVICE LOCATION" checkbox in the header only for `billToAndServiceLocation`. | REQ-3, REQ-4, REQ-6 | `component/ArCustomerSection.tsx` | 13, 14 |
| 17 | **DONE.** `util/use-same-as-service-location.ts`: while checked, mirror SL → AR (name, display name, address, contact) from a form subscription, lock mirrored AR fields; uncheck keeps values. Forces the flag off and ignores it in Bill To Only. | REQ-3, REQ-5 | `util/use-same-as-service-location.ts` | 15, 16 |
| 18 | **DONE.** `CreateCustomerFormFooter`: pinned bar, Cancel + primary button with option-dependent label and pending state (disabled while submitting, no double submit). | REQ-7 | `component/CreateCustomerFormFooter.tsx` | 10 |
| 19 | **DONE.** Discard flow: `DiscardChangesDialog` (existing `Dialog`; no AlertDialog in `@cms/ui`). Cancel and Back open it only when `formState.isDirty`, otherwise navigate straight away. `beforeunload` guard while dirty and not submitting. Disable the guard after a successful create so navigating to the detail page does not prompt. | REQ-8 | `component/DiscardChangesDialog.tsx`, `util/use-unsaved-changes-guard.ts` | 11 |
| 20 | **DONE.** `util/describe-create-customer-error.ts` via the shared `describeCatalogError` (`apps/lead/src/util/describe-catalog-error.ts`) with 400/403/409 copy; invalid/duplicate shown as toast. | REQ-7 | `util/describe-create-customer-error.ts` | 11 |
| 21 | **DONE (first pass).** Layout to Figma `22:472`: header, option bar, two scrolling panes (SL left, AR right), pinned footer. Follow the height-chain rule in `.claude/rules/table-scroll-layout.md` (`min-h-0`, `overflow-hidden` wrappers, `ScrollArea` per pane) so only the panes scroll. Responsive stack below `lg`. Fonts and sizes come from tokens, not the raw hex/px in the Figma export. | REQ-2 | all `component/*` | 15, 16 |

### D. Verification and docs

| # | Task | Maps to | File(s) | Depends on |
| - | ---- | ------- | ------- | ---------- |
| 22 | **PENDING.** Stories with `play` functions (`createStoryApi`): default option selected; switch to Bill To Only hides SL + Same-as and the button label changes; switch back restores SL values; required-field errors per mode (SL errors absent in Bill To Only); Same-as mirrors then unlocks; recorded POST body per mode (no `serviceLocation` key for Bill To Only); Cancel with dirty form opens the discard dialog, clean form does not; successful create navigates and toasts. | REQ-1–REQ-8 | `CreateCustomerPage.stories.tsx` | 21 |
| 23 | **PENDING.** Run `lint` + `typecheck` for `lead`, `lead-contract`, `lead-data-access`, `shared-contract`, `shared-data-access`, `shared-mocks`, `settings`, `settings-data-access`, `integration`; `test:query`; `storybook:test` (lead + settings stories); `check:paths`. Browser pass on the dev server with `VITE_USE_MOCK_API=true`: both modes, switching, Same-as, discard dialog, success → detail page, a 400 from MSW, a 390px viewport. | all | — | 1–22 |
| 24 | Update `current-feature.md` status and record the final PRD-style spec for this feature next to this plan. | workflow | `.claude/context/current-feature.md` | 23 |

**Suggested commits** (after approval; none made):

1. `feat(shared-data-access)`: payment term, tag, GL break lookups (Tasks 1-2, done); promoted geo options hook (Task 8, pending).
2. `feat(lead-data-access)`: customer create form schema and mapper (Tasks 3, 4).
3. `feat(shared-mocks)`: lookup handlers, customer create behaviour; `test:query` (Tasks 2, 5, 6).
4. `feat(lead)`: Create Customer page, route, entry point, stories (Tasks 7, 9–22).
5. `docs`: plan and `current-feature.md`.

## Out of Scope This Pass

- Customer Details screen content and the "Add Service Location" flow from it (the AC says SLs are added later from there).
- Node `67:427` ("Create Service Location" with "Search Bill To") unless the owner pulls it in; see Notes. Section components in Tasks 14–15 are built so that screen can reuse them.
- Creating a new tag inline, address autocomplete/geocoding (`placeId`, lat/long), duplicate-customer detection, `customerAccountNumber`, pricing matrices, PO-required toggle.
- Promoting every form wrapper to a single shared lib (follow-up).
- Blocking in-app sidebar / browser-back navigation (see Notes).

## Notes for Review

1. **Backend confirmation (blocks REQ-9).** Swagger types `serviceLocationType` and `customerType` as non-null enums with nothing marked required. If the UI omits them, does the backend apply default settings, or silently use the first enum value (`residential`)? Also confirm one `POST /customer` is transactional (no customer without its SL on failure), and that `break1Id`/`break2Id` omitted means "use default settings".
2. **Node `67:427` is a different flow.** It is titled "Create Service Location" and replaces the AR form with a "Search Bill To" selector plus a read-only Bill To summary card (name, address, phone, email, website, "Net 45"), with the button "Create Service Location". It maps to `POST /customer/{id}/servicelocation`, not to this AC. The AC does not mention it.
3. **No frame for Bill To Only.** Both Figma nodes show only the two-pane layout. This plan keeps the AR section in the same pane position with the SL pane absent, and uses the title "Create AR Customer". Needs design confirmation.
4. **AC vs Figma / API mismatches**
   - "Customer Type" is listed under AR Customer Information in the AC, but the Bill To DTO has no such field and Figma places it on the SL section only.
   - "Billing Address" in the AC; the AR address card in Figma is labelled "Service Address" (copy slip). This plan labels it "Billing Address".
   - Business Unit placeholder in Figma reads "Select terms" (copy slip). Using "Select business unit".
   - The SL "TAX" sub-header has no tax field of its own (Tags sits beside it). Rendered as drawn unless design says otherwise.
   - Figma shows both an address card and a "+ Address" button at once; with a single-address API, this plan shows one or the other.
5. **Unsaved-changes guard is partial.** The apps use `BrowserRouter`, so `useBlocker` is not available. Cancel, Back, and tab close/refresh are guarded. Clicking another sidebar item or the browser Back button is not. Fixing that requires moving the shell and remotes to a data router, which is outside this feature.
6. **Customer-name mirroring.** With Same-as on, AR name/display name equal the SL's. If the product wants the Bill To to keep its own legal name by default, flip the default to off.
7. **Dev-server note.** Adding exports to an MF-shared lib needs a shell dev-server restart (see `current-feature.md`, Company General Info). Do not run `pnpm run format` on this checkout (CRLF rewrite); format only touched files.
