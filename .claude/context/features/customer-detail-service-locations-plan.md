# Implementation plan — Customer Detail Service Locations

**Source PRD:** [customer-detail-service-locations-prd.md](customer-detail-service-locations-prd.md)

| Step | Status | Deliverable |
|------|--------|-------------|
| 1 | Done | `@cms/customer-contract` — `service-location.schema.ts` |
| 2 | Done | `@cms/customer-data-access` — `service-location/*` queries/endpoints/keys |
| 3 | Done | MSW — `libs/shared/mocks/src/handlers/service-location.ts` (501: 6 active, 2 inactive) |
| 4 | Done | Integration tests — `crm-customer.integration.test.ts` + fixtures |
| 5 | Done | Page constants — `constant/service-locations.ts`, `paths.ts` |
| 6–8b | Done | UI — section, empty state, table, filter, criteria bar |
| 9–10 | Done | Wired `CustomerDetailScrollSections` + `onCreateNewLocation` / Add Location → create path |
| 11 | Done | `BuildingIcon` empty state |
| 12 | Manual | QA on `/customers/501` (list) and `/customers/502` (empty) |

**Deferred:** Edit/View routes, create page at `/customers/:id/service-locations/new`.
