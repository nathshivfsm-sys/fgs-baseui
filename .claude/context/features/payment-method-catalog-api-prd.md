# Payment Method catalog API

**Swagger:** `https://100.31.187.221/swagger/setup/v1/swagger.json` tag `PaymentMethod`
**Owning MFE:** settings
**Reference module:** Timeslot (lookup filters) / Source (flat DTO)
**Scope:** contract DTOs, data-access factories, MSW handlers, integration tests

## Overview

Adds the FGS Setup Service `/paymentmethod` catalog to `@cms/settings-contract` and
`@cms/settings-data-access` so Settings can later list, look up, create, update,
and patch payment methods. Same four-layer stack as Timeslot. No screen in
this pass.

## Source

| Item | Value |
| --- | --- |
| OpenAPI | `https://100.31.187.221/swagger/setup/v1/swagger.json` |
| Tag | `PaymentMethod` |
| Collection path | `/paymentmethod` (after stripping `/api/v{version}`) |
| Operations | list GET, detail GET, lookup GET, POST, PUT, PATCH |

List query params beyond `SetupListParams`: `displayName`.

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

Copied from swagger `FgsSetupPaymentMethod*` DTOs. Nullable strings use `nullableText`.
Non-nullable numbers and booleans stay required on summary, detail, create, and update.
Patch fields are nullish.

### Summary / Detail

| Field | Type | Nullability |
| --- | --- | --- |
| id | number | required |
| displayName | string | nullable |
| sortOrder | number | required |
| isMobileVisible | boolean | required |
| isCustomerPortalVisible | boolean | required |
| isActive | boolean | required |

Summary and detail share the same fields.

### Lookup

| Field | Type | Nullability |
| --- | --- | --- |
| id | number | required |
| displayName | string | nullable |
| sortOrder | number | required |

### Create / Update

`displayName` (nullable string), `sortOrder` (required number), `isMobileVisible` and `isCustomerPortalVisible` (required booleans).

### Patch

Create fields, each nullable, plus `isActive` (`boolean`, nullable).

### List params

`SetupListParams` plus `displayName?`.

### Lookup params

`activeOnly?` (default `true`), `isMobileVisible?`, `isCustomerPortalVisible?`.

## Functional requirements

- **REQ-1** Contract file `libs/settings/contract/src/lib/payment-method.schema.ts` exports summary/detail/lookup/create/update/patch schemas, response envelopes via `setupResponseSchema` / `pagedResultSchema`, inferred types, `PaymentMethodListParams`, and `PaymentMethodLookupParams`.
- **REQ-2** Contract barrel `src/index.ts` re-exports that file.
- **REQ-3** Data-access module `libs/settings/data-access/src/lib/payment-method/` with `*.endpoints.ts`, `*.keys.ts`, `*.queries.ts`, `*.mutations.ts`, `index.ts` matching Timeslot (no `*.form.ts`).
- **REQ-4** Collection endpoint is `/paymentmethod`. Lookup is registered before `:id` (MSW handler order).
- **REQ-5** Queries: `loadPaymentMethods` + `paymentMethodListQueryOptions` / `Detail` / `Lookup`. List maps through `toPagedResult` so `items: null` becomes `[]`.
- **REQ-6** Mutations: create POST, update PUT, patch PATCH; each invalidates `paymentMethodKeys.all`.
- **REQ-7** Data-access lib barrel exports the module. Module `index.ts` re-exports factories and the contract types.
- **REQ-8** MSW `libs/shared/mocks/src/handlers/payment-method.ts` appended in `handlers/index.ts`. Writes parse with contract create/update/patch schemas. Session-persisted seed.
- **REQ-9** Fixtures in `tools/integration/src/fixtures/setup-catalog-response.ts` and a `describe('payment method through customFetch')` covering list querystring + create invalidation.

## File map

| Layer | Path |
| --- | --- |
| Contract | `libs/settings/contract/src/lib/payment-method.schema.ts` |
| Data-access | `libs/settings/data-access/src/lib/payment-method/` |
| MSW | `libs/shared/mocks/src/handlers/payment-method.ts` |
| Tests | `tools/integration/src/setup-catalog.integration.test.ts` |

Folder name is `payment-method`. Endpoint path stays swagger-literal (`/paymentmethod`).

## Verification

- `pnpm exec nx lint settings-contract settings-data-access shared-mocks`
- `tsc --noEmit` on those projects if Nx reports `No tasks were run`
- `pnpm run test:query`

## Open questions / assumptions

- Assumed operations = exactly the verbs present in swagger.
- Assumed no form schema until a screen exists.
- Swagger does not mark a `required` array. Non-nullable scalars are treated as required, matching Timeslot.
