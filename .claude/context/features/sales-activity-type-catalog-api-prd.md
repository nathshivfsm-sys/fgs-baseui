# SalesActivityType catalog API

**Swagger:** `https://100.31.187.221/swagger/setup/v1/swagger.json` tag `SalesActivityType`
**Owning MFE:** settings
**Reference module:** Sales Pipeline Status
**Scope:** contract DTOs, data-access factories, MSW handlers, integration tests

## Overview

Adds the FGS Setup Service `/salesactivitytype` catalog to `@cms/settings-contract`
and `@cms/settings-data-access` so Settings can later list, look up, create,
update, and patch sales activity types. Same four-layer stack as Sales
Pipeline Status. No screen in this pass.

## Source

| Item | Value |
| --- | --- |
| OpenAPI | `https://100.31.187.221/swagger/setup/v1/swagger.json` |
| Tag | `SalesActivityType` |
| Collection path | `/salesactivitytype` (after stripping `/api/v{version}`) |
| Operations | list GET, detail GET, lookup GET, POST, PUT, PATCH |

List query params beyond `SetupListParams`: `activityTypeCode`, `activityTypeName`.

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

Summary and Detail share the same fields. Lookup omits flags and `isActive`.

| Field | Summary / Detail | Lookup | Create | Update | Patch |
| --- | --- | --- | --- | --- | --- |
| `id` | `number` | `number` | — | — | — |
| `activityTypeCode` | nullable string | nullable string | nullable string | nullable string | nullable string |
| `activityTypeName` | nullable string | nullable string | nullable string | nullable string | nullable string |
| `description` | nullable string | — | nullable string | nullable string | nullable string |
| `displayOrder` | `number` | `number` | nullable `number` | `number` | nullable `number` |
| `isSystem` | `boolean` | — | `boolean` | `boolean` | nullable `boolean` |
| `appliesToLead` | `boolean` | — | `boolean` | `boolean` | nullable `boolean` |
| `appliesToOpportunity` | `boolean` | — | `boolean` | `boolean` | nullable `boolean` |
| `allowManualSelection` | `boolean` | — | `boolean` | `boolean` | nullable `boolean` |
| `isActive` | `boolean` | — | — | — | nullable `boolean` |

List params = `SetupListParams` + `activityTypeCode?` + `activityTypeName?`.

## Functional requirements

- **REQ-1** Contract file `libs/settings/contract/src/lib/sales-activity-type.schema.ts` exports summary/detail/lookup/create/update/patch schemas, response envelopes via `setupResponseSchema` / `pagedResultSchema`, inferred types, and `SalesActivityTypeListParams`.
- **REQ-2** Contract barrel `src/index.ts` re-exports that file.
- **REQ-3** Data-access module `libs/settings/data-access/src/lib/sales-activity-type/` with `*.endpoints.ts`, `*.keys.ts`, `*.queries.ts`, `*.mutations.ts`, `index.ts` matching Sales Pipeline Status (no form schema).
- **REQ-4** Collection endpoint string is `/salesactivitytype`. Lookup is registered before `:id` in MSW.
- **REQ-5** Queries: `loadSalesActivityTypes` / `loadSalesActivityType` / `loadSalesActivityTypeLookup` plus list/detail/lookup query options. List maps through `toPagedResult`.
- **REQ-6** Mutations: create POST, update PUT, patch PATCH; each invalidates `salesActivityTypeKeys.all`.
- **REQ-7** Data-access lib barrel exports the module. Module `index.ts` re-exports factories and the contract types.
- **REQ-8** MSW `libs/shared/mocks/src/handlers/sales-activity-type.ts` appended in `handlers/index.ts`. Writes parse with contract create/update/patch schemas. Session-persisted seed includes one inactive row.
- **REQ-9** Fixtures in `tools/integration/src/fixtures/setup-catalog-response.ts` and a `describe` in `setup-catalog.integration.test.ts` covering list querystring + create invalidation.

## File map

| Layer | Path |
| --- | --- |
| Contract | `libs/settings/contract/src/lib/sales-activity-type.schema.ts` |
| Data-access | `libs/settings/data-access/src/lib/sales-activity-type/` |
| MSW | `libs/shared/mocks/src/handlers/sales-activity-type.ts` |
| Tests | `tools/integration/src/setup-catalog.integration.test.ts` |

## Verification

- `tsc --noEmit` on `settings-contract`, `settings-data-access`, and `shared-mocks`
- `pnpm run test:query`

## Open questions / assumptions

- Assumed operations = exactly the verbs present in swagger.
- Assumed no form schema until a screen exists.
- Swagger omits a `required` array. Create/update booleans are required in Zod, matching Sales Pipeline Status. Nullable strings and nullable numbers stay `.nullish()`.
