# CMS micro-frontends

Minimal Nx 23 + React 19 CMS using Vite Module Federation.

## Projects

- `shell` (port 4200): layout, router, runtime config, Zustand store, QueryClient
- `workorder` (port 5101): independently built federated provider
- `lead` (port 5102): independently built federated provider
- `@cms/ui`: publishable shadcn-style React library with Tailwind v4
- `@cms/platform-contract`: publishable runtime contract library

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
npx tsc --noEmit -p apps/shell/tsconfig.json
npx tsc --noEmit -p apps/workorder/tsconfig.json
npx tsc --noEmit -p apps/lead/tsconfig.json
```

## Production notes

Deploy each app's `dist` directory independently. Replace the shell's
`config.json` with immutable, versioned remote URLs. Cache hashed chunks for a
long time, but serve `config.json` and remote entry files with short/no cache.
The shell creates one Zustand store and one TanStack QueryClient, then passes
both to providers through `CmsRuntime`; providers only create local instances
in standalone mode.
