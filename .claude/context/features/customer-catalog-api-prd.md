# Customer catalog API (CRM)

## Summary

Wire the CRM `/customer` resource for the lead MFE: contract DTOs, data-access factories, MSW handlers, and `test:query` integration coverage. UI is out of scope.

## Swagger

- Source: `https://api-dev.fieldwhizey.com/swagger/crm/v1/swagger.json`
- Tag: `Customer`
- Path prefix: `/customer` (relative to `/api/v1`)

## Operations

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/customer` | Paged list with optional dashboard `summary` |
| GET | `/customer/lookup` | Lookup (`activeOnly`) |
| GET | `/customer/{id}` | Detail |
| POST | `/customer` | Create (`CrmCustomerCreateResultDto`) |
| PUT | `/customer/{id}` | Full update |
| PATCH | `/customer/{id}` | Partial update |

List query params beyond shared paging: `customerNumber`, `name`, `displayName`, `isPreferred`, `includeSummary`.

Nested `/customer/{id}/servicelocation*` routes are deferred to a follow-up resource.

## Layers

1. `@cms/lead-contract` — `customer.schema.ts`
2. `@cms/lead-data-access` — `src/lib/customer/*`
3. `@cms/shared-mocks` — `handlers/customer.ts`
4. `tools/integration` — `crm-customer.integration.test.ts`
