# `@cms/shared-auth`

Session state and route guarding, shared by the shell host and every federated remote.

## Why it is a Module Federation singleton — and why it has no dev alias

`AuthProvider` publishes a React context that remotes consume. A React context is
identified by object identity, so a second copy of this module would give the remote its
own context object and `useAuth()` would throw `must be used within an AuthProvider`
even though the host is rendering one. It is therefore declared `singleton: true` in
`tools/module-federation/shared.ts`, alongside `react`, `react-dom`, and
`react-router-dom`.

**`singleton: true` alone is not enough**, and this cost real debugging time. Every other
`@cms/*` library also appears in `workspaceAliases()`, which rewrites the bare specifier
to an absolute source path. That rewrite happens _before_ the federation plugin can
replace the import with a `loadShare` call, so the module never reaches the shared scope
and each container quietly bundles its own copy — declared singleton or not. The plugin
reports it at build time:

```
[Module Federation] Detected alias conflicts with shared modules:
[Module Federation] Shared module "@cms/ui" is aliased by ... to ...
[Module Federation] This may cause runtime errors as the shared module will bypass
                    Module Federation's sharing mechanism.
```

That duplication is invisible for stateless libraries, which is why it went unnoticed
until this one. Two rules follow:

1. **`@cms/shared-auth` must not be added to `workspaceAliases()`.**
2. Its `package.json` `exports` therefore point at `./src/index.ts`, not the
   `./src/index.js` the other libraries name — resolution now really goes through
   node_modules (the pnpm workspace symlink), so the target has to be a file that
   exists. Vite resolves the symlink to a path inside the workspace and transpiles it
   like any other source file.

Verified end to end in a real browser against both the dev servers and the production
build: an anonymous visit to `/invoice` redirects to `/login`, while
`/invoice/payment/:invoiceId` renders.

## API

| Export                           | Purpose                                                                                               |
| -------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `AuthProvider`                   | Holds the session. Optional `authenticate` (credential adapter) and `initialSession` props.           |
| `useAuth()`                      | `{ isAuthenticated, user, login, logout }`. Throws outside a provider.                                |
| `RequireAuth`                    | Route guard element. Redirects to `LOGIN_ROUTE`, preserving the intercepted location in `state.from`. |
| `getSessionToken()`              | Non-React token read for `configureCustomFetch({ getAuthToken })`.                                    |
| `DEMO_*`, `authenticateDemoUser` | The throwaway credential check (see below).                                                           |

`initialSession` is three-valued: `undefined` hydrates from storage (the normal app
path), `null` forces an anonymous session, and a session object seeds an authenticated
one. The latter two exist for the standalone remote dev servers and for Storybook, which
have no login screen.

## Route guarding is per-route, not per-app

The guard is applied inside whichever app owns the route. `apps/invoice` mixes both in
one table — `payment/:invoiceId` is public so a customer can pay from an emailed link,
while the list and detail routes sit under `RequireAuth`. The shell mounts the remote
once, outside its own guard, and lets the remote decide.

The shell separately keeps `PUBLIC_ROUTE_PATTERNS` (`apps/shell/src/routes.ts`) to
choose _chrome_ — logo-only bar vs. the authenticated sidebar and top nav. That list is a
layout concern only and does not grant or deny access.

## This is not real authentication

Two pieces are deliberate placeholders, both isolated so a real backend replaces rather
than edits them:

- **`demo-credentials.ts`** compares a password in the browser. Replace it by passing a
  real `Authenticate` to `AuthProvider`; the provider, guard, and consumers are unaffected.
- **`session.ts`** persists the token in `sessionStorage` — per-tab and cleared when the
  tab closes, which is narrower than `localStorage` but still readable by any injected
  script. Production auth should keep no token in JavaScript-reachable storage at all:
  the server sets an `httpOnly` + `Secure` + `SameSite` cookie, at which point
  `getSessionToken` and the read/write helpers are deleted rather than rewritten.

Because `sessionStorage` is scoped to a single tab, there is no cross-tab session to keep
in sync and no `storage`-event listener here. Moving to `localStorage` would reintroduce
that requirement.
