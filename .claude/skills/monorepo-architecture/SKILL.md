---
name: monorepo-architecture
description: Monorepo architecture — when to use a monorepo, directory structure, Turborepo vs Nx, turbo.json pipeline config, shared packages pattern, CI/CD with affected builds, and TypeScript project references in a monorepo. Auto-activates on monorepo setup, turbo.json, nx.json, or multi-package repo questions.
---

# Monorepo Architecture — One Repo, Many Apps, Fast Builds

A monorepo puts multiple apps and shared packages in a single Git repository. Changes to a shared UI component, a types package, or an API client are reflected in all consuming apps in one PR — no version bumps, no cross-repo coordination. The tooling (Turborepo, Nx) makes builds fast by caching outputs and only rebuilding what changed.

**When a monorepo makes sense (63% of 50+ dev teams use one, 2025):**

- Multiple apps that share UI components, utilities, or API clients
- Atomic PRs: one change in a shared package + all consumers in one commit
- Consistent tooling (TypeScript config, ESLint, test setup) across all packages
- A team that can invest in the infrastructure

**When a monorepo doesn't help:**

- Fully independent projects with no shared code
- Very large binary assets or ML models (Git performance degrades)
- Teams needing per-repo access control

## Standard Structure

```

fgs-baseui/
├── apps/                        # Deployable applications
│   └── web/                     # React.js frontend
│       ├── src/
│       ├── package.json         # name: "@fgs/web"
│       └── tsconfig.json
├── packages/                    # Shared, reusable packages
│   ├── ui/                      # Design system / component library
│   │   ├── src/
│   │   ├── package.json         # name: "@fgs/ui"
│   │   └── tsconfig.json
│   ├── utils/                   # Shared utilities
│   ├── types/                   # Shared TypeScript types
│   ├── api-client/              # Generated API client
│   ├── config-eslint/           # Shared ESLint config
│   └── config-typescript/       # Shared tsconfig base
├── package.json                 # Root — "private": true
├── pnpm-workspace.yaml          # or yarn workspaces config
├── nx.json                      # nxrepo pipeline config
├── tsconfig.json                # Root TS config (extended by all)
└── .github/workflows/ci.yml     # CI pipeline

```

## Nx — Platform for Large Enterprise Monorepos

Nx is more opinionated than Turborepo. It provides a complete platform: dependency graph visualisation, code generators, architectural enforcement, and multi-language support. Choose Nx when your team wants guardrails and generated scaffolding.

```bash
# Create a new Nx workspace
npx create-nx-workspace@latest my-workspace

# Add a Next.js app to existing Nx workspace
nx g @nx/next:app my-app

# Add a React library
nx g @nx/react:lib ui

# Generate a component
nx g @nx/react:component Button --project=ui --export

# Run tasks
nx build my-app                  # build one project
nx run-many -t build             # build all
nx affected -t build             # build only what changed
nx affected -t test              # test only affected packages

# Dependency graph (opens in browser)
nx graph

```

### nx.json

```json
{
  "$schema": "./node_modules/nx/schemas/nx-schema.json",
  "targetDefaults": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["{projectRoot}/dist"],
      "cache": true
    },
    "test": { "cache": true },
    "lint": { "cache": true }
  },
  "nxCloudAccessToken": "..."
}
```

## Shared Package Patterns

### Shared UI component library

```json
// packages/ui/package.json
{
  "name": "@fgs/ui",
  "version": "0.0.1",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts"
  },
  "peerDependencies": {
    "react": ">=18.0.0"
  },
  "devDependencies": {
    "react": "catalog:",
    "typescript": "catalog:"
  }
}
```

```ts
// packages/ui/src/index.ts
export { Button } from './components/Button';
export { Card } from './components/Card';
export { Modal } from './components/Modal';
export type * from './types';
```

## Common Monorepo Mistakes

```bash
# ❌ Circular dependencies
# Package A depends on B, B depends on A
# Turborepo won't detect this — use Nx if you need enforcement

# ❌ Not declaring all dependencies in each package.json
# pnpm catches this as phantom dependency errors
# npm/yarn may silently allow it until deployment

# ❌ Wrong build order
# nx build --workspaces       <-- does not guarantee dep order
# nx.json "dependsOn": ["^build"]  <-- guarantees dep order

# ❌ Installing from inside a workspace
# cd packages/ui && pnpm install
# From root: pnpm add react -F @fgs/ui

# ❌ Scoped names like @fgs/ui need matching folder names
# Use @org/name consistently across the workspace

```

## Security — Supply Chain and Boundaries

- Manage internal and external package integrity by pinning all versions workspace-wide.
- Restrict write access to the remote cache endpoint.
- Enforce strict import boundaries across project tags to prevent leakages across domain boundaries.

## Checklist

- [ ] Directory structure: `apps/` for deployables, `packages/` for shared
- [ ] All packages have `@fgs/` scoped names in `package.json`
- [ ] Shared TS config in `packages/config-typescript/`
- [ ] Shared ESLint config in `packages/config-eslint/`
- [ ] `nx.json` `dependsOn: ["^build"]` for buildable packages
- [ ] `outputs` configured for all tasks that produce files (enables caching)
- [ ] `persistent: true` on dev server tasks (prevents blocking)
- [ ] CI uses `--filter='[origin/main]'` (affected builds only)
- [ ] Remote cache configured (Turborepo: Vercel / Nx Cloud)
- [ ] Dependencies pinned + `audit` run in CI; package boundaries enforced (Nx rule / ESLint)
- [ ] Remote build cache is access-controlled and signed (poisoned artifacts run on every consumer)
