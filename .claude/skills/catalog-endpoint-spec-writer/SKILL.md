---
name: catalog-endpoint-spec-writer
description: >-
  Writes a PRD for adding a Setup/catalog API resource as contract DTOs,
  data-access query/mutation factories, MSW handlers, and integration tests.
  Use when the user pastes a swagger URL/tag, asks to spec catalog endpoints,
  or wants contract + data-access + MSW + test:query coverage without a UI
  screen — e.g. "spec nonworkingdate from swagger", "write a PRD for /tax",
  "document the new setup catalog resource".
---

# Catalog Endpoint Spec Writer

Turns a swagger resource (plus owning MFE) into a short PRD for the four-layer
catalog stack. This is not a product/UI spec — use `feature-spec-writer` when
the work includes a screen, Figma, or form.

The Settings reference is Tax:

- contract: `libs/settings/contract/src/lib/tax.schema.ts`
- data-access: `libs/settings/data-access/src/lib/tax/`
- MSW: `libs/shared/mocks/src/handlers/tax.ts`
- tests: `tools/integration/src/setup-catalog.integration.test.ts`

## Workflow

### Step 1: Gather inputs

Use what is already in the conversation. Ask only for what is missing:

1. **Swagger** — OpenAPI JSON URL or pasted resource. Prefer
   `/swagger/<service>/v1/swagger.json`, not the HTML `index.html`.
2. **Resource** — swagger tag and path prefix (e.g. `NonWorkingDate` /
   `/nonworkingdate`).
3. **Owning MFE** — default `settings` when the swagger is Setup Service.
   Lead/workorder/invoice get `libs/<mfe>/contract` + `libs/<mfe>/data-access`.
4. **Reference module** — default Tax for Settings. Pick a closer sibling
   (Zone, TaxAuthority) only when the DTO shape matches that sibling better.
5. **UI** — default out of scope. Confirm if the user also wants a screen;
   if yes, stop and run `feature-spec-writer` for the UI, keep this PRD as
   the API appendix.

If the idea is vague ("add some setup APIs"), ask which swagger tag(s).

### Step 2: Read swagger, not the UI page

On Windows, `curl` is `Invoke-WebRequest`. Fetch with `curl.exe -k`.

Extract for the resource only:

- Paths and HTTP methods (GET list, GET `{id}`, GET `lookup`, POST, PUT, PATCH)
- Query params beyond the shared `SetupListParams` (`page`, `pageSize`,
  `sortBy`, `sortDirection`, `search`, `isActive`)
- DTO schemas: Summary, Detail, Lookup, Create, Update, Patch
- Envelope: `ApiResponse<T>` / `PagedResult<T>`

Strip `/api/v{version}` from paths. `customFetch` `baseUrl` already carries
`/api/v1`, so the data-access endpoint is `/nonworkingdate`, not
`/api/v1/nonworkingdate`.

If fetch fails, ask for a paste of that tag's paths + component schemas.
Do not invent fields.

### Step 3: Draft the PRD

Use [references/prd_template.md](references/prd_template.md). Keep it short —
a catalog resource is one module, not a product feature.

Requirements must be testable and name the four layers:

1. Contract Zod DTOs in `@cms/<mfe>-contract`
2. Data-access factories matching the reference module's file split
3. One MSW handler file in `@cms/shared-mocks` using those contract schemas
4. Integration coverage in `tools/integration` (`test:query`)

Non-goals unless the user asked: page UI, form schemas, Storybook, live
browser against the API.

### Step 4: Save the file

Write to `.claude/context/features/<resource>-catalog-api-prd.md`.
Kebab-case the resource (`non-working-date-catalog-api-prd.md`).

### Step 5: Deliver

One-line summary of the resource, operations, and MFE. List open questions
that would change code (missing swagger fields, extra verbs, UI in/out).
Ask whether to run `catalog-endpoint-implementation-planner` next.

Do not start coding in this skill.
