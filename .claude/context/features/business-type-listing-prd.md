# Business Type listing

**Design:** [Figma node 2191:7830](https://www.figma.com/design/fKuNuVXQThJ9uPGq8FECm3/Login--Copy-?node-id=2191-7830&m=dev)
**Owning MFE:** settings
**API:** `GET /businesstype?page=1&pageSize=1000`, enable via `PATCH /businesstype/{id}` `{ isActive: true }`

## Overview

Company admins open Setup → Company → Business Type and see every business type the Setup service returns. Types already enabled for the company show the switch on. Turning a switch on saves that choice and confirms with “Business Type enabled successfully.” An enabled type cannot be turned off.

## Goals

- Match the Figma row (icon well, name, switch, Active label) using existing Settings chrome.
- Use `SetupBreadcrumb` and the same header / description / content spacing as Tax and Business Unit.
- Load the full catalog in one request (`page=1`, `pageSize=1000`). No pager.

## Non-Goals

- Creating, editing, or deleting business types.
- Disabling a type that is already on.
- Tenant-company internal `POST /tenant/{tenantId}/companies/{companyId}/businesstype`.

## Functional requirements

- **REQ-1** Route `company/business-type`. The Company grid card navigates there.
- **REQ-2** Header uses `SetupBreadcrumb` (Setup / Company / Business Type), title “Business Type”, description “Manage the business types supported by your company.”, with the same header and following gap as other Setup pages.
- **REQ-3** List calls `businessTypeListQueryOptions({ page: 1, pageSize: 1000 })`.
- **REQ-4** Each row shows the type name, a mark for the known Figma types, and a switch. `isActive` is on and labeled Active.
- **REQ-5** Turning an off switch on PATCHes `{ isActive: true }` and shows `alert.success('Business Type enabled successfully.')`.
- **REQ-6** An on switch cannot be turned off.

## Assumptions

- `isActive` on the company-scoped `/businesstype` list is “enabled for this company.”
- Known names (HVAC, Plumbing, Pest Control, Electrical, Home Cleaning, Junk Removal, Garden Management) use the Figma marks. Other names use the setup business-type icon.
- Off rows are labeled Inactive.
