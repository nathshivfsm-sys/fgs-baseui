# Employee catalog API

**Swagger:** `https://100.31.187.221/swagger/setup/v1/swagger.json` tag `Employee`
**Owning MFE:** settings
**Reference module:** User list/summary + array query params, GL Break for nested `LocationWriteDto` and lookup
**Scope:** contract DTOs, data-access factories, MSW handlers, integration tests

## Overview

Adds the FGS Setup Service `/employee` catalog to `@cms/settings-contract` and
`@cms/settings-data-access`. Operations match swagger: list, detail, lookup,
create (POST), update (PUT), and patch (PATCH). The list envelope carries an
optional summary, the same shape Users already parse. No screen in this pass.

## Source

| Item | Value |
| --- | --- |
| OpenAPI | `https://100.31.187.221/swagger/setup/v1/swagger.json` |
| Tag | `Employee` |
| Collection path | `/employee` (after stripping `/api/v{version}`) |
| Operations | list GET, detail GET, lookup GET, POST, PUT, PATCH |

List params beyond `SetupListParams`: `employeeNumber`, `employeeTypeId`,
`statusId`, `techTradeIds`, `techSkillIds`, `dispatchZoneIds`, `roleIds`,
`includeSummary` (swagger default `true`).

Lookup query: `activeOnly` (default `true`).

## Goals

- Wire DTOs live once in `@cms/settings-contract`.
- Data-access exports options factories (not hooks), parsing with those schemas.
- MSW seeds the resource for `VITE_USE_MOCK_API=true`.
- `pnpm run test:query` covers list URL/filters (including repeated id params and summary) and create + invalidation.

## Non-Goals

- Screen, dialog, form schema, Storybook, Figma.
- New `data-access` Zod DTO that duplicates the contract.
- Catalog types in `libs/shared/` or `platform-contract`.
- DELETE (not in swagger).

## Wire contract

Nullable strings use `nullableText`. Nullable numbers use `z.number().nullish()`.
Non-nullable ints and booleans use `z.number()` / `z.boolean()`. Dates and times
stay `z.string()`. `userId` and address `id` are UUIDs.

Summary and detail share identity fields. Summary adds `hasTechnicianProfile`.
Detail adds `address` (`FgsEmployeeAddressDetailDto`) and `technicianProfile`
(`FgsEmployeeTechnicianProfileDetailDto`). Neither summary nor detail exposes
`isActive`; list and lookup still filter on it, and PATCH accepts `isActive`.

Create omits `overtimeRate` and `doubleTimeRate`. Update and patch include them.
Writes send `address` as `LocationWriteDto` and `technicianProfile` as the write DTO.

List result is a paged summary plus `summary` (`totalEmployees`, `activeEmployees`,
`inactiveEmployees`).

## Functional requirements

- **REQ-1** Contract file `libs/settings/contract/src/lib/employee.schema.ts` exports summary/detail/lookup/create/update/patch schemas, address and technician-profile schemas, response envelopes, inferred types, and `EmployeeListParams`.
- **REQ-2** Contract barrel `src/index.ts` re-exports that file.
- **REQ-3** Data-access module `libs/settings/data-access/src/lib/employee/` with `*.endpoints.ts`, `*.keys.ts`, `*.queries.ts`, `*.mutations.ts`, `index.ts`.
- **REQ-4** Collection endpoint is `/employee`. Lookup is registered before `:id` in MSW.
- **REQ-5** Queries: `loadEmployees` / `loadEmployee` / `loadEmployeeLookup` plus list/detail/lookup query options. List maps through `toPagedResult` and keeps `summary`.
- **REQ-6** Mutations: create POST, update PUT, patch PATCH; each invalidates `employeeKeys.all`.
- **REQ-7** Data-access lib barrel exports the module. Module `index.ts` re-exports factories and the contract types.
- **REQ-8** MSW `libs/shared/mocks/src/handlers/employee.ts` appended in `handlers/index.ts`. Writes parse with contract schemas. Session-persisted seed includes one inactive employee.
- **REQ-9** Fixtures in `tools/integration/src/fixtures/setup-catalog-response.ts` and a `describe` covering list querystring (repeated `techTradeIds`) + create invalidation.

## File map

| Layer | Path |
| --- | --- |
| Contract | `libs/settings/contract/src/lib/employee.schema.ts` |
| Data-access | `libs/settings/data-access/src/lib/employee/` |
| MSW | `libs/shared/mocks/src/handlers/employee.ts` |
| Tests | `tools/integration/src/setup-catalog.integration.test.ts` |

## Verification

- `pnpm exec nx lint settings-contract settings-data-access shared-mocks`
- `tsc --noEmit` on those projects if Nx reports `No tasks were run`
- `pnpm run test:query`

## Open questions / assumptions

- Assumed operations = exactly the verbs present in swagger.
- Assumed no form schema until a screen exists.
- `isActive` is a list/lookup filter and a patch field only. The mock stores it on the record and omits it from summary and detail JSON consumers via the contract parse.
- Repeated query keys (`techTradeIds=1&techTradeIds=2`) match the Users `roleIds` pattern.
