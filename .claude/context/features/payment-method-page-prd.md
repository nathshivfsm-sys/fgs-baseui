# Payment Methods page

**Stories:** [FGS-164](https://fieldgoodservice.atlassian.net/browse/FGS-164), [FGS-165](https://fieldgoodservice.atlassian.net/browse/FGS-165), [FGS-166](https://fieldgoodservice.atlassian.net/browse/FGS-166)
**Figma:** Settings file `fKuNuVXQThJ9uPGq8FECm3` nodes `2528:7900` (list), `2528:8999` (create), `2528:9613` (edit), `2528:10227` (delete confirm)
**Owning MFE:** settings
**Reference page:** Source (`apps/settings/src/pages/SourcePage`)
**API:** existing `/paymentmethod` contract in `@cms/settings-contract`

## Overview

Settings › Billing & Finance › Payment Methods lists, creates, edits, and deactivates payment methods. Layout follows the existing catalog pages (breadcrumb, title, add button, active/inactive tabs with counts, search, data table, form dialog, confirm dialog). Visual styling uses `@cms/ui` components and theme tokens.

## Goals

- Open the page from the Billing & Finance setup card.
- List active methods by default, with an inactive tab and counts.
- Search by name, case-insensitive, partial match.
- Create with a required name and an Available to Field Tech toggle. New records are active.
- Edit name and field-tech availability. Name uniqueness excludes the current record.
- Deactivate from the row action, which moves the record to the inactive tab. Reactivate from the edit dialog.
- Success and error toasts. A failed save leaves the dialog open.

## Non-Goals

- Pixel-matching the Figma frames.
- Payment Method Type and Accounting Package Name. Those columns and fields are in the stories and Figma, and they are not on the Setup swagger `FgsSetupPaymentMethod*` DTOs. Backend story FGS-167 is still To Do. They are not invented on the wire.
- Hard delete. Swagger has no DELETE. Deactivate uses `PATCH { isActive: false }`, same as Source.
- Customer portal visibility stays on the wire (`isCustomerPortalVisible`) but is not a form field. Create defaults it to `true`. Edit keeps the stored value.
- Sort order is not a form field. Create assigns the next order. Edit keeps the stored value.

## Functional requirements

- **REQ-1** Route `billing/payment-methods` renders `PaymentMethodPage`. The Billing & Finance card links there.
- **REQ-2** The list loads `GET /paymentmethod` for the selected active flag and shows Name and Available to Field Tech (`isMobileVisible`, check or cross).
- **REQ-3** Active and Inactive tabs show `totalCount` for each status. Active is the default.
- **REQ-4** Search filters the loaded rows. An empty match shows "No payment methods found."
- **REQ-5** Add opens a dialog with Name (required, trimmed) and Available to Field Tech (default on). Submit stays disabled until Name is non-empty. POST creates the method, then the dialog closes and a success toast is shown.
- **REQ-6** A duplicate name (case-insensitive) returns 409 and the toast "Payment method name already exists." The dialog stays open.
- **REQ-7** Edit opens the same dialog with the current name and field-tech flag, plus an Active toggle. PUT updates the method. A separate PATCH updates `isActive` when that flag changed.
- **REQ-8** The row delete action deactivates an active method after confirmation. Inactive rows can be edited, not deactivated again.
- **REQ-9** Form schema and mappers live in `@cms/settings-data-access`. Page props live under `pages/PaymentMethodPage/types`.

## Edge cases

- Load failure shows the catalog error in the table.
- Save failure shows an error toast and keeps the entered values.
- Closing a dirty dialog asks to discard.
- Existing transactions are not rewritten; deactivate only changes `isActive`.
