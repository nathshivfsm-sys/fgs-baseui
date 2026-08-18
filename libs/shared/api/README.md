# @cms/shared-api

The single sanctioned way to call APIs from this workspace, per
`context/coding-standards.md`. Wraps native `fetch` with auth-header injection and a
typed `ApiError` on non-OK responses.

## Status: provisional

No real backend exists in this workspace yet — `workorder-data-access` and
`lead-data-access` currently return static mock data without going through
`customFetch` at all. This library exists so the fetch layer is ready before the
next domain needs a real endpoint, per
`context/features/monorepo-architecture-remediation-prd.md`.

Because of that, `ApiError`'s shape and the error-body message extraction in
`custom-fetch.ts` are guesses at a reasonable REST error convention (`{ message:
string }`), not a contract negotiated against a real API. Expect this to change
once a backend exists — `ApiError` is deliberately a small, stable public surface
(`status`, `message`) so call sites shouldn't need to change even if the internal
error-body parsing does.

## Usage

Call `configureCustomFetch` once per runtime, before any query runs:

```ts
import { configureCustomFetch } from '@cms/shared-api';

configureCustomFetch({
  baseUrl: import.meta.env.VITE_API_URL ?? '',
  getAuthToken: () => currentUser.token, // once auth exists
});
```

Then call `customFetch<T>(endpoint, options)` from a `data-access` library's query
functions. This library does not validate response shapes — colocate a Zod schema
in the owning `data-access` library and parse the result there.
