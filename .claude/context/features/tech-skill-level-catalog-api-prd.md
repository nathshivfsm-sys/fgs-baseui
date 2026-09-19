# TechSkillLevel catalog API

**Swagger:** `https://api-dev.fieldwhizey.com/swagger/setup/v1/swagger.json` tag `TechSkillLevel`
**Owning MFE:** settings
**Reference module:** Zone (`libs/settings/data-access/src/lib/zone/`)
**Scope:** contract DTOs, data-access factories, MSW handlers, integration tests

## Overview

Adds the FGS Setup Service `/techskilllevel` catalog to `@cms/settings-contract`
and `@cms/settings-data-access` so Settings can later list, look up, create,
update, and patch technician skill levels. Same four-layer stack as Zone /
Postal Code. No screen in this pass.

## Source

| Item | Value |
| --- | --- |
| OpenAPI | `https://api-dev.fieldwhizey.com/swagger/setup/v1/swagger.json` |
| Tag | `TechSkillLevel` |
| Collection path | `/techskilllevel` (after stripping `/api/v{version}`) |
| Operations | list GET, detail GET, lookup GET, POST, PUT, PATCH |

List query params beyond `SetupListParams`: `code`, `name`.

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

Copied from swagger `FgsSetupTechSkillLevel*` DTOs. Nullable strings use
`nullableText`. `sortOrder` is `z.number().nullish()`.

### Summary / Detail (`FgsSetupTechSkillLevelSummaryDto` / `DetailDto`)

| Field | Type | Nullability |
| --- | --- | --- |
| id | number | required |
| code | string | nullable |
| name | string | nullable |
| description | string | nullable |
| sortOrder | number | nullable |
| isActive | boolean | required |

Detail equals Summary.

### Lookup (`FgsSetupTechSkillLevelLookupDto`)

| Field | Type | Nullability |
| --- | --- | --- |
| id | number | required |
| code | string | nullable |
| name | string | nullable |
| sortOrder | number | nullable |

Omits `isActive` and `description`.

### Create / Update

| Field | Type | Nullability |
| --- | --- | --- |
| code | string | nullable |
| name | string | nullable |
| description | string | nullable |
| sortOrder | number | nullable |

### Patch

Create fields plus `isActive` (`boolean`, nullable).

### List params

`SetupListParams` plus `code?`, `name?`.

## Functional requirements

- **REQ-1** Contract file `libs/settings/contract/src/lib/tech-skill-level.schema.ts` exports summary/detail/lookup/create/update/patch schemas, response envelopes via `setupResponseSchema` / `pagedResultSchema`, inferred types, and `TechSkillLevelListParams`.
- **REQ-2** Contract barrel `src/index.ts` re-exports that file.
- **REQ-3** Data-access module `libs/settings/data-access/src/lib/tech-skill-level/` with `*.endpoints.ts`, `*.keys.ts`, `*.queries.ts`, `*.mutations.ts`, `index.ts` matching Zone (no `*.form.ts`).
- **REQ-4** Collection endpoint is `/techskilllevel`. Lookup is registered conceptually before `:id` (MSW handler order).
- **REQ-5** Queries: `loadTechSkillLevels` + `techSkillLevelListQueryOptions` / `Detail` / `Lookup`. List maps through `toPagedResult` so `items: null` becomes `[]`.
- **REQ-6** Mutations: create POST, update PUT, patch PATCH; each invalidates `techSkillLevelKeys.all`.
- **REQ-7** Data-access lib barrel exports the module. Module `index.ts` re-exports factories and the contract types (same as Zone).
- **REQ-8** MSW `libs/shared/mocks/src/handlers/tech-skill-level.ts` appended in `handlers/index.ts`. Writes parse with contract create/update/patch schemas. Session-persisted seed.
- **REQ-9** Fixtures in `tools/integration/src/fixtures/setup-catalog-response.ts` and a `describe('tech skill level through customFetch')` covering list querystring + create invalidation.

## File map

| Layer | Path |
| --- | --- |
| Contract | `libs/settings/contract/src/lib/tech-skill-level.schema.ts` |
| Data-access | `libs/settings/data-access/src/lib/tech-skill-level/` |
| MSW | `libs/shared/mocks/src/handlers/tech-skill-level.ts` |
| Tests | `tools/integration/src/setup-catalog.integration.test.ts` |

Folder names are kebab-case (`tech-skill-level`). Endpoint paths stay swagger-literal (`/techskilllevel`).

## Verification

- `pnpm exec nx lint settings-contract settings-data-access shared-mocks`
- `tsc --noEmit` on those projects if Nx reports `No tasks were run`
- `pnpm run test:query`

## Open questions / assumptions

- Assumed operations = exactly the verbs present in swagger (no DELETE).
- Assumed no form schema until a screen exists.
- Unlike TechTrade, summary and detail share the same fields (both include `description`).
