# Coding Standards

## Project Overview & Tech Stack
- **Monorepo**: Nx (Integrated workspace)
- **Core Framework**: React 19+ with TypeScript (Strict Mode Enforced)
- **Routing**: React Router v6+ (Data Routers)
- **Server State & Data Fetching**: TanStack Query v5 (`@tanstack/react-query`) using native `fetch`
- **Form & Schema Validation**: React Hook Form + Zod
- **Styling & UI**: Tailwind CSS, shadcn/ui (The Styled Layer)
- **Package Manager**: pnpm (Node v20+)

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
- All theme configuration must be done in CSS using the `@theme` directive in `src/app/globals.css`
- Use CSS custom properties for colors, spacing, etc.
- No JavaScript-based config allowed
- Example v4 configuration:

  ```css
  @import "tailwindcss";

  @theme {
    --color-primary: oklch(50% 0.2 250);
  }

## Monorepo Architecture & Type Boundaries

Follow strict Nx module tags (`scope:<domain>` and `type:app|feature|data-access|ui|utils|types`).

- `apps/` - Deployable shells (e.g., `apps/web-app`).
- `libs/shared/api/` - Native `fetch` wrapper with typed interceptors, `QueryClient` provider configuration.
- `libs/shared/ui/` - Presentational shadcn/ui primitives. Must contain NO network or state logic.
- `libs/<domain>/data-access/` - Native `fetch` functions, TanStack Query hooks, query key factories, DTO types, Zod schemas.
- `libs/<domain>/feature/` - Smart page/container views consuming custom TanStack Query hooks.
- > **Type Safety Rule**: Never perform cross-boundary deep imports (`../../../libs`). Always use path aliases mapped in `tsconfig.base.json` (e.g., `@workspace/user/data-access`).

## Naming

- Components: PascalCase (`ItemCard.tsx`)
- Files: Match component name or kebab-case
- Functions: camelCase
- Constants: SCREAMING_SNAKE_CASE
- Types/Interfaces: PascalCase (no prefix)

## Data Fetching Native Fetch Client Setup (`libs/shared/api`)

- Do NOT use Axios. Use a central, strongly typed `customFetch` utility over native `fetch`:

  ```typescript
  export async function customFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, { ...options, headers });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(response.status, errorData.message || 'API request failed');
    }
    return response.json();
  }
- Validate all inputs with Zod

## Error Handling

- Use try/catch in Server Actions
- Return `{ success, data, error }` pattern from actions
- Display user-friendly error messages via toast

## Testing

- to be updated later


## Essential Nx Commands
- **Serve App**: `npx nx serve <app-name>`
- **Build Target**: `npx nx build <target-name>`
- **Test Single Project**: `npx nx test <target-name>`
- **Test Affected Code**: `npx nx affected -t test`
- **Lint & Fix**: `npx nx lint <target-name> --fix`
- **Strict Typecheck**: `npx nx run-many -t typecheck`
- **Generate Library**: `npx nx g @nx/react:lib <lib-name> --directory=libs/<domain>/<lib-name> --buildable`

## Code Quality

- No commented-out code unless specified
- No unused imports or variables
- Keep functions under 50 lines when possible
```
