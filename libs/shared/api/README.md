# @cms/shared-api

The single sanctioned way to call APIs from this workspace, per
`context/coding-standards.md`. Wraps native `fetch` with auth-header injection and a
typed `ApiError` on non-OK responses.

## Status: provisional

One real caller so far. `@cms/auth-data-access` calls a live endpoint
(`POST /auth/refresh`, see `context/features/api-login-access-token.md`). Settings catalog
APIs in `@cms/settings-data-access` also go through `customFetch` and parse with
`@cms/settings-contract`. `workorder-data-access` and `lead-data-access` still return
static mock data without going through `customFetch`. This library existed
ahead of that first caller so the fetch layer would be ready, per
`context/features/monorepo-architecture-remediation-prd.md`.

Two things that first real caller established:

- `baseUrl` may be **relative** (`/api/v1`), not just an origin. The dev server proxies
  it to dodge CORS, and `customFetch` concatenating `baseUrl + endpoint` is what makes
  that switch invisible to callers.
- A call made before a session exists is normal: `getAuthToken` returning `undefined`
  omits the header rather than sending an empty one, which is what lets the login
  request itself go through this wrapper.

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
functions. This library does not validate response shapes — colocate a Zod schema in
the owning MFE's `contract` library (`@cms/<mfe>-contract`) and parse the result in
that MFE's data-access lib.
