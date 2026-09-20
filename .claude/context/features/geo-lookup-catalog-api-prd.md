# Geo lookup catalog API

**Swagger:** `https://api-dev.fieldwhizey.com/swagger/setup/v1/swagger.json` tags `GloLookup` and `PostalCode`
**Owning lib:** shared (`@cms/shared-contract` + `@cms/shared-data-access`)
**Reference module:** Attachment (`libs/shared/data-access/src/lib/attachment/`) for the shared-lib split; Postal Code lookup queries for GET-only factories
**Scope:** contract DTOs, data-access query factories, MSW handlers, integration tests

## Overview

Adds three Setup Service GET lookups used by address/location forms across remotes:
country, state/province, and postal-code cities. They live in the shared libs
(same home as `/attachment`) so Settings, Lead, and later modules import one
copy. Lookup-only — no create/update/patch. No screen in this pass.

## Source

| Item | Value |
| --- | --- |
| OpenAPI | `https://api-dev.fieldwhizey.com/swagger/setup/v1/swagger.json` |
| Tags | `GloLookup`, `PostalCode` (cities only) |
| Paths | `/glo/country/lookup`, `/glo/stateprovince/lookup`, `/postalcode/cities` |
| Operations | GET lookup for each (no POST/PUT/PATCH/DELETE) |

Query params:

| Endpoint | Params |
| --- | --- |
| `/glo/country/lookup` | `activeOnly` (boolean, default `true`) |
| `/glo/stateprovince/lookup` | `countryCode` (string), `activeOnly` (boolean, default `true`) |
| `/postalcode/cities` | `countryCode`, `stateProvinceCode`, `activeOnly` (default `true`) |

`/postalcode/cities` also documents `X-Tenant-Id` / `X-Company-Id`; those are
already sent by `customFetch`. Country and state swagger operations list query
only.

## Goals

- Wire DTOs live once in `@cms/shared-contract`.
- Data-access exports options factories (not hooks), parsing with those schemas.
- MSW seeds the three lookups for `VITE_USE_MOCK_API=true`.
- `pnpm run test:query` covers all three URLs including filter querystrings.

## Non-Goals

- Screen, dialog, form schema, Storybook, Figma.
- New `data-access` Zod DTO that duplicates the contract.
- Catalog types in `libs/settings/contract` (these are cross-MFE lookups).
- Mutations / DELETE (not in swagger for these paths).
- Other `GloLookup` resources (timezone, language, …).

## Wire contract

Copied from swagger. Nullable strings use `nullableText`. Envelope is
`apiResponseSchema` (`ApiResponse<T>`). Dates are not present.

### Country — `GloCountryLookupDto`

| Field | Type | Nullability |
| --- | --- | --- |
| countryCode | string | nullable |
| countryName | string | nullable |
| currencyCode | string | nullable |

Response: `ApiResponse<GloCountryLookupDto[]>`.

### State/province — `GloStateProvinceLookupDto`

| Field | Type | Nullability |
| --- | --- | --- |
| id | number (int32) | required |
| countryCode | string | nullable |
| stateProvinceCode | string | nullable |
| stateProvinceName | string | nullable |

Response: `ApiResponse<GloStateProvinceLookupDto[]>`.

### Cities — `PostalCodeCityLookupDto`

| Field | Type | Nullability |
| --- | --- | --- |
| city | string | nullable |

Response: `ApiResponse<PostalCodeCityLookupDto[]>`.

## Functional requirements

- **REQ-1** Contract file `libs/shared/contract/src/lib/geo-lookup.schema.ts` exports the three DTO schemas, response envelopes via `apiResponseSchema`, inferred types, and lookup params.
- **REQ-2** Contract barrel `src/index.ts` re-exports that file.
- **REQ-3** Data-access module `libs/shared/data-access/src/lib/geo-lookup/` with `*.endpoints.ts`, `*.keys.ts`, `*.queries.ts`, `index.ts`. No `*.mutations.ts` (swagger has no writes).
- **REQ-4** Endpoint strings equal swagger paths minus `/api/v{version}`: `/glo/country/lookup`, `/glo/stateprovince/lookup`, `/postalcode/cities`.
- **REQ-5** Queries: `load*` + `*QueryOptions`. Parse with contract schemas. `staleTime: 5 * 60 * 1000`. Default `activeOnly` to `true`.
- **REQ-6** Data-access lib barrel exports the module. Module `index.ts` re-exports factories and the contract types.
- **REQ-7** MSW `libs/shared/mocks/src/handlers/geo-lookup.ts` registered **before** `postalCodeHandlers` so `/postalcode/cities` is not swallowed by `/postalcode/:id`. Seed includes at least one inactive row per resource so `activeOnly` is testable. Cities handler honors `countryCode` / `stateProvinceCode`.
- **REQ-8** Fixtures in `tools/integration/src/fixtures/geo-lookup-response.ts` and a `describe` covering all three querystrings.

## File map

| Layer | Path |
| --- | --- |
| Contract | `libs/shared/contract/src/lib/geo-lookup.schema.ts` |
| Data-access | `libs/shared/data-access/src/lib/geo-lookup/` |
| MSW | `libs/shared/mocks/src/handlers/geo-lookup.ts` |
| Tests | `tools/integration/src/geo-lookup.integration.test.ts` |

Folder names are kebab-case (`geo-lookup`). Endpoint paths stay swagger-literal.

## Verification

- `pnpm exec nx lint shared-contract shared-data-access shared-mocks`
- `tsc --noEmit` on those projects if Nx reports `No tasks were run`
- `pnpm run test:query`

## Open questions / assumptions

- Assumed operations = GET only, as swagger.
- Assumed no form schema until a screen exists.
- Country/state swagger omits tenant headers; `customFetch` still sends them globally.
