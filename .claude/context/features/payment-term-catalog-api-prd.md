# Payment Term catalog API

**Swagger:** `https://100.31.187.221/swagger/setup/v1/swagger.json` tag `PaymentTerm`
**Owning MFE:** settings
**Reference module:** Source (flat DTO, lookup is `activeOnly` only)
**Scope:** contract DTOs, data-access factories, MSW handlers, integration tests

## Overview

Adds the FGS Setup Service `/paymentterm` catalog to `@cms/settings-contract` and
`@cms/settings-data-access` so Settings can later list, look up, create, update,
and patch payment terms. Same four-layer stack as Source. No screen in this pass.

## Source

| Item | Value |
| --- | --- |
| OpenAPI | `https://100.31.187.221/swagger/setup/v1/swagger.json` |
| Tag | `PaymentTerm` |
| Collection path | `/paymentterm` (after stripping `/api/v{version}`) |
| Operations | list GET, detail GET, lookup GET, POST, PUT, PATCH |

List query params beyond `SetupListParams`: `name`.

Lookup query params: `activeOnly` only (default `true`).

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

Copied from swagger `FgsSetupPaymentTerm*` DTOs. Nullable strings use `nullableText`.
`numberOfDays` is nullable on every DTO (`z.number().nullish()`). Non-nullable
booleans stay required on summary, detail, create, and update. Patch booleans
are nullish. `dueDateMethod` has no enum in swagger, so it stays a nullable string.

### Summary / Detail

| Field | Type | Nullability |
| --- | --- | --- |
| id | number | required |
| name | string | nullable |
| dueDateMethod | string | nullable |
| numberOfDays | number | nullable |
| isAccountsReceivable | boolean | required |
| isAccountsPayable | boolean | required |
| isMobileVisible | boolean | required |
| isActive | boolean | required |

Summary and detail share the same fields.

### Lookup

| Field | Type | Nullability |
| --- | --- | --- |
| id | number | required |
| name | string | nullable |

### Create / Update

`name` and `dueDateMethod` (nullable strings), `numberOfDays` (nullable number),
`isAccountsReceivable`, `isAccountsPayable`, and `isMobileVisible` (required booleans).

### Patch

Create fields, with booleans nullable, plus `isActive` (`boolean`, nullable).

### List params

`SetupListParams` plus `name?`.

## Functional requirements

- **REQ-1** Contract file `libs/settings/contract/src/lib/payment-term.schema.ts` exports summary/detail/lookup/create/update/patch schemas, response envelopes via `setupResponseSchema` / `pagedResultSchema`, inferred types, and `PaymentTermListParams`.
- **REQ-2** Contract barrel `src/index.ts` re-exports that file.
- **REQ-3** Data-access module `libs/settings/data-access/src/lib/payment-term/` with `*.endpoints.ts`, `*.keys.ts`, `*.queries.ts`, `*.mutations.ts`, `index.ts` matching Source (no `*.form.ts`).
- **REQ-4** Collection endpoint is `/paymentterm`. Lookup is registered before `:id` (MSW handler order).
- **REQ-5** Queries: `loadPaymentTerms` + `paymentTermListQueryOptions` / `Detail` / `Lookup`. List maps through `toPagedResult` so `items: null` becomes `[]`.
- **REQ-6** Mutations: create POST, update PUT, patch PATCH; each invalidates `paymentTermKeys.all`.
- **REQ-7** Data-access lib barrel exports the module. Module `index.ts` re-exports factories and the contract types.
- **REQ-8** MSW `libs/shared/mocks/src/handlers/payment-term.ts` appended in `handlers/index.ts`. Writes parse with contract create/update/patch schemas. Session-persisted seed.
- **REQ-9** Fixtures in `tools/integration/src/fixtures/setup-catalog-response.ts` and a `describe('payment term through customFetch')` covering list querystring + create invalidation.

## File map

| Layer | Path |
| --- | --- |
| Contract | `libs/settings/contract/src/lib/payment-term.schema.ts` |
| Data-access | `libs/settings/data-access/src/lib/payment-term/` |
| MSW | `libs/shared/mocks/src/handlers/payment-term.ts` |
| Tests | `tools/integration/src/setup-catalog.integration.test.ts` |

Folder name is `payment-term`. Endpoint path stays swagger-literal (`/paymentterm`).

## Verification

- `pnpm exec nx lint settings-contract settings-data-access shared-mocks`
- `tsc --noEmit` on those projects if Nx reports `No tasks were run`
- `pnpm run test:query`

## Open questions / assumptions

- Assumed operations = exactly the verbs present in swagger.
- Assumed no form schema until a screen exists.
- `dueDateMethod` is a free string. Swagger does not publish an enum.
