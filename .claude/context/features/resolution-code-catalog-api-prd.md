# ResolutionCode catalog API

**Swagger:** `https://100.31.187.221/swagger/setup/v1/swagger.json` tag `ResolutionCode`
**Owning MFE:** settings
**Reference module:** Billing Category (lookup filters) / Business Type (flat DTO)
**Scope:** contract DTOs, data-access factories, MSW handlers, integration tests

## Overview

Adds the FGS Setup Service `/resolutioncode` catalog to `@cms/settings-contract`
and `@cms/settings-data-access` so Settings can later list, look up, create,
update, and patch resolution codes. Same four-layer stack as Billing Category.
No screen in this pass.

## Source

| Item | Value |
| --- | --- |
| OpenAPI | `https://100.31.187.221/swagger/setup/v1/swagger.json` |
| Tag | `ResolutionCode` |
| Collection path | `/resolutioncode` (after stripping `/api/v{version}`) |
| Operations | list GET, detail GET, lookup GET, POST, PUT, PATCH |

List query params beyond `SetupListParams`: `resolutionCode`, `resolutionName`.

Lookup query params beyond `activeOnly`: `isMobileVisible`.

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

Copied from swagger `ResolutionCode*` DTOs. Nullable strings use `nullableText`.

### Summary / Detail

| Field | Type | Nullability |
| --- | --- | --- |
| id | number | required |
| gloResolutionTypeId | number | required |
| resolutionCode | string | nullable |
| resolutionName | string | nullable |
| isMobileVisible | boolean | required |
| isActive | boolean | required |

Summary and detail share the same fields.

### Lookup

| Field | Type | Nullability |
| --- | --- | --- |
| id | number | required |
| resolutionCode | string | nullable |
| resolutionName | string | nullable |

### Create / Update

| Field | Type | Nullability |
| --- | --- | --- |
| gloResolutionTypeId | number | required |
| resolutionCode | string | nullable |
| resolutionName | string | nullable |
| isMobileVisible | boolean | required |

### Patch

Create fields, each nullable, plus `isActive` (`boolean`, nullable).

### List params

`SetupListParams` plus `resolutionCode?`, `resolutionName?`.

### Lookup params

`activeOnly?` (default `true`), `isMobileVisible?`.

## Functional requirements

- **REQ-1** Contract file `libs/settings/contract/src/lib/resolution-code.schema.ts` exports summary/detail/lookup/create/update/patch schemas, response envelopes via `setupResponseSchema` / `pagedResultSchema`, inferred types, `ResolutionCodeListParams`, and `ResolutionCodeLookupParams`.
- **REQ-2** Contract barrel `src/index.ts` re-exports that file.
- **REQ-3** Data-access module `libs/settings/data-access/src/lib/resolution-code/` with `*.endpoints.ts`, `*.keys.ts`, `*.queries.ts`, `*.mutations.ts`, `index.ts` matching Billing Category (no `*.form.ts`).
- **REQ-4** Collection endpoint is `/resolutioncode`. Lookup is registered before `:id` (MSW handler order).
- **REQ-5** Queries: `loadResolutionCodes` + `resolutionCodeListQueryOptions` / `Detail` / `Lookup`. List maps through `toPagedResult` so `items: null` becomes `[]`.
- **REQ-6** Mutations: create POST, update PUT, patch PATCH; each invalidates `resolutionCodeKeys.all`.
- **REQ-7** Data-access lib barrel exports the module. Module `index.ts` re-exports factories and the contract types.
- **REQ-8** MSW `libs/shared/mocks/src/handlers/resolution-code.ts` appended in `handlers/index.ts`. Writes parse with contract create/update/patch schemas. Session-persisted seed.
- **REQ-9** Fixtures in `tools/integration/src/fixtures/setup-catalog-response.ts` and a `describe('resolution code through customFetch')` covering list querystring + create invalidation.

## File map

| Layer | Path |
| --- | --- |
| Contract | `libs/settings/contract/src/lib/resolution-code.schema.ts` |
| Data-access | `libs/settings/data-access/src/lib/resolution-code/` |
| MSW | `libs/shared/mocks/src/handlers/resolution-code.ts` |
| Tests | `tools/integration/src/setup-catalog.integration.test.ts` |

Folder name is `resolution-code`. Endpoint path stays swagger-literal (`/resolutioncode`).

## Verification

- `pnpm exec nx lint settings-contract settings-data-access shared-mocks`
- `tsc --noEmit` on those projects if Nx reports `No tasks were run`
- `pnpm run test:query`

## Open questions / assumptions

- Assumed operations = exactly the verbs present in swagger (no DELETE).
- Assumed no form schema until a screen exists.
- `gloResolutionTypeId` is kept as the swagger field name.
