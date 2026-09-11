# `@cms/auth-data-access`

The token exchange behind the login screen: `POST /auth/refresh`, trading a refresh token
for an access token and the caller's identity.

## Why this is a separate library from `@cms/shared-auth`

`@cms/shared-auth` owns _session mechanics_ — the React context, the route guard, storage.
It has no Zod dependency and no network code, and `context/coding-standards.md` puts
`customFetch` + Zod in a `data-access` library rather than in a React library or in
`@cms/shared-api`. Splitting them keeps that boundary intact: this library knows the wire
format and nothing about React, and `shared-auth` knows about React and nothing about the
wire format. The adapter that joins them lives in the consuming app
(`apps/shell/src/lib/authenticate-with-api.ts`).

It is deliberately **not** registered in `tools/module-federation/shared.ts`. The module is
stateless — it exports two functions and a schema, holds no identity across the federation
boundary — and only the shell imports it, so there is nothing to share.

## The one unauthenticated call in the workspace

`customFetch` omits the `Authorization` header when `getAuthToken()` returns `undefined`,
which is exactly right here: this call is what _creates_ the session, so there is no token
to send yet. Every other call in the workspace runs the other way round.

```ts
const session = await refreshAccessToken(refreshToken);
// -> { accessToken, tokenType, user: { userId, firstName, lastName, email, roles } }
```

## Validation

`refreshAccessToken` types its `customFetch` call as `unknown` and lets the Zod parse, not
the type parameter, establish the shape — `customFetch` returns `Promise<T>` on trust, so
a type argument there would be an assertion, not a guarantee.

The schema models only the fields something actually consumes. Zod strips unknown keys,
so `refreshToken`, `idToken`, `expiresIn`, `permissions`, `dataAccess` and
`publicEndpoints` all come back from the API and are dropped without being listed. Add
them here when a consumer appears — not before.

Two ids are consumed. Both arrive as numbers and are coerced to strings:

- `user.tenantId` → `AuthSession.tenantId` → sent as `X-Tenant-Id` on every request via
  `configureCustomFetch({ getTenantId: getSessionTenantId })` in the shell. The API
  answers `400 "Tenant context is required. Include the X-Tenant-Id header."` without it.
- `user.companyId` → `UserDetails.companyId` → the path key for `/company/{companyId}`
  (the Settings › General Info screen).

## Status: local development only

This is not a credential exchange. The endpoint takes a refresh token and nothing else, so
whoever holds that token _is_ the identity — the email typed into the login form is never
sent. The shell supplies a fixed token from a gitignored `.env.local`, guarded behind
`import.meta.env.DEV` so Vite cannot inline it into a production bundle.

Consequences worth knowing before this grows:

- **No rotation.** The response contains a fresh `refreshToken`, which is discarded by
  decision. If the API ever invalidates the previous one, the configured token stops
  working and has to be replaced by hand.
- **No expiry handling.** `expiresIn` is ignored and there is no refresh-on-401 retry, so
  an expired access token surfaces as a failed request rather than a silent renewal.
- **No token endpoint for a real user.** When one exists, add its fetch function here and
  swap the adapter in `apps/shell`; nothing in `@cms/shared-auth` changes.
