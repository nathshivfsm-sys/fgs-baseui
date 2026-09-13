# Catalog endpoint pattern

Clone Tax unless the PRD names a closer sibling.

## Layout

```text
libs/<mfe>/contract/src/lib/<kebab>.schema.ts
libs/<mfe>/contract/src/index.ts          # re-export

libs/<mfe>/data-access/src/lib/<kebab>/
  <kebab>.endpoints.ts
  <kebab>.keys.ts
  <kebab>.queries.ts
  <kebab>.mutations.ts
  index.ts
libs/<mfe>/data-access/src/index.ts       # export * from './lib/<kebab>'

libs/shared/mocks/src/handlers/<kebab>.ts
libs/shared/mocks/src/handlers/index.ts   # append handler array

tools/integration/src/fixtures/setup-catalog-response.ts
tools/integration/src/setup-catalog.integration.test.ts
```

Settings examples: `tax`, `tax-authority`, `zone`, `non-working-date`.

New MFE: create `libs/<mfe>/contract` (`@cms/<mfe>-contract`, tags
`type:lib`, `scope:<mfe>`, `type:contract`) before the first DTO. Copy
`envelope.schema.ts` from settings-contract if the service uses the same
`ApiResponse` / `PagedResult` envelope.

## Naming

| Thing | Rule | Example |
| --- | --- | --- |
| Folder / file prefix | kebab-case | `non-working-date` |
| Endpoint path | swagger literal, no `/api/v1` | `/nonworkingdate` |
| Keys / factories | camelCase | `nonWorkingDateKeys`, `loadNonWorkingDates` |
| Query meta.feature | kebab-case | `'non-working-date'` |
| MSW export | `<resource>Handlers` | `nonWorkingDateHandlers` |

## Contract Zod

Import `nullableText`, `pagedResultSchema`, `setupResponseSchema`,
`SetupListParams` from `envelope.schema.ts`.

- `id`: `z.number()`
- swagger `string` + `nullable: true`: `nullableText`
- swagger required `string` (create date, etc.): `z.string()`
- dates/date-times: `z.string()` (same as Tax `effectiveFromDate`)
- booleans/numbers: `z.boolean()` / `z.number()`, `.nullish()` on patch
- Detail often equals Summary; nest arrays only when swagger has them
- Lookup omits `isActive`
- List params: `SetupListParams & { extra?: string }`
- Responses: `setupResponseSchema(pagedResultSchema(summary))`,
  `setupResponseSchema(detail)`, `setupResponseSchema(z.array(lookup))`

Infer types with `z.infer`. Do not hand-write a parallel interface.

## Data-access

**endpoints** — `collection`, `list(params)`, `detail(id)`,
`lookup(activeOnly = true)` using `toSearchParams`.

**keys** — `all`, `lists/list`, `details/detail`, `lookups/lookup`.

**queries** — `customFetch<unknown>` then `schema.parse(body).data`. List
goes through `toPagedResult`. `staleTime: 5 * 60 * 1000` on detail and
lookup. Export `*QueryOptions` via `queryOptions`.

**mutations** — POST collection, PUT/PATCH detail. Parse detail envelope.
`onSuccess` → `queryClient.invalidateQueries({ queryKey: keys.all })`.
Export both the raw `createX` functions and `*MutationOptions`.

No `useQuery` / `useMutation` hooks. The screen (later) passes `queryClient`
from `runtime`.

## MSW

Copy `libs/shared/mocks/src/handlers/tax.ts` (or zone if the DTO is flat).

Handler **order**: `lookup` GET, then `/:id` GET/PUT/PATCH, then collection
GET, then POST. A `/:id` handler registered first will swallow `/lookup`.

Use `setupOk` / `setupError` / `pagedResult` / `readJsonObject` /
`assignDefined` / `nextId` from `./util`. Parse writes with contract
create/update/patch schemas. Seed 3–6 records; include at least one
`isActive: false` so lookup `activeOnly` is testable.

Register in `handlers/index.ts`.

## Integration tests

Add list/detail/lookup fixtures shaped like the swagger envelope
(`success`, `statusCode`, `data`, `errors: []`).

One `describe('<resource> through customFetch')` with:

1. List (and usually detail/lookup) — assert URL including querystring from
   `toSearchParams` insertion order, not sorted keys.
2. POST (or PATCH) — assert method, URL, and
   `queryClient.getQueryState(keys.list({}))?.isInvalidated`.

Stub `fetch` and `configureCustomFetch({ baseUrl: '/api/v1' })` like the
existing file. Do not start MSW in `test:query`.

## Swagger fetch (Windows)

```text
curl.exe -k -s "https://host/swagger/setup/v1/swagger.json" -o %TEMP%\setup-swagger.json
```

PowerShell `curl` is not curl. HTML `/swagger/setup/index.html` is not the spec.
