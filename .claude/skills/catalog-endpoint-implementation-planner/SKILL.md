---
name: catalog-endpoint-implementation-planner
description: >-
  Turns a catalog-endpoint PRD into an ordered plan and repo-styled code for
  contract DTOs, data-access factories, MSW handlers, and integration tests.
  Use when the user says implement a catalog API spec, add endpoints from
  swagger like Tax, clone the tax/zone/non-working-date module, or "create
  endpoints for X from swagger". Do not use this to write the spec (use
  catalog-endpoint-spec-writer) or to build a UI screen (use
  feature-implementation-planner).
---

# Catalog Endpoint Implementation Planner

Implements one swagger catalog resource as the four-layer stack already used
for Tax, TaxAuthority, Zone, and NonWorkingDate.

Spec and code stay separate: read or write the PRD first
(`catalog-endpoint-spec-writer`), then plan, then code.

Pattern details (file names, Zod mapping, MSW order) live in
[references/pattern.md](references/pattern.md). Read it before editing files.

## Workflow

### Step 1: Locate the spec

Read the PRD in `.claude/context/features/` or this conversation. If none
exists, run `catalog-endpoint-spec-writer` (or write that PRD yourself from
swagger) before inventing fields.

### Step 2: Clone a real sibling

Open the reference module named in the PRD (default Tax):

- `libs/settings/contract/src/lib/tax.schema.ts`
- `libs/settings/data-access/src/lib/tax/` (five files)
- `libs/shared/mocks/src/handlers/tax.ts`

Copy structure and naming, substituting the new resource. Do not invent a
new split (no extra `types.ts`, no hooks, no form schema unless the PRD
requires a screen).

### Step 3: Plan

Fill [references/implementation_plan_template.md](references/implementation_plan_template.md).
Show the plan in chat when the resource is unusual (extra verbs, nested
lines like Tax `taxDetails`, a new MFE without a contract lib). For a
standard list/detail/lookup/POST/PUT/PATCH Settings resource, plan and code
are the same short unit — implement without waiting.

### Step 4: Implement in order

1. Contract schema + barrel export
2. Data-access module + lib barrel export
3. MSW handler + `handlers/index.ts`
4. Integration fixtures + `describe`
5. Verify

Match existing formatting. Re-export contract types from the data-access
module `index.ts` the same way Tax does. Parse every response with the
contract schema after `customFetch`.

### Step 5: Verify

- `pnpm run test:query`
- Lint + typecheck the touched projects. If `nx run-many` prints
  `No tasks were run`, run `tsc --noEmit -p <tsconfig>` on
  `libs/<mfe>/contract`, `libs/<mfe>/data-access`, and `libs/shared/mocks`.

### Step 6: Wrap up

List created/modified files mapped to REQ numbers. Call out deferred UI.
Do not expand into a page, form, or Storybook unless the spec says so.

## Guardrails

- Wire DTOs only in `@cms/<mfe>-contract`. MSW and UI import from there.
- Options factories, not `useQuery` hooks. Mutation invalidates its own
  `<resource>Keys.all`.
- Endpoint path = swagger path minus `/api/v{version}`.
- Folder kebab-case; swagger path may omit hyphens (`tax-authority` folder,
  `/taxauthority` endpoint).
- Portable paths: no `< > : " | ? *`, no `<%= %>` in file names.
