# CMS micro-frontends

Minimal Nx 23 + React 19 CMS using Vite Module Federation.

## Projects

- `shell` (port 4200): layout, router, runtime config, Zustand store, QueryClient
- `workorder` (port 5101): independently built federated provider
- `lead` (port 5102): independently built federated provider
- `@cms/ui`: publishable shadcn-style React library with Tailwind v4
- `@cms/platform-contract`: publishable runtime contract library

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
roles are exposed separately. Geist is the application font and Inter remains
available as `font-form` for form patterns originating in the Pricing component set.
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

For SSR, create one QueryClient per request, prefetch and dehydrate it, then clear it
after the response. Never reuse the browser singleton between server requests. Run
`npm run test:query` to verify shared defaults, request deduplication, cancellation,
cache sharing, standalone isolation, tenant scoping, and error callbacks.

## Run locally

Node 20.19+ is required. With nvm:

```bash
nvm use
npm install
npm run dev
```

Open http://127.0.0.1:4200. The shell reads remote URLs from
`apps/shell/public/config.json` at runtime.

## Validate

```bash
npm run build
npm run test:query
npm run storybook:typecheck
npm run storybook:build
npm run storybook:test
npx tsc --noEmit -p apps/shell/tsconfig.json
npx tsc --noEmit -p apps/workorder/tsconfig.json
npx tsc --noEmit -p apps/lead/tsconfig.json
```

## Storybook

Run `npm run storybook` and open http://localhost:6006. The workspace uses one
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
pinned Chromium browser with `npx playwright install chromium`. CI should run
`npm ci`, that install command, `npm run storybook:typecheck`,
`npm run storybook:build`, and `npm run storybook:test`.

## Production notes

Deploy each app's `dist` directory independently. Replace the shell's
`config.json` with immutable, versioned remote URLs. Cache hashed chunks for a
long time, but serve `config.json` and remote entry files with short/no cache.
The shell creates one Zustand store and one TanStack QueryClient, then passes
both to providers through `CmsRuntime`; providers only create local instances
in standalone mode.
