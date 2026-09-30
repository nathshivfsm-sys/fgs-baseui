# JobType catalog API

**Swagger:** [setup/v1/swagger.json](https://api-dev.fieldwhizey.com/swagger/setup/v1/swagger.json) tag `JobType`
**Owning MFE:** settings
**Reference module:** BusinessType, plus Tax for the nested `subCategories` line
**Scope:** contract DTOs, data-access factories, MSW handlers, integration tests

## Overview

Adds the FGS Setup Service `/jobtype` catalog to `@cms/settings-contract` and `@cms/settings-data-access` so Settings can later list, look up, count, create, update, and patch job types. Detail and writes carry a nested `subCategories` line. Each line's `jobTypeTaskId` is the id of a subcategory (`/jobtypetask`). No screen in this pass.

## Source

| Item | Value |
| --- | --- |
| OpenAPI | `https://api-dev.fieldwhizey.com/swagger/setup/v1/swagger.json` |
| Tag | `JobType` |
| Collection path | `/jobtype` (after stripping `/api/v{version}`) |
| Operations | list GET, detail GET, lookup GET, counts GET, POST, PUT, PATCH |

List query params beyond `SetupListParams`: `jobTypeCode`, `name`, `usedFor`, `jobTypeTaskId`, `businessUnit`.

Counts query params: `search`, `jobTypeCode`, `name`, `usedFor`, `jobTypeTaskId`, `businessUnit` (no paging).

Lookup query: `activeOnly` (default true).

## Goals

- Wire DTOs live once in `@cms/settings-contract`.
- Data-access exports options factories (not hooks), parsing with those schemas.
- MSW seeds the resource for `VITE_USE_MOCK_API=true`.
- `pnpm run test:query` covers list URL/filters, counts URL, and create + invalidation.

## Non-Goals

- Screen, dialog, form schema, Storybook, Figma.
- New `data-access` Zod DTO that duplicates the contract.
- Catalog types in `libs/shared/` or `platform-contract`.
- DELETE (not in swagger).
- Renaming the wire field `jobTypeTaskId`. The subcategory module owns the `/jobtypetask` resource; this field stays the swagger name so the JSON matches the API.

## Wire contract

Copied from swagger `Fgs.Setup.Application.Features.JobTypes.Dtos.JobType*`. Nullable strings use `nullableText`. Nullable numbers use `z.number().nullish()`. `usedFor` is an int32 with no enum in swagger.

### Summary (`JobTypeSummaryDto`)

| Field | Type | Nullability |
| --- | --- | --- |
| id | number (int64) | required |
| jobTypeCode | string | nullable |
| name | string | nullable |
| usedFor | number (int32) | required |
| businessUnit | string | nullable |
| showToFieldTech | boolean | required |
| showOnCustomerPortal | boolean | required |
| displayOrder | number (int32) | nullable |
| isActive | boolean | required |

### Nested line (`JobTypeSubCategoryDto`)

| Field | Type | Nullability |
| --- | --- | --- |
| categoryId | number (int64) | required |
| categoryName | string | nullable |
| jobTypeTaskId | number (int64) | required |
| name | string | nullable |

### Nested write (`JobTypeSubCategoryWriteDto`)

| Field | Type | Nullability |
| --- | --- | --- |
| jobTypeTaskId | number (int64) | required |
| displayOrder | number (int32) | nullable |
| isActive | boolean | required |

### Detail (`JobTypeDetailDto`)

Summary fields plus `subCategories` (array of `JobTypeSubCategoryDto`, nullable).

### Create

| Field | Type | Nullability |
| --- | --- | --- |
| jobTypeCode | string | nullable |
| name | string | nullable |
| usedFor | number (int32) | required |
| businessUnit | string | nullable |
| showToFieldTech | boolean | required |
| showOnCustomerPortal | boolean | required |
| displayOrder | number (int32) | nullable |
| subCategories | array of write DTO | nullable |
| isActive | boolean | required |

### Update

Create fields except `isActive` (still includes `subCategories`).

### Patch

Every create field, including `isActive` and `subCategories`, nullable.

### Counts (`JobTypeCountsDto`)

| Field | Type | Nullability |
| --- | --- | --- |
| activeCount | number (int32) | required |
| inactiveCount | number (int32) | required |

### Lookup (`JobTypeLookupDto`)

`id`, `jobTypeCode`, `name`, `displayOrder`. Omits `isActive` and the nested line.

### List params

`SetupListParams` plus `jobTypeCode?`, `name?`, `usedFor?`, `jobTypeTaskId?`, `businessUnit?`.

`JobTypeCountsParams` is the counts query above (not paged).

## Functional requirements

- **REQ-1** Contract file `libs/settings/contract/src/lib/job-type.schema.ts` exports summary/detail/lookup/counts/create/update/patch schemas, the nested subcategory line schemas, response envelopes, inferred types, `JobTypeListParams`, and `JobTypeCountsParams`.
- **REQ-2** Contract barrel `src/index.ts` re-exports that file.
- **REQ-3** Data-access module `libs/settings/data-access/src/lib/job-type/` with `*.endpoints.ts`, `*.keys.ts`, `*.queries.ts`, `*.mutations.ts`, `index.ts` matching BusinessType, plus counts. No `*.form.ts`, no DELETE.
- **REQ-4** Collection endpoint is `/jobtype`. Counts is `/jobtype/counts`. Lookup and counts are registered before `:id` (MSW handler order).
- **REQ-5** Queries: `loadJobTypes` + `jobTypeListQueryOptions` / `Detail` / `Lookup` / `Counts`. List maps through `toPagedResult` so `items: null` becomes `[]`.
- **REQ-6** Mutations: create POST, update PUT, patch PATCH; each invalidates `jobTypeKeys.all` (list, detail, lookup, and counts).
- **REQ-7** Data-access lib barrel exports the module. Module `index.ts` re-exports factories and the contract types.
- **REQ-8** MSW `libs/shared/mocks/src/handlers/job-type.ts` appended in `handlers/index.ts`. Writes parse with contract create/update/patch schemas and map write lines onto detail lines. Session-persisted seed.
- **REQ-9** Fixtures in `tools/integration/src/fixtures/setup-catalog-response.ts` and a `describe('job type through customFetch')` covering list querystring, counts URL, and create invalidation.

## File map

| Layer | Path |
| --- | --- |
| Contract | `libs/settings/contract/src/lib/job-type.schema.ts` |
| Data-access | `libs/settings/data-access/src/lib/job-type/` |
| MSW | `libs/shared/mocks/src/handlers/job-type.ts` |
| Tests | `tools/integration/src/setup-catalog.integration.test.ts` |

Folder name is kebab-case (`job-type`). Endpoint path stays swagger-literal (`/jobtype`).

## Verification

- `pnpm exec nx lint settings-contract settings-data-access shared-mocks`
- `tsc --noEmit` on those projects if Nx reports `No tasks were run`
- `pnpm run test:query`

## Open questions / assumptions

- Assumed operations = exactly the verbs present on tag `JobType`, including `GET /jobtype/counts`.
- `usedFor` stays a number. Swagger does not publish an enum.
- Assumed no form schema until a screen exists.
- Tenant and company headers stay on the shared fetch client.
