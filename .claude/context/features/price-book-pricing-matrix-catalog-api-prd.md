# Price book and pricing matrix catalog APIs

**Swagger:** `https://100.31.187.221/swagger/setup/v1/swagger.json`
**Owning MFE:** settings
**Reference module:** Billing Category (`libs/settings/data-access/src/lib/billing-category/`)
**Scope:** contract DTOs, data-access factories, MSW handlers, integration tests

## Overview

Adds seven FGS Setup Service catalogs so Settings can later list, look up,
create, update, and patch price books and pricing matrices. Price book items
also delete. No screen in this pass.

## Source

| Resource | Tag | Collection path | Operations | Extra list filters | Lookup filters |
| --- | --- | --- | --- | --- | --- |
| Price book | `PriceBook` | `/pricebook` | list, detail, lookup, POST, PUT, PATCH | `jobTypeId`, `pricingModel`, `priceBookCode`, `priceBookName` | `activeOnly` |
| Price book item | `PriceBookItem` | `/pricebookitem` | list, detail, lookup, POST, PUT, PATCH, DELETE | `priceBookId`, `itemCode`, `itemDescription` | `priceBookId` (no `activeOnly`) |
| Pricing matrix | `PricingMatrix` | `/pricingmatrix` | list, detail, lookup, POST, PUT, PATCH | `code`, `isDefault` | `activeOnly` |
| Pricing matrix labor | `PricingMatrixLabor` | `/pricingmatrixlabor` | list, detail, lookup, POST, PUT, PATCH | `pricingMatrixId` | `activeOnly`, `pricingMatrixId` |
| Pricing matrix labor tier | `PricingMatrixLaborTier` | `/pricingmatrixlabortier` | list, detail, lookup, POST, PUT, PATCH | `pricingMatrixLaborId` | `activeOnly`, `pricingMatrixLaborId` |
| Pricing matrix material tier | `PricingMatrixMaterialTier` | `/pricingmatrixmaterialtier` | list, detail, lookup, POST, PUT, PATCH | `pricingMatrixId` | `activeOnly`, `pricingMatrixId` |
| Pricing matrix other | `PricingMatrixOther` | `/pricingmatrixother` | list, detail, lookup, POST, PUT, PATCH | `pricingMatrixId`, `categoryCode` | `activeOnly`, `pricingMatrixId` |

Paths are after stripping `/api/v{version}`. Shared list params stay
`SetupListParams`. Price book item has no `isActive` field. DELETE returns the
detail envelope. POST on the documented resources returns 201.

## Goals

- Wire DTOs live once in `@cms/settings-contract`.
- Data-access exports options factories (not hooks), parsing with those schemas.
- MSW seeds each resource for `VITE_USE_MOCK_API=true`.
- `pnpm run test:query` covers each list querystring and create invalidation.
  Price book item also covers DELETE invalidation.

## Non-Goals

- Screen, dialog, form schema, Storybook, Figma.
- A second DTO in data-access.
- DELETE on resources that do not declare it.

## Wire contract

Nullable strings use `nullableText`. Nullable numbers and patch scalars use
`.nullish()`. Dates stay `z.string()`.

### Price book

Summary: `id`, `priceBookCode`, `priceBookName`, `jobTypeId`, `pricingModel`,
`estimatedDurationMinutes`, `basePrice` (nullable), `isTaxable`, `isActive`.

Detail adds `description`. Lookup is `id`, `priceBookCode`, `priceBookName`,
`pricingModel`. Create and update match detail without `id` and `isActive`.
Patch makes `jobTypeId`, `estimatedDurationMinutes`, `isTaxable`, and
`isActive` optional.

### Price book item

Summary: `id`, `priceBookId`, `inventoryItemId` (nullable), `itemCode`,
`itemDescription`, `quantity`, `displayOrder`. Detail adds `notes`. Lookup
omits `inventoryItemId`, `quantity`, and `notes`. Create leaves `displayOrder`
optional. Update requires `displayOrder`. Patch makes every field optional.
No `isActive`.

### Pricing matrix

Summary and detail are the same: `id`, `code`, `name`, `isDefault`,
`isLaborTierStructure`, `isLaborRateBySkillLevel`, `priceAdjustmentTypeId`,
`effectiveFrom`, `effectiveTo` (nullable), `isMobileVisible`, `isActive`.

`description` is write-only. `code` is read-only. Create and update send
`name`, `description`, the three booleans, optional `priceAdjustmentTypeId`,
optional dates, and optional `isMobileVisible`. Patch adds optional `isActive`
and makes the booleans optional. Lookup is `id`, `code`, `name`, `isDefault`.

### Child resources without a swagger response schema

`PricingMatrixLabor`, `PricingMatrixLaborTier`, `PricingMatrixMaterialTier`,
and `PricingMatrixOther` document create, update, and patch only. Each read
DTO is the create fields plus required `id` and `isActive`. Detail equals
summary. Lookup keeps `id`, the parent id, and the short identifying fields,
and omits `isActive`.

Labor create: `pricingMatrixId`, `laborRateTypeId`, optional
`techSkillLevelId`, `baseRate`, optional `overtimeMultiplier`,
`doubleTimeMultiplier`, `discountPercent`.

Labor tier create: `pricingMatrixLaborId`, `sequenceOrder`, `durationMinutes`,
`rate`, optional `techSkillLevelId`.

Material tier create: `pricingMatrixId`, `fromCost`, optional `toCost`,
`adjustmentValue`.

Other create: `pricingMatrixId`, optional `categoryCode`, `name`,
`adjustmentValue`, `discountPercent`.

Patch on each child makes every create field optional and adds optional
`isActive`.

## Functional requirements

- **REQ-1** One contract file per resource under `libs/settings/contract/src/lib/`.
- **REQ-2** Contract barrel re-exports each file.
- **REQ-3** Data-access module per resource: endpoints, keys, queries, mutations, index. No form schema.
- **REQ-4** Endpoint strings match the table above. MSW registers lookup before `/:id`.
- **REQ-5** List queries map through `toPagedResult`.
- **REQ-6** Create, update, and patch invalidate that resource's `keys.all`. Price book item delete does the same.
- **REQ-7** Data-access barrel exports each module and re-exports the contract types.
- **REQ-8** One MSW handler file per resource, registered in `handlers/index.ts`.
- **REQ-9** Fixtures and a `describe` per resource in `tools/integration`.

## Verification

- `pnpm exec nx run-many -t lint typecheck -p settings-contract settings-data-access shared-mocks integration`
- `pnpm run test:query`

## Open questions / assumptions

- Child read DTOs are inferred. If the live API omits a field treated as required, parsing will fail until the schema is relaxed.
- Pricing matrix `code` is generated in MSW (`MX-{id}`) because create does not send it.
- Pricing matrix `description` is accepted on write and dropped from the stored read model.
- Duplicate `priceBookCode`, price-book-item `itemCode` within a book, and pricing matrix `name` return 409, matching the documented conflict responses.
