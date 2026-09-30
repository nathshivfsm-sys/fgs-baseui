# JobCategory catalog API

**Swagger:** [setup/v1/swagger.json](https://api-dev.fieldwhizey.com/swagger/setup/v1/swagger.json) tag `JobCategory`
**Owning MFE:** settings
**Reference module:** BusinessType (`libs/settings/data-access/src/lib/business-type/`)
**Scope:** contract DTOs, data-access factories, MSW handlers, integration tests

## Overview

Adds the FGS Setup Service `/jobcategory` catalog to `@cms/settings-contract` and `@cms/settings-data-access` so Settings can later list, look up, create, update, and patch job categories. Same four-layer stack as BusinessType. No screen in this pass.

## Source

| Item | Value |
| --- | --- |
| OpenAPI | `https://api-dev.fieldwhizey.com/swagger/setup/v1/swagger.json` |
| Tag | `JobCategory` |
| Collection path | `/jobcategory` (after stripping `/api/v{version}`) |
| Operations | list GET, detail GET, lookup GET, POST, PUT, PATCH |

List query params beyond `SetupListParams`: `categoryCode`, `name`. Lookup query: `activeOnly` (default true).

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

Copied from swagger `Fgs.Setup.Application.Features.JobCategories.Dtos.JobCategory*`. Nullable strings use `nullableText`. `displayOrder` is `z.number().nullish()`.

### Summary / Detail (`JobCategorySummaryDto` / `JobCategoryDetailDto`)

| Field | Type | Nullability |
| --- | --- | --- |
| id | number (int64) | required |
| categoryCode | string | nullable |
| name | string | nullable |
| backgroundColor | string | nullable |
| textColor | string | nullable |
| displayOrder | number (int32) | nullable |
| isActive | boolean | required |

Detail equals Summary.

### Lookup (`JobCategoryLookupDto`)

| Field | Type | Nullability |
| --- | --- | --- |
| id | number (int64) | required |
| categoryCode | string | nullable |
| name | string | nullable |
| displayOrder | number (int32) | nullable |

Omits colors and `isActive`.

### Create

| Field | Type | Nullability |
| --- | --- | --- |
| categoryCode | string | nullable |
| name | string | nullable |
| displayOrder | number (int32) | nullable |
| backgroundColor | string | nullable |
| textColor | string | nullable |
| isActive | boolean | required |

### Update

Create fields except `isActive`.

### Patch

| Field | Type | Nullability |
| --- | --- | --- |
| categoryCode | string | nullable |
| name | string | nullable |
| displayOrder | number (int32) | nullable |
| isActive | boolean | nullable |
| backgroundColor | string | nullable |
| textColor | string | nullable |

### List params

`SetupListParams` plus `categoryCode?`, `name?`.

## Functional requirements

- **REQ-1** Contract file `libs/settings/contract/src/lib/job-category.schema.ts` exports summary/detail/lookup/create/update/patch schemas, response envelopes via `setupResponseSchema` / `pagedResultSchema`, inferred types, and `JobCategoryListParams`.
- **REQ-2** Contract barrel `src/index.ts` re-exports that file.
- **REQ-3** Data-access module `libs/settings/data-access/src/lib/job-category/` with `*.endpoints.ts`, `*.keys.ts`, `*.queries.ts`, `*.mutations.ts`, `index.ts` matching BusinessType (no `*.form.ts`, no DELETE).
- **REQ-4** Collection endpoint is `/jobcategory`. Lookup is registered conceptually before `:id` (MSW handler order).
- **REQ-5** Queries: `loadJobCategories` + `jobCategoryListQueryOptions` / `Detail` / `Lookup`. List maps through `toPagedResult` so `items: null` becomes `[]`.
- **REQ-6** Mutations: create POST, update PUT, patch PATCH; each invalidates `jobCategoryKeys.all`.
- **REQ-7** Data-access lib barrel exports the module. Module `index.ts` re-exports factories and the contract types (same as BusinessType).
- **REQ-8** MSW `libs/shared/mocks/src/handlers/job-category.ts` appended in `handlers/index.ts`. Writes parse with contract create/update/patch schemas. Session-persisted seed.
- **REQ-9** Fixtures in `tools/integration/src/fixtures/setup-catalog-response.ts` and a `describe('job category through customFetch')` covering list querystring + create invalidation.

## File map

| Layer | Path |
| --- | --- |
| Contract | `libs/settings/contract/src/lib/job-category.schema.ts` |
| Data-access | `libs/settings/data-access/src/lib/job-category/` |
| MSW | `libs/shared/mocks/src/handlers/job-category.ts` |
| Tests | `tools/integration/src/setup-catalog.integration.test.ts` |

Folder name is kebab-case (`job-category`). Endpoint path stays swagger-literal (`/jobcategory`).

## Verification

- `pnpm exec nx lint settings-contract settings-data-access shared-mocks`
- `tsc --noEmit` on those projects if Nx reports `No tasks were run`
- `pnpm run test:query`

## Open questions / assumptions

- Assumed operations = exactly the verbs present on tag `JobCategory`.
- Assumed no form schema until a screen exists.
- Tenant and company headers (`X-Tenant-Id`, `X-Company-Id`) stay on the shared fetch client, not on these factories.
