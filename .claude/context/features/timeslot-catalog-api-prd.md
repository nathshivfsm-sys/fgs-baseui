# Timeslot catalog API

**Swagger:** `https://100.31.187.221/swagger/setup/v1/swagger.json` tag `Timeslot`
**Owning MFE:** settings
**Reference module:** Billing Category (lookup filters) / Business Type (flat DTO)
**Scope:** contract DTOs, data-access factories, MSW handlers, integration tests

## Overview

Adds the FGS Setup Service `/timeslot` catalog to `@cms/settings-contract` and
`@cms/settings-data-access` so Settings can later list, look up, create, update,
and patch timeslots. Same four-layer stack as Billing Category. No screen in
this pass.

## Source

| Item | Value |
| --- | --- |
| OpenAPI | `https://100.31.187.221/swagger/setup/v1/swagger.json` |
| Tag | `Timeslot` |
| Collection path | `/timeslot` (after stripping `/api/v{version}`) |
| Operations | list GET, detail GET, lookup GET, POST, PUT, PATCH |

List query params beyond `SetupListParams`: `code`, `name`.

Lookup query params beyond `activeOnly`: `isMobileVisible`, `isCustomerPortalVisible`.

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

Copied from swagger `Timeslot*` DTOs. Nullable strings use `nullableText`.
`date-span` values stay `z.string()`. Nullable numbers use `z.number().nullish()`.

### Summary / Detail

| Field | Type | Nullability |
| --- | --- | --- |
| id | number | required |
| fgsSetupZoneId | number | nullable |
| code | string | nullable |
| name | string | nullable |
| beginTime | string (`date-span`) | required |
| endTime | string (`date-span`) | required |
| markTechArrivedLateAfter | string (`date-span`) | nullable |
| markWorkOrderDelayedCompletionAfter | string (`date-span`) | nullable |
| isMobileVisible | boolean | required |
| isCustomerPortalVisible | boolean | required |
| includeInCapacityPlanning | boolean | required |
| showToExternalSystem | boolean | required |
| isActive | boolean | required |

Summary and detail share the same fields.

### Lookup

| Field | Type | Nullability |
| --- | --- | --- |
| id | number | required |
| code | string | nullable |
| name | string | nullable |

### Create / Update

Summary fields except `id` and `isActive`. `beginTime` and `endTime` stay required strings. Booleans stay required.

### Patch

Create fields, each nullable, plus `isActive` (`boolean`, nullable).

### List params

`SetupListParams` plus `code?`, `name?`.

### Lookup params

`activeOnly?` (default `true`), `isMobileVisible?`, `isCustomerPortalVisible?`.

## Functional requirements

- **REQ-1** Contract file `libs/settings/contract/src/lib/timeslot.schema.ts` exports summary/detail/lookup/create/update/patch schemas, response envelopes via `setupResponseSchema` / `pagedResultSchema`, inferred types, `TimeslotListParams`, and `TimeslotLookupParams`.
- **REQ-2** Contract barrel `src/index.ts` re-exports that file.
- **REQ-3** Data-access module `libs/settings/data-access/src/lib/timeslot/` with `*.endpoints.ts`, `*.keys.ts`, `*.queries.ts`, `*.mutations.ts`, `index.ts` matching Billing Category (no `*.form.ts`).
- **REQ-4** Collection endpoint is `/timeslot`. Lookup is registered before `:id` (MSW handler order).
- **REQ-5** Queries: `loadTimeslots` + `timeslotListQueryOptions` / `Detail` / `Lookup`. List maps through `toPagedResult` so `items: null` becomes `[]`.
- **REQ-6** Mutations: create POST, update PUT, patch PATCH; each invalidates `timeslotKeys.all`.
- **REQ-7** Data-access lib barrel exports the module. Module `index.ts` re-exports factories and the contract types.
- **REQ-8** MSW `libs/shared/mocks/src/handlers/timeslot.ts` appended in `handlers/index.ts`. Writes parse with contract create/update/patch schemas. Session-persisted seed.
- **REQ-9** Fixtures in `tools/integration/src/fixtures/setup-catalog-response.ts` and a `describe('timeslot through customFetch')` covering list querystring + create invalidation.

## File map

| Layer | Path |
| --- | --- |
| Contract | `libs/settings/contract/src/lib/timeslot.schema.ts` |
| Data-access | `libs/settings/data-access/src/lib/timeslot/` |
| MSW | `libs/shared/mocks/src/handlers/timeslot.ts` |
| Tests | `tools/integration/src/setup-catalog.integration.test.ts` |

Folder name is `timeslot`. Endpoint path stays swagger-literal (`/timeslot`).

## Verification

- `pnpm exec nx lint settings-contract settings-data-access shared-mocks`
- `tsc --noEmit` on those projects if Nx reports `No tasks were run`
- `pnpm run test:query`

## Open questions / assumptions

- Assumed operations = exactly the verbs present in swagger (no DELETE).
- Assumed no form schema until a screen exists.
- `date-span` is stored as an ISO-like duration string (`HH:mm:ss`), not a date.
