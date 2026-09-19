# GLBreak catalog API

**Swagger:** [setup/v1/swagger.json](https://api-dev.fieldwhizey.com/swagger/setup/v1/swagger.json) tag `GLBreak`
**Owning MFE:** settings
**Reference module:** Tax (nested address + trades on detail; Zone file split)
**Scope:** contract DTOs, data-access factories, MSW handlers, integration tests

## Overview

Adds the Setup Service `/glbreak` catalog (GL / geographic break locations with trade codes) as a four-layer Settings module. Detail is richer than the list row: nested address and trades. Create/update/patch send `LocationWriteDto` plus `tradeCodes: string[]`. No screen in this pass.

## Source

| Item | Value |
| --- | --- |
| OpenAPI | `https://api-dev.fieldwhizey.com/swagger/setup/v1/swagger.json` |
| Tag | `GLBreak` |
| Collection path | `/glbreak` (after stripping `/api/v{version}`) |
| Operations | list GET, detail GET, lookup GET, POST, PUT, PATCH |

Extra list query params: `code`, `name`, `breakLevel` (int32), `tradeCode`. Lookup query: `activeOnly` (default true).

## Goals

- Wire DTOs live once in `@cms/settings-contract`.
- Data-access exports options factories (not hooks), parsing with those schemas.
- MSW seeds the resource for `VITE_USE_MOCK_API=true`. Writes map `tradeCodes` / write-address onto detail `trades` / address.
- `pnpm run test:query` covers list URL/filters (including `breakLevel`) and POST + invalidation.

## Non-Goals

- Screen, dialog, form schema, Storybook, Figma.
- New `data-access` Zod DTO that duplicates the contract.
- Catalog types in `libs/shared/` or `platform-contract`.
- DELETE (not in swagger).
- Reusing `companyAddressDtoSchema` (that schema strips coordinates / `id` / `placeId`).

## Wire contract

Copied from swagger `Fgs.Setup.Application.Features.GLBreaks.Dtos.*` and `LocationWriteDto`.

### Address detail (`GLBreakAddressDetailDto`)

| Field | Type | Nullability |
| --- | --- | --- |
| id | string (uuid) | required |
| addressLine1–4, city, state, country, postalCode, formattedAddress | string | nullable |
| latitude, longitude | number | nullable |

### Location write (`LocationWriteDto`, create/update/patch `address`)

Same lines as address detail except: no `id`; adds `county`, `placeId` (nullable strings).

### Trade (`GLBreakTradeDto`)

`id` (number), `tradeCode` (nullable string).

### Summary (`GLBreakSummaryDto`)

`id`, `code`, `name`, `breakLabel` (nullable strings), `breakLevel` (required int32), `logoFileId` (nullable int64), `isActive`. No address or trades.

### Detail (`GLBreakDetailDto`)

Summary plus `address` (address detail, optional) and `trades` (array, nullable).

### Lookup (`GLBreakLookupDto`)

`id`, `code`, `name`, `breakLevel`. Omits `isActive`.

### Create / Update

`code`, `name`, `breakLabel` (nullable strings), `breakLevel` (required number), `logoFileId` (nullable number), `address` (location write, optional), `tradeCodes` (string array, nullable).

### Patch

Create fields with `breakLevel` and `isActive` nullable.

### List params

`SetupListParams` + `code?: string` + `name?: string` + `breakLevel?: number` + `tradeCode?: string`.

## Functional requirements

- **REQ-1** Contract file `libs/settings/contract/src/lib/gl-break.schema.ts` exports nested address/trade schemas, summary/detail/lookup/create/update/patch, envelopes, inferred types, and `GlBreakListParams`.
- **REQ-2** Contract barrel `src/index.ts` re-exports that file.
- **REQ-3** Data-access module `libs/settings/data-access/src/lib/gl-break/` matching Tax/Zone file split (no form schema).
- **REQ-4** Collection endpoint string is `/glbreak`. Lookup is registered conceptually before `:id`.
- **REQ-5** Queries: `loadGlBreaks` + `glBreakListQueryOptions` / `Detail` / `Lookup`. List maps through `toPagedResult`.
- **REQ-6** Mutations: create POST, update PUT, patch PATCH; each invalidates `glBreakKeys.all`.
- **REQ-7** Data-access lib barrel exports the module. Module `index.ts` re-exports factories and the contract types.
- **REQ-8** MSW `libs/shared/mocks/src/handlers/gl-break.ts`. Writes parse with contract schemas; map `tradeCodes` → `trades` and write-address → address detail. Seed 3–6 records including one inactive.
- **REQ-9** Fixtures and a `describe` covering list querystring (`code` / `breakLevel`) + create invalidation.

## File map

| Layer | Path |
| --- | --- |
| Contract | `libs/settings/contract/src/lib/gl-break.schema.ts` |
| Data-access | `libs/settings/data-access/src/lib/gl-break/` |
| MSW | `libs/shared/mocks/src/handlers/gl-break.ts` |
| Tests | `tools/integration/src/setup-catalog.integration.test.ts` |

## Verification

- `pnpm exec nx lint settings-contract settings-data-access shared-mocks`
- `tsc --noEmit` on those projects if Nx reports `No tasks were run`
- `pnpm run test:query`

## Open questions / assumptions

- Assumed operations = exactly the verbs present in swagger.
- Assumed no form schema until a screen exists.
- `breakLevel` is required on create/update (swagger does not mark it nullable).
- Location write DTO lives in the GLBreak contract file; it is not promoted to a shared location schema until a second resource needs it.
