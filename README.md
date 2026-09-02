# CMS micro-frontends

Minimal Nx 23 + React 19 CMS using Vite Module Federation.

## Projects

- `shell` (port 4200): layout, router, runtime config, Zustand store, QueryClient
- `workorder` (port 5101): independently built federated provider
- `lead` (port 5102): independently built federated provider
- `invoice` (port 5103): independently built federated provider
- `@cms/ui`: publishable shadcn-style React library with Tailwind v4
- `@cms/platform-contract`: publishable runtime contract library
- `@cms/shared-api`: `customFetch` wrapper and typed `ApiError`
- `@cms/workorder-data-access`, `@cms/lead-data-access`: fetch functions, query hooks,
  key factories, and Zod schemas for their domain

Add a new remote with `pnpm exec nx g ./tools/generators/remote-app:remote-app <name>`;
it prints the sidebar wiring for you to apply by hand.

## Styling architecture

Tailwind CSS v4 is configured in CSS rather than a JavaScript config file. Shared
semantic tokens and base styles live under `libs/ui/src/styles`; each independently
built application keeps a small compiler entry in `apps/*/src/styles.css` so it can
run standalone or through Module Federation. The UI JavaScript barrel has no global
CSS side effects.

Use semantic color utilities (`bg-background`, `text-muted-foreground`,
`text-destructive`) instead of palette colors. The theme reflects the Pricing and Work
Order Figma systems: `primary` is the Work Order interaction color, while `brand` is
the Pricing navigation/brand color; subtle surfaces, table, form, status, and text
roles are exposed separately. Inter is the single application font, self-hosted and
declared once in `libs/ui/src/styles/font.css` — the only file in the repo that names
a typeface. Swap the font there and every app plus Storybook follows; no component
change is needed. Use `font-sans` for type and `tabular-figures` where digits need to
align in columns (record codes, amounts, counts).
Shared product-level values such as `max-w-app`, `max-w-content`, `p-page`,
`h-control`, and `w-sidebar` are defined in `libs/ui/src/styles/theme.css`. Exact
Figma light values and intentionally derived dark values are maintained together in
`tokens.css`.

## Data fetching architecture

`libs/platform-contract/src/lib/query-client.ts` is the single source of React Query
client defaults and lifecycle helpers. The shell creates one module-scoped client for
the browser page and passes it through `CmsRuntime`; hosted MFEs must use that client
and must never clear it when an individual remote unmounts. A standalone MFE creates
one module-scoped client with `createCmsQueryClient()` and owns that isolated cache for
its page lifetime. Storybook and tests create isolated clients and clear them during
teardown.

Shared defaults are 30 seconds stale time, 10 minutes garbage collection, one query
retry with capped exponential delay, no mutation retries, reconnect refetching, and no
window-focus refetching. Hosts can pass `onError` to the factory for telemetry. Feature
components remain responsible for user-facing errors. Endpoint-specific behavior
belongs in a feature-local `queryOptions` factory rather than another QueryClient.

Query keys must start with a unique feature scope and include every variable that
changes the response. Keep key factories and query option factories inside the owning
MFE. Invalidate the narrowest key possible; cross-feature prefix invalidation requires
an explicit product reason. Query functions receive TanStack Query's `AbortSignal` and
must pass it to network clients that support cancellation.

**SSR is planned, not implemented.** There is no server entry, `renderToString` call, or
dehydrate/hydrate boundary anywhere in this repo yet; every QueryClient described above
runs client-side. Run `pnpm run test:query` to verify shared defaults, request
deduplication, cancellation, cache sharing, standalone isolation, tenant scoping, and
error callbacks.

## Run locally

Node 20.19+ and pnpm are required. With nvm and corepack:

```bash
nvm use
corepack enable
pnpm install
pnpm run dev
```

Open http://127.0.0.1:4200. The shell reads remote URLs from
`apps/shell/public/config.json` at runtime.

## Validate

```bash
pnpm run format:check
pnpm run lint
pnpm run typecheck
pnpm run build
pnpm run test:query
pnpm run storybook:typecheck
pnpm run storybook:build
pnpm run storybook:test
```

`pnpm run lint` and `pnpm run typecheck` run against every project; use
`pnpm exec nx affected -t <target>` to run only what changed relative to a base branch,
which is what CI does. `test:query` currently covers only the shared QueryClient
factory (`tools/integration`) — `workorder`, `lead`, and `invoice` have no
component-level tests yet.

## Storybook

Run `pnpm run storybook` and open http://localhost:6006. The workspace uses one
Storybook owned by `@cms/ui`; it discovers shared component stories in
`libs/ui/src` and feature-composition stories in `apps/*/src`.

Conventions:

- Colocate files as `component-name.stories.tsx`; title shared primitives as
  `Components/Name` and application compositions as `Features/Area`.
- Prefer typed args and controls over one story per prop combination. Add
  explicit stories for meaningful loading, empty, error, disabled, and layout
  states.
- Keep fixtures in `.storybook/fixtures`. Use `withCmsRuntime` for components
  that need the platform store or QueryClient so every story gets isolated
  state.
- Use `play` functions from `storybook/test` for important keyboard and user
  flows. Accessibility checks run for every story and fail component tests on
  violations.
- Import production global styles in `.storybook/preview.css`; configure global
  providers and decorators in `.storybook/preview.ts`, not in individual
  stories.

Before running browser tests locally or in CI for the first time, install the
pinned Chromium browser with `pnpm exec playwright install chromium`. CI runs this
install step plus `pnpm run storybook:typecheck`, `pnpm run storybook:build`, and
`pnpm run storybook:test` in its slow lane — see `.github/workflows/ci.yml`.

## Production notes

Each app builds and deploys to its own `dist` directory, but `@cms/ui` and
`@cms/platform-contract` are not yet consumed as published packages: each library's
`package.json` `exports` points at its own `libs/*/src` source, which the apps reach
through the pnpm workspace symlink, so each app's build compiles its own copy from
source. Changing either library currently requires rebuilding all four apps, not just
the ones with a version bump to pick up — `nx release` and the Verdaccio
`local-registry` target exist for closing this gap but are not yet wired into a script
or CI job. Module Federation's `shared` config deduplicates the _runtime_ singleton
between the shell and its remotes; only the build-time dependency is source-resolved.

No `vite.config.ts` may add a `resolve.alias` for a `@cms/*` package. An alias rewrites
the bare specifier before `@module-federation/vite` can wrap the import in `loadShare`,
which silently defeats `singleton: true` — see `tools/module-federation/shared.ts`.
Storybook is the one exception (`.storybook/aliases.ts`); it has no Module Federation,
and the workspace root declares no `@cms/*` dependencies to resolve through.

Replace the shell's `config.json` with immutable, versioned remote URLs when
deploying. Cache hashed chunks for a long time, but serve `config.json` and
remote entry files with short/no cache. The shell creates one Zustand store and
one TanStack QueryClient, then passes both to providers through `CmsRuntime`;
providers only create local instances in standalone mode.

`apps/shell/public/config.json` (shown below for local dev) is copied into
`apps/shell/dist` at build time and fetched at runtime by
`apps/shell/src/config.ts` — replace it per environment as part of deploying the
shell, alongside each remote's own `dist`:

```jsonc
// Local dev — apps/shell/public/config.json
{
  "environment": "development",
  "remotes": {
    "workorder": { "name": "workorder", "entry": "http://localhost:5101/remoteEntry.js" },
    "lead": { "name": "lead", "entry": "http://localhost:5102/remoteEntry.js" },
    "invoice": { "name": "invoice", "entry": "http://localhost:5103/remoteEntry.js" },
  },
}
```

```jsonc
// Staging — versioned, immutable remote entry URLs per deploy
{
  "environment": "staging",
  "remotes": {
    "workorder": { "name": "workorder", "entry": "https://staging-workorder.example.com/v1.4.2/remoteEntry.js" },
    "lead": { "name": "lead", "entry": "https://staging-lead.example.com/v1.4.2/remoteEntry.js" },
    "invoice": { "name": "invoice", "entry": "https://staging-invoice.example.com/v1.4.2/remoteEntry.js" },
  },
}
```

```jsonc
// Production — same shape, production hosts and versions
{
  "environment": "production",
  "remotes": {
    "workorder": { "name": "workorder", "entry": "https://workorder.example.com/v1.4.2/remoteEntry.js" },
    "lead": { "name": "lead", "entry": "https://lead.example.com/v1.4.2/remoteEntry.js" },
    "invoice": { "name": "invoice", "entry": "https://invoice.example.com/v1.4.2/remoteEntry.js" },
  },
}
```
