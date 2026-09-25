# BusinessType catalog API

**Swagger:** [setup/v1/swagger.json](https://api-dev.fieldwhizey.com/swagger/setup/v1/swagger.json) tag `BusinessType`
**Owning MFE:** settings
**Reference module:** TechSkillLevel (`libs/settings/data-access/src/lib/tech-skill-level/`)
**Scope:** contract DTOs, data-access factories, MSW handlers, integration tests

## Overview

Adds the FGS Setup Service `/businesstype` catalog to `@cms/settings-contract` and `@cms/settings-data-access` so Settings can later list, look up, create, update, and patch business types. Same four-layer stack as TechSkillLevel. No screen in this pass. Tenant-company assignment (`/tenant/{tenantId}/companies/{companyId}/businesstype`) and GLO lookup (`/glo/businesstype/lookup`) are separate tags and stay out of this module.

## Source

| Item | Value |
| --- | --- |
| OpenAPI | `https://api-dev.fieldwhizey.com/swagger/setup/v1/swagger.json` |
| Tag | `BusinessType` |
| Collection path | `/businesstype` (after stripping `/api/v{version}`) |
| Operations | list GET, detail GET, lookup GET, POST, PUT, PATCH |

List query params beyond `SetupListParams`: `code`, `name`. Lookup query: `activeOnly` (default true).

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
- `TenantCompanyBusinessType` and `GloBusinessTypeLookup`.

## Wire contract

Copied from swagger `Fgs.Setup.Application.Features.FgsBusinessTypes.Dtos.FgsBusinessType*`. Nullable strings use `nullableText`. `displayOrder` is `z.number().nullish()`.

### Summary / Detail (`FgsBusinessTypeSummaryDto` / `FgsBusinessTypeDetailDto`)

| Field | Type | Nullability |
| --- | --- | --- |
| id | number (int64) | required |
| code | string | nullable |
| name | string | nullable |
| description | string | nullable |
| displayOrder | number (int32) | nullable |
| isActive | boolean | required |

Detail equals Summary.

### Lookup (`FgsBusinessTypeLookupDto`)

| Field | Type | Nullability |
| --- | --- | --- |
| id | number (int64) | required |
| code | string | nullable |
| name | string | nullable |
| displayOrder | number (int32) | nullable |

Omits `isActive` and `description`.

### Create / Update

| Field | Type | Nullability |
| --- | --- | --- |
| code | string | nullable |
| name | string | nullable |
| description | string | nullable |
| displayOrder | number (int32) | nullable |

### Patch

Create fields plus `isActive` (`boolean`, nullable).

### List params

`SetupListParams` plus `code?`, `name?`.

## Functional requirements

- **REQ-1** Contract file `libs/settings/contract/src/lib/business-type.schema.ts` exports summary/detail/lookup/create/update/patch schemas, response envelopes via `setupResponseSchema` / `pagedResultSchema`, inferred types, and `BusinessTypeListParams`.
- **REQ-2** Contract barrel `src/index.ts` re-exports that file.
- **REQ-3** Data-access module `libs/settings/data-access/src/lib/business-type/` with `*.endpoints.ts`, `*.keys.ts`, `*.queries.ts`, `*.mutations.ts`, `index.ts` matching TechSkillLevel (no `*.form.ts`, no DELETE).
- **REQ-4** Collection endpoint is `/businesstype`. Lookup is registered conceptually before `:id` (MSW handler order).
- **REQ-5** Queries: `loadBusinessTypes` + `businessTypeListQueryOptions` / `Detail` / `Lookup`. List maps through `toPagedResult` so `items: null` becomes `[]`.
- **REQ-6** Mutations: create POST, update PUT, patch PATCH; each invalidates `businessTypeKeys.all`.
- **REQ-7** Data-access lib barrel exports the module. Module `index.ts` re-exports factories and the contract types (same as TechSkillLevel, without form or delete).
- **REQ-8** MSW `libs/shared/mocks/src/handlers/business-type.ts` appended in `handlers/index.ts`. Writes parse with contract create/update/patch schemas. Session-persisted seed.
- **REQ-9** Fixtures in `tools/integration/src/fixtures/setup-catalog-response.ts` and a `describe('business type through customFetch')` covering list querystring + create invalidation.

## File map

| Layer | Path |
| --- | --- |
| Contract | `libs/settings/contract/src/lib/business-type.schema.ts` |
| Data-access | `libs/settings/data-access/src/lib/business-type/` |
| MSW | `libs/shared/mocks/src/handlers/business-type.ts` |
| Tests | `tools/integration/src/setup-catalog.integration.test.ts` |

Folder name is kebab-case (`business-type`). Endpoint path stays swagger-literal (`/businesstype`).

## Verification

- `pnpm exec nx lint settings-contract settings-data-access shared-mocks`
- `tsc --noEmit` on those projects if Nx reports `No tasks were run`
- `pnpm run test:query`

## Open questions / assumptions

- Assumed operations = exactly the verbs present on tag `BusinessType`.
- Assumed no form schema until a screen exists.
- Tenant and company headers (`X-Tenant-Id`, `X-Company-Id`) stay on the shared fetch client, not on these factories.
