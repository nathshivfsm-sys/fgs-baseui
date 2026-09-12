# [Resource] catalog API

**Swagger:** [JSON URL + tag]
**Owning MFE:** settings | lead | workorder | invoice
**Reference module:** Tax (or named sibling)
**Scope:** contract DTOs, data-access factories, MSW handlers, integration tests

## Overview

One paragraph: which Setup/catalog resource, which operations, who consumes
the factories (the MFE remote, later). No UI in this pass unless listed under
Goals.

## Source

| Item | Value |
| --- | --- |
| OpenAPI | `https://…/swagger/<service>/v1/swagger.json` |
| Tag | e.g. `NonWorkingDate` |
| Collection path | `/nonworkingdate` (after stripping `/api/v{version}`) |
| Operations | list GET, detail GET, lookup GET, POST, PUT, PATCH |

List extra query params (e.g. `name`, `nonWorkingDate`).

## Goals

- Wire DTOs live once in `@cms/<mfe>-contract`.
- Data-access exports options factories (not hooks), parsing with those schemas.
- MSW seeds the resource for `VITE_USE_MOCK_API=true`.
- `pnpm run test:query` covers list URL/filters, at least one write + invalidation, and `ApiError` if this is the first module in the file (otherwise reuse the existing tax `ApiError` case).

## Non-Goals

- Screen, dialog, form schema, Storybook, Figma.
- New `data-access` Zod DTO that duplicates the contract.
- Catalog types in `libs/shared/` or `platform-contract`.
- DELETE or other verbs not in swagger.

## Wire contract

Table copied from swagger (field, type, nullability). Groups:

- Summary / Detail / Lookup
- Create / Update / Patch
- List params = `SetupListParams` + resource filters

Dates stay `z.string()` (ISO `YYYY-MM-DD` or date-time as the swagger `format`
shows). Display strings use `nullableText`. Required create/update scalars use
`z.string()` / `z.number()` / `z.boolean()` as swagger declares them.

## Functional requirements

- **REQ-1** Contract file `libs/<mfe>/contract/src/lib/<kebab>.schema.ts` exports summary/detail/lookup/create/update/patch schemas, response envelopes via `setupResponseSchema` / `pagedResultSchema`, inferred types, and `<Resource>ListParams`.
- **REQ-2** Contract barrel `src/index.ts` re-exports that file.
- **REQ-3** Data-access module `libs/<mfe>/data-access/src/lib/<kebab>/` with `*.endpoints.ts`, `*.keys.ts`, `*.queries.ts`, `*.mutations.ts`, `index.ts` matching the reference module (Tax).
- **REQ-4** Collection endpoint string equals the swagger path minus `/api/v{version}`. Lookup is registered conceptually before `:id` (MSW handler order).
- **REQ-5** Queries: `load*` + `<resource>ListQueryOptions` / `Detail` / `Lookup`. List maps through `toPagedResult` so `items: null` becomes `[]`.
- **REQ-6** Mutations: create POST, update PUT, patch PATCH; each invalidates `<resource>Keys.all`.
- **REQ-7** Data-access lib barrel exports the module. Module `index.ts` re-exports factories and the contract types (same as Tax).
- **REQ-8** MSW `libs/shared/mocks/src/handlers/<kebab>.ts` appended in `handlers/index.ts`. Writes parse with contract create/update/patch schemas. Session-persisted seed.
- **REQ-9** Fixtures in `tools/integration/src/fixtures/setup-catalog-response.ts` (or that MFE's fixture file) and a `describe` in the catalog integration test covering list querystring + create invalidation.

## File map

| Layer | Path |
| --- | --- |
| Contract | `libs/<mfe>/contract/src/lib/<kebab>.schema.ts` |
| Data-access | `libs/<mfe>/data-access/src/lib/<kebab>/` |
| MSW | `libs/shared/mocks/src/handlers/<kebab>.ts` |
| Tests | `tools/integration/src/setup-catalog.integration.test.ts` |

Folder names are kebab-case (`non-working-date`, `tax-authority`). Endpoint
paths stay swagger-literal (`/nonworkingdate`). No `< > : " \| ? *` in paths.

## Verification

- `pnpm exec nx lint <mfe>-contract <mfe>-data-access shared-mocks`
- `tsc --noEmit` on those projects if Nx reports `No tasks were run`
- `pnpm run test:query`

## Open questions / assumptions

- Assumed operations = exactly the verbs present in swagger.
- Assumed no form schema until a screen exists.
- List any swagger field that was ambiguous.
