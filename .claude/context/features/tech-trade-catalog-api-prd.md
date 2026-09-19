# TechTrade catalog API

**Swagger:** `https://api-dev.fieldwhizey.com/swagger/setup/v1/swagger.json` tag `TechTrade`
**Owning MFE:** settings
**Reference module:** Zone (`libs/settings/data-access/src/lib/zone/`)
**Scope:** contract DTOs, data-access factories, MSW handlers, integration tests

## Overview

Adds the FGS Setup Service `/techtrade` catalog to `@cms/settings-contract` and
`@cms/settings-data-access` so Settings can later list, look up, create, update,
and patch technician trades. Same four-layer stack as Zone / Postal Code. No
screen in this pass.

## Source

| Item | Value |
| --- | --- |
| OpenAPI | `https://api-dev.fieldwhizey.com/swagger/setup/v1/swagger.json` |
| Tag | `TechTrade` |
| Collection path | `/techtrade` (after stripping `/api/v{version}`) |
| Operations | list GET, detail GET, lookup GET, POST, PUT, PATCH |

List query params beyond `SetupListParams`: `tradeCode`, `name`.

## Goals

- Wire DTOs live once in `@cms/settings-contract`.
- Data-access exports options factories (not hooks), parsing with those schemas.
- MSW seeds the resource for `VITE_USE_MOCK_API=true`.
- `pnpm run test:query` covers list URL/filters and create + invalidation.

## Non-Goals

- Screen, dialog, form schema, Storybook, Figma.
- New `data-access` Zod DTO that duplicates the contract.
- Catalog types in `libs/shared/` or `platform-contract`.
- DELETE (not in swagger).

## Wire contract

Copied from swagger `TechTrade*` DTOs. Nullable strings use `nullableText`.
`sortOrder` is `z.number().nullish()`.

### Summary (`TechTradeSummaryDto`)

| Field | Type | Nullability |
| --- | --- | --- |
| id | number | required |
| tradeCode | string | nullable |
| name | string | nullable |
| sortOrder | number | nullable |
| isActive | boolean | required |

Summary does **not** include `description`.

### Detail (`TechTradeDetailDto`)

Summary fields plus:

| Field | Type | Nullability |
| --- | --- | --- |
| description | string | nullable |

### Lookup (`TechTradeLookupDto`)

| Field | Type | Nullability |
| --- | --- | --- |
| id | number | required |
| tradeCode | string | nullable |
| name | string | nullable |
| sortOrder | number | nullable |

Omits `isActive` and `description`.

### Create / Update

| Field | Type | Nullability |
| --- | --- | --- |
| tradeCode | string | nullable |
| name | string | nullable |
| description | string | nullable |
| sortOrder | number | nullable |

### Patch

Create fields plus `isActive` (`boolean`, nullable).

### List params

`SetupListParams` (`page`, `pageSize`, `sortBy`, `sortDirection`, `search`,
`isActive`) plus `tradeCode?`, `name?`.

## Functional requirements

- **REQ-1** Contract file `libs/settings/contract/src/lib/tech-trade.schema.ts` exports summary/detail/lookup/create/update/patch schemas, response envelopes via `setupResponseSchema` / `pagedResultSchema`, inferred types, and `TechTradeListParams`.
- **REQ-2** Contract barrel `src/index.ts` re-exports that file.
- **REQ-3** Data-access module `libs/settings/data-access/src/lib/tech-trade/` with `*.endpoints.ts`, `*.keys.ts`, `*.queries.ts`, `*.mutations.ts`, `index.ts` matching Zone (no `*.form.ts`).
- **REQ-4** Collection endpoint is `/techtrade`. Lookup is registered conceptually before `:id` (MSW handler order).
- **REQ-5** Queries: `loadTechTrades` + `techTradeListQueryOptions` / `Detail` / `Lookup`. List maps through `toPagedResult` so `items: null` becomes `[]`.
- **REQ-6** Mutations: create POST, update PUT, patch PATCH; each invalidates `techTradeKeys.all`.
- **REQ-7** Data-access lib barrel exports the module. Module `index.ts` re-exports factories and the contract types (same as Zone).
- **REQ-8** MSW `libs/shared/mocks/src/handlers/tech-trade.ts` appended in `handlers/index.ts`. Writes parse with contract create/update/patch schemas. Session-persisted seed.
- **REQ-9** Fixtures in `tools/integration/src/fixtures/setup-catalog-response.ts` and a `describe('tech trade through customFetch')` covering list querystring + create invalidation.

## File map

| Layer | Path |
| --- | --- |
| Contract | `libs/settings/contract/src/lib/tech-trade.schema.ts` |
| Data-access | `libs/settings/data-access/src/lib/tech-trade/` |
| MSW | `libs/shared/mocks/src/handlers/tech-trade.ts` |
| Tests | `tools/integration/src/setup-catalog.integration.test.ts` |

Folder names are kebab-case (`tech-trade`). Endpoint paths stay swagger-literal (`/techtrade`).

## Verification

- `pnpm exec nx lint settings-contract settings-data-access shared-mocks`
- `tsc --noEmit` on those projects if Nx reports `No tasks were run`
- `pnpm run test:query`

## Open questions / assumptions

- Assumed operations = exactly the verbs present in swagger (no DELETE).
- Assumed no form schema until a screen exists.
- Detail is not identical to summary (`description` is detail-only).
