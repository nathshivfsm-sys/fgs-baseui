# Implementation Plan — [Resource] catalog API

**Source spec:** `.claude/context/features/<resource>-catalog-api-prd.md`
**Reference:** `libs/settings/data-access/src/lib/tax/` (or named sibling)
**MFE:** `@cms/<mfe>-contract` + `@cms/<mfe>-data-access`

## Resolved assumptions

- Operations taken from swagger; no extra verbs.
- No form schema / page in this pass.

## Task breakdown

| # | Task | REQ | File(s) | Depends on |
| --- | --- | --- | --- | --- |
| 1 | Contract Zod DTOs + types + list params | REQ-1, REQ-2 | `libs/<mfe>/contract/src/lib/<kebab>.schema.ts`, `src/index.ts` | — |
| 2 | Endpoints, keys, queries, mutations, module barrel | REQ-3–REQ-7 | `libs/<mfe>/data-access/src/lib/<kebab>/*`, `src/index.ts` | 1 |
| 3 | MSW seed + CRUD handlers | REQ-8 | `libs/shared/mocks/src/handlers/<kebab>.ts`, `handlers/index.ts` | 1 |
| 4 | Fixtures + integration `describe` | REQ-9 | `tools/integration/src/fixtures/setup-catalog-response.ts`, `setup-catalog.integration.test.ts` | 2 |
| 5 | `test:query` + typecheck/lint | — | — | 1–4 |

## Out of scope this pass

- UI, form schema, Storybook, live API browser pass.

## Notes for review

- Querystring assertion order follows `Object.entries` insertion order in
  `toSearchParams` (see Tax list test).
