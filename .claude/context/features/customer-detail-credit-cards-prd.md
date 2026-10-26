# PRD & implementation plan — Customer Detail: Credit Cards

**Status:** Draft for review (spec + ordered plan; no code in this doc).  
**Figma:** file `QyVZOQ6F8iXu2JR4PVcB4U` — node `19:12327`  
**Screenshot:** `.claude/context/screenshots/cclisting.png`  
**Related:** [customer-detail-service-locations-prd.md](customer-detail-service-locations-prd.md), [customer-catalog-api-prd.md](customer-catalog-api-prd.md)

---

## 1. Overview

On **Customer Detail**, users view and manage credit cards saved for the selected Bill To customer so they can maintain payment methods and identify the **default** card for payments. The **Credit Cards** section (`#customer-credit-cards`) replaces the placeholder in `CustomerDetailScrollSections` with a Figma-aligned listing plus add, edit, and remove flows integrated with the **configured payment gateway** (tokenization only — no raw card data in FSM).

**Primary user story**

> As a user, I want to view and manage credit cards saved for a customer, so that I can maintain the customer's payment methods and identify the default card for payments.

**Audience:** office staff and billing users with customer/payment permissions.  
**Why now:** overview metrics show **Active Cards**; the detail section must deliver the list and lifecycle actions behind that number.

---

## 2. Problem statement

Users cannot see saved cards, set a default, add a card through the payment provider, or safely remove a card when it is tied to scheduled payments. Placeholder copy under **Credit Cards** blocks day-to-day payment-method maintenance on the customer record.

---

## 3. Goals / non-goals

**Goals**

- List all cards for the customer when **Credit Cards** is selected in section nav.
- Mask PAN display; process add/update through payment gateway tokens.
- Enforce **single default**, default business rules, and **inactive/expired** restrictions on default.
- Edit permitted fields only; remove with confirmation and scheduled-payment guards.
- Contract, data-access, MSW, and integration tests once CRM swagger is published.

**Non-goals**

- Storing or displaying full PAN, CVV, or magnetic stripe data in FSM.
- Modifying **historical** payment transactions when a card is removed or expired.
- Invoice, Notes, Attachments, Aging, Activity sections (unchanged).
- Company-wide card admin outside a customer context.
- Pagination/search unless API returns large paged lists (defer until backend confirms).

---

## 4. Acceptance criteria (product)

### 4.1 Credit card listing

| ID | Criterion |
|----|-----------|
| AC-L1 | When the user selects the **Credit Cards** tab (section nav), display **all** cards saved for the selected customer. |
| AC-L2 | Columns: **Card Type/Brand**, **Cardholder Name**, **Masked Card Number**, **Expiry Date**, **Default**, **Status**, **Action**. |
| AC-L3 | Card number is **always masked**; show only permitted last digits, e.g. `•••• •••• •••• 1234` (product may also accept `**** **** **** 1234` if design system standardizes asterisks — mask character is display-only). |
| AC-L4 | **Status** shows **Active** or **Inactive** as applicable (derived from API; may combine with expiry — see §4.6). |
| AC-L5 | **Default** column clearly identifies the customer’s default card (e.g. success check icon per Figma). |

### 4.2 Add new card

| ID | Criterion |
|----|-----------|
| AC-A1 | Show **+ New Card** only for users with **add card** permission. |
| AC-A2 | **+ New Card** starts the **Add Card** flow. |
| AC-A3 | User enters/provides payment information required by the **configured payment gateway** (hosted fields, iframe, or redirect — exact UX TBD with gateway SDK). |
| AC-A4 | Card data is processed securely by the **payment provider**; FSM stores **tokens/references only**, not raw card data. |
| AC-A5 | After successful add, the new card appears in the listing (invalidate/refetch list). |
| AC-A6 | On failure, show an **appropriate error message** (gateway/validation/API via `describeCatalogError` or gateway-specific copy). |

### 4.3 Default card

| ID | Criterion |
|----|-----------|
| AC-D1 | Only **one** default card per customer at a time. |
| AC-D2 | Listing clearly shows which card is default. |
| AC-D3 | On **add** or **edit**, user may designate default when **permitted** (UI control disabled when not allowed). |
| AC-D4 | When another card is made default, the **previous** default loses default designation (server-enforced; UI refetches). |
| AC-D5 | When the **first** card is added, backend **may** auto-default per payment business rule; UI reflects API response. |
| AC-D6 | **Inactive** or **expired** cards **cannot** become default (block in UI + reject if API returns 400). |

### 4.4 Edit card

| ID | Criterion |
|----|-----------|
| AC-E1 | **Edit** action where editing is supported for that card/gateway. |
| AC-E2 | Edit allows updating **permitted** fields: **Cardholder Name**; **Expiry** if supported by provider; **Default** setting subject to AC-D6. |
| AC-E3 | User **cannot** edit the stored/masked card number. |
| AC-E4 | Changing card number requires **Add Card** (new payment method), not edit. |

### 4.5 Remove card

| ID | Criterion |
|----|-----------|
| AC-R1 | **Delete/Remove** action for users with **remove card** permission. |
| AC-R2 | **Confirmation** required before remove. |
| AC-R3 | Before remove, system validates association with **scheduled/future payments** (API pre-check or delete 409). |
| AC-R4 | If card is used for scheduled payment, **block** remove or require changing scheduled payment method first (message explains blocker). |
| AC-R5 | If **default** card is removed, apply backend **business rule** (promote another default or no default); UI refetches list. |
| AC-R6 | Remove does **not** alter **historical** transactions for that card. |

### 4.6 Card status & expiry

| ID | Criterion |
|----|-----------|
| AC-S1 | Display current **status** per card (Active/Inactive). |
| AC-S2 | **Expired** cards are **not** available for **new** payments (backend rule; UI may show Inactive or explicit Expired label if API distinguishes). |
| AC-S3 | Expired/inactive cards **cannot** be set as default (AC-D6). |
| AC-S4 | Historical transactions for expired/inactive cards **remain** visible elsewhere (out of scope for this section; no delete of history). |

---

## 5. Design reference

### 5.1 Placement

- Section id: `customer-credit-cards` in `CUSTOMER_DETAIL_SECTIONS`.
- Selecting **Credit Cards** in sticky section nav scrolls to this section (same pattern as Service Locations).

### 5.2 Chrome (`cclisting.png` + Figma `19:12327`)

| Element | Spec |
|--------|------|
| Toolbar | Title **Credit Cards**; **+ New Card** right-aligned (outline primary). Hidden if user lacks add permission. |
| Title → table | ~24px gap. |
| Outer card | White, radius 8px, shadow 1, padding ~16–20px. |
| Inner table | Border `#E5E7EB`, radius 10px; header `#FAFAFF`, labels `#1F54C8`, 13px medium. |

### 5.3 Column mapping (AC-L2)

| Column | Source / notes |
|--------|----------------|
| Card Type/Brand | Logo + label (Visa, MasterCard, …). |
| Cardholder Name | `nameOnCard` — header **Cardholder Name** (not duplicate “Card Type”). |
| Masked Card Number | Format per AC-L3 from `lastFour` only. |
| Expiry Date | `MM/YY`. |
| Default | Check icon when `isDefault`. |
| Status | Active / Inactive (and Expired in copy if API exposes). |
| Action | Edit + Delete icon buttons; respect permissions. |

### 5.4 Empty state

When no cards: message (e.g. “No cards on file”) and **+ New Card** if permitted. Refine when Figma empty frame exists.

---

## 6. Functional requirements (traceability)

| ID | Requirement | AC |
|----|-------------|-----|
| FR-1 | Fetch card list for `customerId` when Credit Cards section is shown or on detail load. | L1 |
| FR-2 | Render columns §5.3; never render full PAN. | L2–L3 |
| FR-3 | Map status to Active/Inactive; optional expired styling/label from API. | L4, S1–S2 |
| FR-4 | Default indicator per §5.3. | L5, D2 |
| FR-5 | Permission-gated **+ New Card** → Add Card flow (gateway). | A1–A4 |
| FR-6 | Post-add list refresh; error toasts on failure. | A5–A6 |
| FR-7 | Edit flow for permitted fields only; no PAN edit. | E1–E4 |
| FR-8 | Default toggle on add/edit with inactive/expired guard. | D1–D6 |
| FR-9 | Permission-gated delete + confirm dialog. | R1–R2 |
| FR-10 | Pre-delete scheduled-payment check; block with actionable message. | R3–R4 |
| FR-11 | Post-delete list refresh; default reassignment from API. | R5 |
| FR-12 | Loading/error states scoped to section. | — |
| FR-13 | Integrate via `CustomerDetailCreditCardsSection` in scroll sections. | — |

---

## 7. API integration (CRM swagger)

**Source:** `https://api-dev.fieldwhizey.com/swagger/crm/v1/swagger.json`  
**Status:** No credit-card resource in published v1 swagger at spec time — use `catalog-endpoint-spec-writer` when tag appears.

### 7.1 Expected operations (names TBD)

| Method | Path (proposed) | Purpose |
|--------|-----------------|---------|
| GET | `/customer/{id}/creditcard` | List cards |
| GET | `/customer/{id}/creditcard/{cardId}` | Edit detail |
| POST | `/customer/{id}/creditcard` | Add — body contains **gateway token** + metadata, not PAN |
| PATCH | `/customer/{id}/creditcard/{cardId}` | Update name, expiry (if allowed), default |
| DELETE | `/customer/{id}/creditcard/{cardId}` | Remove |
| GET | `/customer/{id}/creditcard/{cardId}/removal-validation` or delete **409** body | Scheduled-payment association (AC-R3) |

### 7.2 List row DTO (provisional)

| Field | UI |
|-------|-----|
| `id` | Keys, routes |
| `brand` | Card Type/Brand |
| `nameOnCard` | Cardholder Name |
| `lastFour` | Masked number |
| `expiryMonth`, `expiryYear` | Expiry |
| `isDefault` | Default column |
| `isActive` | Status |
| `isExpired`? | Status copy / default eligibility |

### 7.3 Layers

- **Contract:** `libs/customer/contract/src/lib/credit-card.schema.ts`
- **Data-access:** `libs/customer/data-access/src/lib/credit-card/` — queries, mutations, gateway token submit DTOs
- **MSW:** seed customer 501 (Visa default Active, MasterCard non-default); simulate delete blocked when `scheduledPayment=true` on a seed id
- **Integration tests:** list, add (mock token), delete success, delete blocked

### 7.4 Permissions

Map UI visibility to auth claims or settings roles (exact claim names TBD with platform):

- `customer.creditCard.add` → **+ New Card**
- `customer.creditCard.edit` → Edit
- `customer.creditCard.remove` → Delete

Until claims exist, gate with placeholder `canEditCustomer`-style hook from customer detail context.

---

## 8. UI implementation plan (ordered)

| Step | Task | AC / FR |
|------|------|---------|
| 1 | Confirm swagger + gateway contract with backend | — |
| 2 | Contract DTOs (list, add token body, patch, delete errors) | FR-1 |
| 3 | Data-access queries/mutations + error mapping | FR-1, R3 |
| 4 | MSW list/add/delete + scheduled-payment block fixture | R3–R4 |
| 5 | Integration tests | — |
| 6 | `CustomerDetailCreditCardsSection` — table, mask formatter, default icon, status | L1–L5 |
| 7 | Toolbar **+ New Card** + permission | A1 |
| 8 | **Add Card** flow — gateway integration wrapper (lib or page) | A2–A6 |
| 9 | **Edit Card** dialog/page — name, expiry, default w/ guards | E1–E4, D3–D6 |
| 10 | **Remove** confirm + API block handling | R1–R6 |
| 11 | Wire `CustomerDetailScrollSections`; refetch on section focus optional | L1 |
| 12 | Sync overview **Active Cards** metric with list/summary if API provides | — |

---

## 9. Edge cases & error states

| Scenario | Behavior |
|----------|----------|
| No cards | Empty state; **+ New Card** if permitted. |
| Gateway timeout on add | AC-A6 error; no partial row in list. |
| Set default on expired card | Disable control; show validation message. |
| Delete default with other cards | Backend promotes or clears default (AC-R5). |
| Delete card with scheduled payments | AC-R4 block message with link/instruction to update payment method. |
| User lacks permission | Hide action; no disabled tease unless product prefers disabled + tooltip. |
| 404 customer | Parent detail handles; section unmounted or error inline. |

---

## 10. Success metrics

- Selecting **Credit Cards** shows all seeded cards for demo customer 501 with correct columns and mask.
- Add flow completes with token payload only (verified in network tab / integration test).
- Default switch updates exactly one row; inactive/expired cannot be default.
- Delete blocked when MSW marks scheduled dependency; allowed otherwise without touching history.

---

## 11. Open questions

| # | Item |
|---|------|
| OQ-1 | Final CRM paths and DTO names in swagger. |
| OQ-2 | Payment gateway product (Stripe, etc.) and SDK pattern for Add/Edit expiry updates. |
| OQ-3 | Permission claim names in auth contract. |
| OQ-4 | API shape for scheduled-payment delete validation (dedicated endpoint vs 409 envelope). |
| OQ-5 | Auto-default on first card: always-on vs configurable business rule flag. |
| OQ-6 | Distinct **Expired** status in API vs derived from expiry date client-side. |

---

## 12. Resolved decisions

| # | Decision |
|---|----------|
| RD-1 | Column headers per acceptance criteria: **Card Type/Brand**, **Cardholder Name** (not duplicate “Card Type” from Figma). |
| RD-2 | Masked display uses last digits only; no raw PAN in app or MSW. |
| RD-3 | Card number change = new card via Add flow, not Edit. |
| RD-4 | Remove never deletes historical transactions. |
| RD-5 | Expired/inactive cards ineligible for default and new payments (server authoritative). |
