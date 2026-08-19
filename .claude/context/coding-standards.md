# Coding Standards

## Project Overview & Tech Stack

- **Monorepo**: Nx (Integrated workspace)
- **Core Framework**: React 19+ with TypeScript (Strict Mode Enforced)
- **Routing**: React Router v6+ (Data Routers)
- **Server State & Data Fetching**: TanStack Query v5 (`@tanstack/react-query`) using native `fetch`
- **Schema Validation**: Zod (declared by the `data-access` libs that use it, not at the root)
- **Styling & UI**: Tailwind CSS v4, shadcn/ui composition patterns over Base UI (`@base-ui/react`) primitives
- **Build Tool**: Vite (with Module Federation). This is **not** a Next.js workspace — there is no
  server runtime, no Server Actions, and no `process.env`; browser-side env vars come from
  `import.meta.env.VITE_*`.
- **Package Manager**: pnpm (Node 20.19+, pinned in `.nvmrc`)

## TypeScript

- Strict mode enabled
- No `any` types - use proper typing or `unknown`
- Define interfaces for all props, API responses, and data models
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
`type:app | type:lib | type:integration` plus `scope:shell | workorder | lead | invoice | shared`.
The rules are enforced by `@nx/enforce-module-boundaries` in `eslint.config.mjs` — an app may
only depend on `type:lib`, and a scope may only depend on itself and `scope:shared`.

**Applications** (`apps/`) — a Module Federation host plus three remotes. Feature/page views
live here, not in a library:

| App | Port | Role |
| ---------- | ---- | ---------------------------------------------------- |
| `shell` | 4200 | Host: layout, router, runtime config, store, QueryClient |
| `workorder` | 5101 | Federated remote |
| `lead` | 5102 | Federated remote |
| `invoice` | 5103 | Federated remote |

**Libraries** — every one is `type:lib`:

| Path | Import alias | Contents |
| ------------------------------ | ----------------------------- | ------------------------------------------------------ |
| `libs/ui` | `@cms/ui` | Presentational primitives + icons. NO network or state logic. |
| `libs/shared/api` | `@cms/shared-api` | `customFetch` wrapper and `ApiError` |
| `libs/platform-contract` | `@cms/platform-contract` | Shared `QueryClient` factory and runtime contract |
| `libs/lead/data-access` | `@cms/lead-data-access` | Fetch functions, query hooks, key factories, Zod schemas |
| `libs/workorder/data-access` | `@cms/workorder-data-access` | Same, for work orders |
| `tools/module-federation` | `@cms/module-federation-shared` | Shared MF/Vite config helpers |
| `tools/integration` | — (`type:integration`) | Cross-project integration tests |

> **Type Safety Rule**: Never perform cross-boundary deep imports (`../../../libs`). Always use
> the path aliases mapped in `tsconfig.base.json` — the prefix is `@cms/`, and data-access
> aliases are flat, e.g. `@cms/lead-data-access` (not `@cms/lead/data-access`). `@cms/ui`
> additionally allows subpath imports via the `@cms/ui/*` wildcard.

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

- Call it from a data-access lib, never from a component:

  ```typescript
  const dto = await customFetch<LeadDto>(`/leads/${id}`);
  return leadSchema.parse(dto); // validation is the caller's job, not customFetch's
  ```

- Validate every response with Zod in the owning `data-access` lib. `customFetch` returns
  `Promise<T>` on trust — the type parameter is an assertion, not a runtime guarantee.
- `baseUrl` is currently `''` because no backend exists yet, and the data-access libs return
  static mocks. See `libs/shared/api/README.md`.

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

- **Serve everything**: `pnpm run dev` (shell + all three remotes)
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
- **Generate a library**: `pnpm exec nx g @nx/react:lib <name> --directory=libs/<domain>/<name> --buildable`
  (then add `tags` to its `project.json` and a `@cms/*` alias to `tsconfig.base.json` — neither
  is generated for you)

## Code Quality

- No commented-out code unless specified
- No unused imports or variables
- Keep functions under 50 lines when possible
