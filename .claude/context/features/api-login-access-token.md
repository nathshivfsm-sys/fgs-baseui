# Real login: fetch `accessToken` from `/auth/refresh`

Branch `feature/api-login-access-token`, branched from `feature/edit-company-settings`
at `fb8a387`. Local development only.

| Commit    | Scope                                                                      |
| --------- | -------------------------------------------------------------------------- |
| `c529d44` | `feat(auth-data-access)` — the new lib, Zod schema, `refreshAccessToken()`  |
| `7c62ecd` | `feat(shell)` — Authenticate adapter, bootstrap wiring, env-gated dev proxy |
| `1c05bbd` | `docs` — `current-feature.md`                                              |

## 1. Why

Authentication was a placeholder. `authenticateDemoUser` compared an email and password
**in the browser** and returned a fake token (`'demo-token.not-a-real-jwt'`) and a fake
user ("Alex Morgan"). Its own doc comment named the exit route:

> When a real endpoint exists, write an `Authenticate` that calls it and pass that to
> `AuthProvider`; this module is then deleted outright rather than edited.

This change does exactly that, without editing `@cms/shared-auth` at all.

## 2. What happens now when you click Next

1. `LoginPage` calls `login()` from `useAuth()` — unchanged.
2. `AuthProvider` delegates to the `authenticate` adapter it was given at bootstrap,
   which is now `authenticateWithApi` instead of the demo default.
3. The adapter POSTs `{ refreshToken }` to `/auth/refresh`.
4. The response is Zod-parsed and mapped onto the existing `AuthSession`.
5. `AuthProvider` writes that session to `sessionStorage` and re-renders; `LoginPage`
   sees `isAuthenticated` and redirects.

### Response to `UserDetails` mapping

| `AuthSession` field | Source                                                              |
| ------------------- | ------------------------------------------------------------------- |
| `token`             | `data.accessToken`                                                  |
| `user.id`           | `data.user.userId`                                                  |
| `user.displayName`  | `firstName` + `lastName`, trimmed, falling back to `email`          |
| `user.email`        | `data.user.email`                                                   |
| `user.role`         | `data.user.roles[0]`, title-cased (`TENANT_ADMIN` to `Tenant Admin`) |

## 3. Files

| File                                          | Change                                                                  |
| --------------------------------------------- | ----------------------------------------------------------------------- |
| `libs/shared/auth-data-access/**`             | **new lib** `@cms/auth-data-access` — schema, fetch fn, README           |
| `apps/shell/src/lib/authenticate-with-api.ts` | **new** — the `Authenticate` adapter and DTO mapping                     |
| `apps/shell/src/bootstrap.tsx`                | one line: `<AuthProvider authenticate={authenticateWithApi}>`            |
| `apps/shell/vite.config.ts`                   | env-gated dev proxy; config becomes a function so it can use `loadEnv`   |
| `apps/shell/src/vite-env.d.ts`                | typed `ImportMetaEnv` for the three variables                            |
| `apps/shell/.env.example`                     | **new** — committed template                                             |
| `apps/shell/.env.local`                       | **not committed** — gitignored, holds the credential                     |
| `tsconfig.base.json`, `.storybook/aliases.ts`, `apps/shell/package.json` | register the new lib          |

**Untouched, and worth noting they did not need to be:** `custom-fetch.ts`, `session.ts`,
`auth-context.tsx`, `require-auth.tsx`, `runtime.ts`, `App.tsx`, `AppShell`, `TopNav`,
`LoginPage.tsx`.

## 4. Token propagation needed no new code

The requirement was for the access token to reach _every_ private endpoint. That path
already existed and was simply carrying a fake token:

- `apps/shell/src/runtime.ts` calls `configureCustomFetch({ getAuthToken: getSessionToken })`.
- `getSessionToken` re-reads storage on **every** request, so it is never stale relative
  to when a request fires.
- `@cms/shared-api` is a Module Federation **singleton**, so that one call configures the
  host _and_ all four remotes.

Verified rather than assumed: the dev server's transformed output shows the adapter
importing `ApiError` through a `loadShare` call, not through a `resolve.alias` — the exact
failure mode that broke `@cms/shared-auth` previously (see `libs/shared/auth/README.md`).

## 5. Decisions taken

- **The fixed refresh token is sent on every login.** The rotated `refreshToken` in the
  response is discarded, as are `idToken` and `expiresIn`.
- **The login form is unchanged.** The endpoint accepts only `refreshToken`, so the typed
  email is never sent — the identity is whoever the token belongs to.
- **`demo-credentials.ts` is kept, not deleted.** `AuthProvider`'s `authenticate` prop
  still defaults to it, which is what lets every Storybook story run with no network.
- **`tenantId` (52) is not wired in.** The shell's tenant drives a `TENANT_NAMES` lookup
  in `store/constants.ts`; reconciling a numeric tenant id with that is a separate
  decision.

## 6. Keeping local-only wiring out of other environments

Two mechanisms, both gated so nothing local can reach `develop` or a deployment by
accident rather than by someone remembering to remove it.

### The refresh token cannot ship in a bundle

**This was a real leak, found by grepping `dist/`.** Vite inlines every
`import.meta.env.VITE_*` reference as a string literal at build time, so `vite build` on
any machine holding a `.env.local` wrote the credential straight into `bootstrap-*.js`:

```
=== refresh token in build output? ===
dist/assets/bootstrap-CNV5tvb-.js
FOUND - LEAK
```

`authenticateWithApi` now early-returns behind `if (!import.meta.env.DEV)`. That
expression is replaced with `false` in a build, making the token read dead code the
minifier drops. Re-verified on a fresh build: token absent, hostname absent, and the
guard's message **present** — which proves the retained branch is the guard rather than
the minifier having eliminated the wrong side.

### CORS, and why the proxy cannot leak

The dev API sends no CORS headers for a `localhost` origin, so the browser blocks a direct
call. The dev server proxies `/api/v1` instead and `VITE_API_URL` is the relative
`/api/v1`; `customFetch` only concatenates `baseUrl + endpoint`, so no application code
knows the difference.

The target is read from `VITE_DEV_API_PROXY_TARGET` via `loadEnv` rather than hardcoded,
so **no API hostname appears in any committed source file**, and any environment that does
not set the variable gets no proxy at all. `server.proxy` is also a dev-server option that
never appears in build output. Both branches were verified against a running server:

| `VITE_DEV_API_PROXY_TARGET` | `GET /api/v1/auth/refresh` returns     |
| --------------------------- | -------------------------------------- |
| set                         | `server: nginx`, `401` — the real API  |
| empty                       | Vite's HTML fallback — no proxy exists |

**A deployed build still needs its own answer**: `VITE_API_URL` pointed at an absolute API
origin, and that host allowing the deployed origin. The proxy solved localhost only.

## 7. Verification

- `typecheck` clean; `lint` clean (new lib and `shell`); `test:query` 8/8; shell
  production build clean via `vite build`.
- `storybook:test`: **227/237, identical to a baseline run at `fb8a387`** — the same 10
  failures in the same 3 files (`TopNav.stories.tsx` x6, `settings/App.stories.tsx` x3,
  `LoginPage.stories.tsx > Successful Login` x1). All pre-existing; this change adds none.
  The LoginPage one is a route mismatch inside the story: `LoginPage` redirects to
  `/today`, which the story's `MemoryRouter` does not declare.
- **`nx build shell` cannot complete through Nx.** Its dependency `ui:build` fails at
  `HEAD` on an unrelated pre-existing TS error —
  `libs/ui/src/spike/dispatch-board/DispatchBoardSpike.tsx:419`, `slotLabelFormat` not in
  `ViewOptions` (last touched by `5a3fc37`). The shell's own Vite build is clean.
- Browser check was run by the user, not scripted. It surfaced the CORS failure that
  produced the proxy; the post-fix confirmation was the user's and is **not captured in
  this repo**. A scripted Playwright pass, as the login redesign had, is still owed.

## 8. Follow-ups

- **Rotate the refresh token on the IdP.** It is a live dev-tenant credential and has
  passed through a chat transcript. Keeping it out of git limits the damage; it does not
  undo the exposure.
- Add the scripted browser pass described above.
- The four remotes' `standalone-runtime.ts` still call `configureCustomFetch` without
  `getAuthToken`, so standalone dev servers send no bearer token. Harmless today — every
  data-access lib returns mocks — but worth parity when a real endpoint is consumed.
- No refresh-on-expiry. An expired access token surfaces as a failed request, not a silent
  renewal.
