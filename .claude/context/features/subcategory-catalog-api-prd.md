# Subcategory catalog API

**Swagger:** [setup/v1/swagger.json](https://api-dev.fieldwhizey.com/swagger/setup/v1/swagger.json) tag `JobTypeTask`
**Owning MFE:** settings
**Reference module:** BusinessType (`libs/settings/data-access/src/lib/business-type/`)
**Scope:** contract DTOs, data-access factories, MSW handlers, integration tests

## Overview

Adds the FGS Setup Service `/jobtypetask` catalog to `@cms/settings-contract` and `@cms/settings-data-access`. The frontend name for this resource is **subcategory** (folder, types, query keys, and factories). The HTTP path and JSON property names stay as swagger declares them (`/jobtypetask`, `jobCategoryId`, `taskName`, and so on) so request bodies match the API. No screen in this pass.

## Source

| Item | Value |
| --- | --- |
| OpenAPI | `https://api-dev.fieldwhizey.com/swagger/setup/v1/swagger.json` |
| Tag | `JobTypeTask` |
| Collection path | `/jobtypetask` (after stripping `/api/v{version}`) |
| Operations | list GET, detail GET, lookup GET, POST, PUT, PATCH |

List query params beyond `SetupListParams`: `taskName`, `name`, `jobCategoryId`, `jobTypeId`. Lookup query: `activeOnly` (default true).

## Goals

- Wire DTOs live once in `@cms/settings-contract`, exported as `Subcategory*`.
- Data-access exports options factories (not hooks), parsing with those schemas.
- MSW seeds the resource for `VITE_USE_MOCK_API=true`.
- `pnpm run test:query` covers list URL/filters (including the `/jobtypetask` path) and create + invalidation.

## Non-Goals

- Screen, dialog, form schema, Storybook, Figma.
- New `data-access` Zod DTO that duplicates the contract.
- Catalog types in `libs/shared/` or `platform-contract`.
- DELETE (not in swagger).
- Renaming JSON properties. `jobTypeTaskId` on the job-type nested line stays that name; this module is the resource that id points at.

## Wire contract

Copied from swagger `Fgs.Setup.Application.Features.JobTypeTasks.Dtos.JobTypeTask*`. Nullable strings use `nullableText`. Nullable numbers use `z.number().nullish()`.

### Summary / Detail (`JobTypeTaskSummaryDto` / `JobTypeTaskDetailDto`)

| Field | Type | Nullability |
| --- | --- | --- |
| id | number (int64) | required |
| jobCategoryId | number (int64) | required |
| tradeId | number (int64) | required |
| skillLevelId | number (int64) | nullable |
| name | string | nullable |
| taskName | string | nullable |
| priority | number (int32) | required |
| estimatedHours | number (double) | required |
| displayOrder | number (int32) | nullable |
| isActive | boolean | required |
| categoryName | string | nullable |

Detail equals Summary. Frontend type names are `SubcategorySummaryDto` and `SubcategoryDetailDto`.

### Lookup (`JobTypeTaskLookupDto`)

| Field | Type | Nullability |
| --- | --- | --- |
| id | number (int64) | required |
| name | string | nullable |

### Create

| Field | Type | Nullability |
| --- | --- | --- |
| jobCategoryId | number (int64) | required |
| tradeId | number (int64) | required |
| name | string | nullable |
| priority | number (int32) | required |
| estimatedHours | number (double) | required |
| displayOrder | number (int32) | nullable |
| taskName | string | nullable |
| skillLevelId | number (int64) | nullable |
| isActive | boolean | nullable |

### Update

Create fields except `isActive`.

### Patch

| Field | Type | Nullability |
| --- | --- | --- |
| jobCategoryId | number (int64) | nullable |
| tradeId | number (int64) | nullable |
| name | string | nullable |
| taskName | string | nullable |
| priority | number (int32) | nullable |
| estimatedHours | number (double) | nullable |
| displayOrder | number (int32) | nullable |
| isActive | boolean | nullable |
| skillLevelId | number (int64) | nullable |

### List params

`SetupListParams` plus `taskName?`, `name?`, `jobCategoryId?`, `jobTypeId?`. Query keys stay those swagger names.

## Functional requirements

- **REQ-1** Contract file `libs/settings/contract/src/lib/subcategory.schema.ts` exports summary/detail/lookup/create/update/patch schemas, response envelopes via `setupResponseSchema` / `pagedResultSchema`, inferred `Subcategory*` types, and `SubcategoryListParams`.
- **REQ-2** Contract barrel `src/index.ts` re-exports that file.
- **REQ-3** Data-access module `libs/settings/data-access/src/lib/subcategory/` with `*.endpoints.ts`, `*.keys.ts`, `*.queries.ts`, `*.mutations.ts`, `index.ts` matching BusinessType (no `*.form.ts`, no DELETE).
- **REQ-4** Collection endpoint is `/jobtypetask`. Lookup is registered conceptually before `:id` (MSW handler order).
- **REQ-5** Queries: `loadSubcategories` + `subcategoryListQueryOptions` / `Detail` / `Lookup`. List maps through `toPagedResult` so `items: null` becomes `[]`.
- **REQ-6** Mutations: create POST, update PUT, patch PATCH; each invalidates `subcategoryKeys.all`.
- **REQ-7** Data-access lib barrel exports the module. Module `index.ts` re-exports factories and the contract types.
- **REQ-8** MSW `libs/shared/mocks/src/handlers/subcategory.ts` appended in `handlers/index.ts`. Writes parse with contract create/update/patch schemas. Session-persisted seed. Paths are `/api/v1/jobtypetask`.
- **REQ-9** Fixtures in `tools/integration/src/fixtures/setup-catalog-response.ts` and a `describe('subcategory through customFetch')` covering list querystring + create invalidation.

## File map

| Layer | Path |
| --- | --- |
| Contract | `libs/settings/contract/src/lib/subcategory.schema.ts` |
| Data-access | `libs/settings/data-access/src/lib/subcategory/` |
| MSW | `libs/shared/mocks/src/handlers/subcategory.ts` |
| Tests | `tools/integration/src/setup-catalog.integration.test.ts` |

Folder name is kebab-case (`subcategory`). Endpoint path stays swagger-literal (`/jobtypetask`).

## Verification

- `pnpm exec nx lint settings-contract settings-data-access shared-mocks`
- `tsc --noEmit` on those projects if Nx reports `No tasks were run`
- `pnpm run test:query`

## Open questions / assumptions

- Assumed operations = exactly the verbs present on tag `JobTypeTask`.
- Frontend symbol names are `Subcategory*`. Wire path and JSON fields are unchanged.
- `jobTypeId` is a list filter only. It is not a field on the DTO. MSW keeps that link beside the record and does not return it.
- Assumed no form schema until a screen exists.
- Tenant and company headers stay on the shared fetch client.
