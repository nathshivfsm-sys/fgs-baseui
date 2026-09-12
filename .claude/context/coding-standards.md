# Coding Standards

## Project Overview & Tech Stack

- **Monorepo**: Nx (Integrated workspace)
- **Core Framework**: React 19+ with TypeScript (Strict Mode Enforced)
- **Routing**: React Router v6+ (Data Routers)
- **Server State & Data Fetching**: TanStack Query v5 (`@tanstack/react-query`) using native `fetch`
- **Schema Validation**: Zod — wire schemas in that MFE's `contract` lib, form schemas in its `data-access` lib. Not a root dependency.
- **Styling & UI**: Tailwind CSS v4, shadcn/ui composition patterns over Base UI (`@base-ui/react`) primitives
- **Build Tool**: Vite (with Module Federation). This is **not** a Next.js workspace — there is no
  server runtime, no Server Actions, and no `process.env`; browser-side env vars come from
  `import.meta.env.VITE_*`.
- **Package Manager**: pnpm (Node 20.19+, pinned in `.nvmrc`)

## TypeScript

- Strict mode enabled
- No `any` types - use proper typing or `unknown`
- Define interfaces for component props. Infer API request/response types from the MFE `contract` Zod schemas (`z.infer<typeof …>`). Do not hand-write a parallel DTO.
- Use type inference where obvious, explicit types where helpful

## React

- Functional components only (no class components)
- Use hooks for state and side effects
- Keep components focused - one job per component
- Extract reusable logic into custom hooks

## Styling (use Tailwind CSS v4)

- Tailwind CSS for all styling
- Use shadcn/ui components where applicable
- No inline styles
- Dark mode first, light mode as option

**CRITICAL**: We are using Tailwind CSS v4, which uses CSS-based configuration.

- **DO NOT** create `tailwind.config.ts` or `tailwind.config.js` files (those are for v3)
- All theme configuration is done in CSS with the `@theme` directive. The real files are:
  - `libs/ui/src/styles/theme.css` — the `@theme` block registering fonts, product spacing
    (`max-w-app`, `p-page`, `h-control`, `w-sidebar`), and semantic utilities
  - `libs/ui/src/styles/tokens.css` — the raw Figma light values and derived dark values
  - `libs/ui/src/styles.css` — the aggregator that imports the three style files
  - `apps/*/src/styles.css` — a small per-app compiler entry that pulls in Tailwind plus the
    aggregator, so each app builds standalone or through Module Federation
- Use CSS custom properties for colors, spacing, etc.
- No JavaScript-based config allowed
- Example v4 configuration:

  ```css
  @import 'tailwindcss';

  @theme {
    --color-primary: oklch(50% 0.2 250);
  }
  ```

## Icons

- All icons are hand-traced from Figma into `libs/ui/src/icons`, using the `createFigmaIcon`
  helper in `libs/ui/src/icons/icon-base.tsx`.
- No external icon library (e.g. `lucide-react`) is a dependency anywhere in the workspace. If a
  needed icon doesn't exist yet in `libs/ui/src/icons`, trace it from Figma rather than pulling in
  a package.

## Adding a Design System (`@cms/ui`) Component

Follow these steps in order. Do not hand-write a component that the registry already
ships.

1. **Check the shadcn registry first** for an existing component. Also check the
   provenance table in `libs/ui/README.md` — several of our components solve a registry
   problem under a different name (`text-input` is the registry's `input`, `section-card`
   relates to `card`, `callout` is `alert`), so what looks missing may already exist.
2. **Generate it** if the registry has one:

   ```bash
   npx shadcn@latest add <component> --cwd libs/ui --path ./src/components/ui
   ```

   The explicit `--path` is required. The CLI resolves tsconfig `paths` relative to its
   own working directory, so `--cwd libs/ui` alone writes files one level too deep
   (`libs/ui/libs/ui/src/...`). See `libs/ui/README.md` for the full explanation.

3. **Replace any `lucide-react` icons** with hand-traced icons from `libs/ui/src/icons`.
   `lucide-react` is not a workspace dependency and is blocked by `no-restricted-imports`
   in `eslint.config.mjs` — leaving it in fails lint.
4. **Adapt the styling** to FieldPro semantic tokens. No raw utilities where a token
   exists, and no component-level `dark:` overrides — dark mode is handled in `tokens.css`.
5. **Add autodocs Storybook stories**, including a `play` function for the important
   keyboard and interaction paths. Accessibility checks run per story and fail the build.
6. **Record it in the provenance table** in `libs/ui/README.md`.

Hand-authoring is reserved for components with no registry equivalent (as `Combobox` was),
and requires an in-file comment explaining why.

This applies to components only, not icons — icons are cheap to add and rarely need API
iteration.

## Monorepo Architecture & Type Boundaries

Every project carries Nx tags in its `project.json`. The vocabulary is
`type:app | type:lib | type:integration | type:contract` plus
`scope:shell | workorder | lead | invoice | settings | shared`.
The rules are enforced by `@nx/enforce-module-boundaries` in `eslint.config.mjs` — an app may
only depend on `type:lib`, and a scope may only depend on itself, `scope:shared`, and
`type:contract` (that MFE's wire DTOs, e.g. `@cms/settings-contract`).

**Per-MFE libraries** — every remote that talks to an API owns two libs under `libs/<mfe>/`.
This is the layout to follow for every new resource. Do not put catalog DTOs in `libs/shared/`.

```text
libs/<mfe>/
  contract/       @cms/<mfe>-contract      wire request/response Zod DTOs + inferred types
  data-access/    @cms/<mfe>-data-access   endpoints, keys, query/mutation factories, form schemas, mappers
```

| Piece | Tag | Who imports it |
| --- | --- | --- |
| `libs/<mfe>/contract` | `type:lib`, `scope:<mfe>`, `type:contract` | that MFE's UI, its data-access lib, and MSW |
| `libs/<mfe>/data-access` | `type:lib`, `scope:<mfe>` | that MFE's UI only |

Settings is the reference: `libs/settings/contract` + `libs/settings/data-access`. Lead would
be `libs/lead/contract` (`@cms/lead-contract`) plus the existing data-access lib. Same for
workorder and invoice. UI imports `import type { TaxSummaryDto } from '@cms/settings-contract'`;
MSW uses the same schemas. Neither duplicates the DTO.

The Cursor rule is `.cursor/rules/mfe-lib-folder-structure.mdc`.

**Applications** (`apps/`) — a Module Federation host plus remotes. Feature/page views
live here, not in a library:

| App | Port | Role |
| ---------- | ---- | ---------------------------------------------------- |
| `shell` | 4200 | Host: layout, router, runtime config, store, QueryClient |
| `workorder` | 5101 | Federated remote |
| `lead` | 5102 | Federated remote |
| `invoice` | 5103 | Federated remote |
| `settings` | 5104 | Federated remote |

**Libraries** — `type:lib` unless noted:

| Path | Import alias | Contents |
| ------------------------------ | ----------------------------- | ------------------------------------------------------ |
| `libs/ui` | `@cms/ui` | Presentational primitives + icons. NO network or state logic. |
| `libs/shared/api` | `@cms/shared-api` | `customFetch` wrapper and `ApiError` |
| `libs/shared/auth` | `@cms/shared-auth` | Auth session helpers used by the shell |
| `libs/shared/auth-data-access` | `@cms/auth-data-access` | Login/refresh fetch + Zod (shared, not an MFE catalog) |
| `libs/shared/mocks` | `@cms/shared-mocks` | MSW handlers. Import DTOs from MFE contracts, never from data-access. |
| `libs/platform-contract` | `@cms/platform-contract` | Shared `QueryClient` factory and runtime contract (shell ↔ remotes). Not an API DTO lib. |
| `libs/settings/contract` | `@cms/settings-contract` | Settings catalog wire DTOs (Tax, TaxAuthority, Zone) |
| `libs/settings/data-access` | `@cms/settings-data-access` | Settings query/mutation factories, form schemas, mappers |
| `libs/lead/data-access` | `@cms/lead-data-access` | Lead fetch factories. Add `libs/lead/contract` when wire DTOs are shared with UI/MSW. |
| `libs/workorder/data-access` | `@cms/workorder-data-access` | Same pattern as lead |
| `tools/module-federation` | `@cms/module-federation-shared` | Shared MF/Vite config helpers |
| `tools/integration` | — (`type:integration`) | Cross-project integration tests |

> **Type Safety Rule**: Never perform cross-boundary deep imports (`../../../libs`). Always use
> the path aliases mapped in `tsconfig.base.json` — the prefix is `@cms/`, and MFE lib
> aliases are flat, e.g. `@cms/settings-contract` and `@cms/lead-data-access` (not
> `@cms/lead/data-access`). `@cms/ui` additionally allows subpath imports via the `@cms/ui/*`
> wildcard.

To add a new remote app, use the workspace generator rather than wiring one by hand:

```bash
pnpm exec nx g ./tools/generators/remote-app:remote-app <name>
```

It does not add the sidebar entry — icon, section, and label are design calls, so it prints
instructions instead.

## Naming

- Components: PascalCase (`ItemCard.tsx`)
- Files: Match component name or kebab-case
- Functions: camelCase
- Constants: SCREAMING_SNAKE_CASE
- Types/Interfaces: PascalCase (no prefix)

## Application Internal Structure

The section above governs the boundaries *between* projects. This one governs the layout
*inside* every application under `apps/`. It is not advisory — new folders that do not
appear here need a reason in review, and the `remote-app` generator emits this skeleton so
new remotes start compliant.

```
apps/<app>/src/
  index.ts               MF indirection — dynamic import('./bootstrap') only
  bootstrap.tsx          standalone React root
  standalone-runtime.ts  standalone CmsRuntime + configureCustomFetch
  error-boundary.tsx     RemoteErrorBoundary
  styles.css             Tailwind entry
  vite-env.d.ts

  App.tsx                AppProps + route table + error boundary. Nothing else.

  pages/
    index.ts             page entry-point exports
    <PageName>/
      <PageName>.tsx     route target
      index.ts           public page entry point
      component/         components owned by this page
      constant/          page-owned literal values
      types/             page-owned domain types
      util/              page-owned pure functions
      store/             page-owned state, when needed

  shared/                only concerns with proven cross-page consumers
    component/
    constant/
    types/
    util/

  store/                 app-wide state shared by multiple pages
  util/                  app-owned helpers used by bootstrap or store
```

**`App.tsx` holds no screen markup.** It declares `AppProps { runtime: CmsRuntime }`, owns
the remote error boundary, and composes page entry points. A multi-route app returns a
`<Routes>` table. A single-page remote may render its page entry directly when introducing
a router would otherwise change its runtime contract. Screen markup belongs in
`pages/<PageName>/<PageName>.tsx`.

**Every app accepts `runtime`.** The shell passes `runtime={mfeRuntime}` to every remote.
A remote that declares no props still type-checks against `lazyProvider<{ runtime }>`,
because a zero-prop component structurally satisfies it — so this will not fail the build,
and it must be checked by eye. Stamp `data-tenant={runtime.tenantId}` as the visible proof
it is wired.

**Ownership comes before reuse.** If a component, constant, type, helper, or store is used
by one page only, it belongs under that page. Do not move code to `shared/` because it may
be reused later; promote it only after a real second page consumer appears. App bootstrap,
runtime, routing, and Module Federation wiring remain at `src/` because no page owns them.

**Types placement.** API request/response types come from that MFE's contract
(`@cms/<mfe>-contract`), not from a page `types/` folder and not from a second copy in
data-access. Page-domain types that are not wire DTOs belong in the page's `types/` folder
and are re-exported from `types/index.ts` when several page files consume them. Component
props and other single-file types may stay beside their implementation. Types genuinely
consumed by multiple pages (still not wire DTOs) go in `src/shared/types/`. Store
implementation types stay with their owning page or app-wide store. Do not declare an
interface in a `constant/` file.

**`constant/` holds data, `util/` holds behaviour.** If it is a function, it is not a
constant. A lookup map is a constant; the function that reads the map is not. Mock data
that will later come from an API lives in the owning page's `constant/` until the MFE
contract and data-access libs exist, not inline in the component that renders it. Once an
API exists, MSW seed data lives in `@cms/shared-mocks` and uses the MFE contract types.
Do not name an app folder `lib/` — that word is reserved for Nx libraries under `libs/`.

**Every folder has an `index.ts`.** Import a folder by its folder name, never a file
inside it: `from './component'`, not `from './component/CompanySettingsForm'`. The
folder's `index.ts` is the only file that imports sibling implementation files. Files
inside a folder may import sibling files when a barrel import would cycle.

**Naming.** Files exporting a React component are PascalCase and match the export name
(`SetupHeader.tsx`). Everything else is kebab-case (`resolve-setting-icon.ts`). Page
components carry a `Page` suffix (`SetupPage.tsx`, `InvoiceListPage.tsx`). Use `.tsx` only
when the file actually contains JSX — a file that merely references component identifiers
in a map is `.ts`.

**Stories are colocated** next to the component they cover
(`pages/SetupPage/component/SetupHeader.stories.tsx`), not gathered in a separate folder.
An `App.stories.tsx` that exercises multiple routes remains beside `App.tsx`.

## Data Fetching Native Fetch Client Setup (`libs/shared/api`)

- Do NOT use Axios, and do NOT call `fetch` directly from feature code. `customFetch` in
  `libs/shared/api/src/lib/custom-fetch.ts` is the single sanctioned way to call an API. It
  handles transport, auth header injection, and typed error mapping only.
- The library reads **no environment variable itself** — that keeps it bundler-agnostic. Each
  runtime configures it once at bootstrap, and that is the only place `import.meta.env` is read:

  ```typescript
  // apps/shell/src/runtime.ts (and each remote's standalone-runtime.ts)
  import { configureCustomFetch } from '@cms/shared-api';

  configureCustomFetch({
    baseUrl: (import.meta.env.VITE_API_URL as string | undefined) ?? '',
    // getAuthToken is optional; return undefined when there is no token to attach
  });
  ```

- Call it from a data-access lib, never from a component. Parse with the owning MFE
  contract schema:

  ```typescript
  const dto = await customFetch<unknown>(`/tax/${id}`, { signal });
  return taxDetailResponseSchema.parse(dto);
  ```

- Validate every response with Zod using schemas from `@cms/<mfe>-contract`. Parse in the
  `data-access` lib after `customFetch`. `customFetch` returns `Promise<T>` on trust — the
  type parameter is an assertion, not a runtime guarantee.
- Local `baseUrl` is `/api/v1`. MSW intercepts when `VITE_USE_MOCK_API=true`. See
  `libs/shared/api/README.md`.

## Queries, Mutations & Forms

A data-access lib exports **options factories, not hooks** — `<feature>QueryOptions` and
`<feature>MutationOptions` — and the screen passes the `queryClient` it was given:

```typescript
const query = useQuery(companySettingsQueryOptions(companyId), queryClient);
const mutation = useMutation(
  companySettingsMutationOptions(companyId, queryClient),
  queryClient,
);
```

The explicit second argument is deliberate and must not be "fixed" into provider-only
usage: a hosted remote uses the client from `runtime`, never one of its own
(`libs/platform-contract/README.md`). The mutation factory owns the invalidation that
follows its own write, so the cache rule lives next to the key factory.

A remote's `AppProps` is `{ runtime: CmsRuntime }` and stays that way however many
endpoints its screens grow. Do **not** add per-endpoint loader/saver props for tests —
both test tiers stub global `fetch` instead (`.storybook/fixtures/api.ts`,
`tools/integration`).

The full recipe, including the two-schema rule and dirty-field patching, is in
@context/forms-implementation-guide.md.

## Error Handling

There are no Server Actions here — this is a client-rendered Vite app. Errors surface through
TanStack Query.

- A failed request throws `ApiError` (`status` + `message`) from `libs/shared/api`. Let it
  propagate out of the query function; do not swallow it into a `{ success, data, error }` shape.
- Handle it at the component boundary with the `isError` / `error` state the query hook already
  returns, and narrow with `instanceof ApiError` when the status matters.
- Cross-cutting logging belongs in the `onError` callback passed to `createCmsQueryClient`
  (`logCmsQueryError`), not in individual components.
- Feature components remain responsible for the user-facing message. Display it via toast.

## Testing

Two tiers, both run in CI. There is deliberately **no `test` target** — `nx test` will not work.
New libraries are generated with `unitTestRunner: "none"` (`nx.json`).

| Command | What it runs |
| ------------------------ | ---------------------------------------------------------------------- |
| `pnpm run test:query` | Node-environment integration tests for the shared QueryClient contract (`tools/integration`) |
| `pnpm run storybook:test` | Every `*.stories.tsx` in a real headless Chromium, including `play` functions and per-story accessibility checks |

Both are configured as named Vitest projects (`query`, `storybook`) in `vitest.config.mts`.
Before the first browser run locally: `pnpm exec playwright install chromium`.

Component and feature-level unit tests are not yet established — add stories with `play`
functions as the default way to cover interaction behavior.

## Essential Commands

Use `pnpm`. The root scripts cover the common cases:

- **Serve everything**: `pnpm run dev` (shell + remotes)
- **Build all**: `pnpm run build`
- **Lint / Typecheck all**: `pnpm run lint`, `pnpm run typecheck`
- **Format**: `pnpm run format`, `pnpm run format:check`
- **Storybook**: `pnpm run storybook` (dev), `pnpm run storybook:build`, `pnpm run storybook:typecheck`

Drop to Nx directly for a single project or for affected-only runs (which is what CI does):

- **Serve one app**: `pnpm exec nx serve <app-name>`
- **Build one target**: `pnpm exec nx build <project>`
- **Lint & fix one project**: `pnpm exec nx lint <project> --fix`
- **Affected only**: `pnpm exec nx affected -t lint`, `-t typecheck`, `-t build`
- **Dependency graph**: `pnpm run graph`
- **Generate a library**: `pnpm exec nx g @nx/react:lib <name> --directory=libs/<mfe>/<name> --buildable`
  For a remote's APIs, create both `libs/<mfe>/contract` (`@cms/<mfe>-contract`, tags
  `type:lib`, `scope:<mfe>`, `type:contract`) and `libs/<mfe>/data-access`. Then add `tags`
  and a `@cms/*` alias to `tsconfig.base.json` — neither is generated for you. Also add the
  package to Module Federation `shared` if UI remotes import it at runtime.

## Code Quality

- No commented-out code unless specified
- No unused imports or variables
- Keep functions under 50 lines when possible
