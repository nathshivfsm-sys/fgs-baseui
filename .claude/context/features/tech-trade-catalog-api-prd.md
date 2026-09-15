# TechTrade catalog API

**Swagger:** [setup/v1/swagger.json](https://api-dev.fieldwhizey.com/swagger/setup/v1/swagger.json) tag `TechTrade`
**Owning MFE:** settings
**Reference module:** Zone
**Scope:** contract DTOs, data-access factories, MSW handlers, integration tests

## Overview

Adds the Setup Service `/techtrade` catalog (technician trade codes) as a four-layer Settings module: Zod wire DTOs, TanStack Query options factories, an in-memory MSW catalog, and `test:query` coverage. Settings can later list, look up, create, update, and patch trades. No screen in this pass.

## Source

| Item | Value |
| --- | --- |
| OpenAPI | `https://api-dev.fieldwhizey.com/swagger/setup/v1/swagger.json` |
| Tag | `TechTrade` |
| Collection path | `/techtrade` (after stripping `/api/v{version}`) |
| Operations | list GET, detail GET, lookup GET, POST, PUT, PATCH |

Extra list query params: `tradeCode`, `name` (plus shared `SetupListParams`). Lookup query: `activeOnly` (default true).

## Goals

- Wire DTOs live once in `@cms/settings-contract`.
- Data-access exports options factories (not hooks), parsing with those schemas.
- MSW seeds the resource for `VITE_USE_MOCK_API=true`.
- `pnpm run test:query` covers list URL/filters and POST + invalidation.

## Non-Goals

- Screen, dialog, form schema, Storybook, Figma.
- New `data-access` Zod DTO that duplicates the contract.
- Catalog types in `libs/shared/` or `platform-contract`.
- DELETE (not in swagger).

## Wire contract

Copied from swagger `Fgs.Setup.Application.Features.TechTrades.Dtos.*`. Dates N/A. Display strings use `nullableText`. `sortOrder` is a nullable int32 on every DTO that includes it.

### Summary (`TechTradeSummaryDto`)

| Field | Type | Nullability |
| --- | --- | --- |
| id | number (int64) | required |
| tradeCode | string | nullable |
| name | string | nullable |
| sortOrder | number (int32) | nullable |
| isActive | boolean | required |

### Detail (`TechTradeDetailDto`)

Summary plus `description` (string, nullable).

### Lookup (`TechTradeLookupDto`)

`id`, `tradeCode`, `name`, `sortOrder`. Omits `isActive` and `description`.

### Create / Update (`TechTradeCreateDto` / `TechTradeUpdateDto`)

`tradeCode`, `name`, `description` (nullable strings), `sortOrder` (nullable number).

### Patch (`TechTradePatchDto`)

Create fields plus `isActive` (boolean, nullable).

### List params

`SetupListParams` + `tradeCode?: string` + `name?: string`.

## Functional requirements

- **REQ-1** Contract file `libs/settings/contract/src/lib/tech-trade.schema.ts` exports summary/detail/lookup/create/update/patch schemas, response envelopes via `setupResponseSchema` / `pagedResultSchema`, inferred types, and `TechTradeListParams`.
- **REQ-2** Contract barrel `src/index.ts` re-exports that file.
- **REQ-3** Data-access module `libs/settings/data-access/src/lib/tech-trade/` with `*.endpoints.ts`, `*.keys.ts`, `*.queries.ts`, `*.mutations.ts`, `index.ts` matching Zone.
- **REQ-4** Collection endpoint string is `/techtrade`. Lookup is registered conceptually before `:id` (MSW handler order).
- **REQ-5** Queries: `loadTechTrades` + `techTradeListQueryOptions` / `Detail` / `Lookup`. List maps through `toPagedResult` so `items: null` becomes `[]`.
- **REQ-6** Mutations: create POST, update PUT, patch PATCH; each invalidates `techTradeKeys.all`.
- **REQ-7** Data-access lib barrel exports the module. Module `index.ts` re-exports factories and the contract types.
- **REQ-8** MSW `libs/shared/mocks/src/handlers/tech-trade.ts` appended in `handlers/index.ts`. Writes parse with contract create/update/patch schemas. Session-persisted seed with at least one `isActive: false`.
- **REQ-9** Fixtures in `tools/integration/src/fixtures/setup-catalog-response.ts` and a `describe` in `setup-catalog.integration.test.ts` covering list querystring + create invalidation.

## File map

| Layer | Path |
| --- | --- |
| Contract | `libs/settings/contract/src/lib/tech-trade.schema.ts` |
| Data-access | `libs/settings/data-access/src/lib/tech-trade/` |
| MSW | `libs/shared/mocks/src/handlers/tech-trade.ts` |
| Tests | `tools/integration/src/setup-catalog.integration.test.ts` |

## Verification

- `pnpm exec nx lint settings-contract settings-data-access shared-mocks`
- `tsc --noEmit` on those projects if Nx reports `No tasks were run`
- `pnpm run test:query`

## Open questions / assumptions

- Assumed operations = exactly the verbs present in swagger (no DELETE).
- Assumed no form schema until a screen exists.
- Detail includes `description`; list summary does not — same split as swagger.
