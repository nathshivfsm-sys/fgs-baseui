# CMS micro-frontends

A minimal Nx 23 + React 19 CMS built with Vite Module Federation.

## Quick start

Requirements:

- Node 20.19+
- pnpm

With nvm and Corepack:

```bash
nvm use
corepack enable
pnpm install
pnpm run dev
```
Then open 'http://127.0.0.1:4200'.

The shell loads remote URLs from 'apps/shell/public/config.json'


## Architecture at a glance
Project	Port	Responsibility
shell	4200	Layout, routing, runtime configuration, Zustand store, and QueryClient
workorder	5101	Independently built federated remote
lead	5102	Independently built federated remote
invoice	5103	Independently built federated remote
settings	5104	Independently built federated remote
'@cms/ui'	—	Publishable shadcn-style React UI library with Tailwind v4
'@cms/platform-contract'	—	Shell/remote runtime contract and QueryClient factory
'@cms/shared-api'	—	customFetch wrapper and typed ApiError
'@cms/settings-contract'	—	Settings catalog wire DTOs
'@cms/settings-data-access'	—	Settings query and mutation factories
'@cms/workorder-data-access'	—	Work order query and mutation factories
'@cms/lead-data-access'	—	Lead query and mutation factories

Feature-specific contracts follow this convention:

'libs/<mfe>/contract' → '@cms/<mfe>-contract'


'libs/<mfe>/contract' → '@cms/<mfe>-contract'
Wire request and response types belong in the owning MFE's contract library.
They are not API DTOs in '@cms/platform-contract'

## Adding a remote

Generate a new remote with:
pnpm exec nx g './tools/generators/remote-app:remote-app' <name>


The generator creates the application and prints the sidebar wiring that must be
applied manually.

After generating a remote:

Apply the printed sidebar wiring.
Add the remote to the shell's runtime configuration.
Add its contract library.
Add its data-access library if the remote owns API queries or mutations.
Add deployment configuration for the remote.
Run the validation commands described below.



## Hosted and standalone MFEs
A hosted MFE runs inside the shell and receives the shell's CmsRuntime.
It uses the shell's Zustand store and TanStack QueryClient.

A standalone MFE runs independently and creates its own runtime, store, and
QueryClient for the lifetime of its page.

Hosted MFEs must not clear the shell's QueryClient when they unmount.


## Styling architecture
Tailwind CSS v4 is configured in CSS rather than in a JavaScript configuration
file.

Shared semantic tokens and base styles live under
'libs/ui/src/styles' [blocked]. Each independently built application
keeps a small compiler entry in apps/*/src/styles.css, allowing it to run
standalone or through Module Federation.

The UI JavaScript barrel has no global CSS side effects.



## Design tokens
Design tokens have two layers.

tokens.css first declares primitives: generic palettes named by hue family and
ramp step, such as --blue-55 and --gray-blue-10. Ramp values run from 5
for the lightest value to 100 for the darkest value. Primitive values are
identical in both color schemes.

The file then declares semantic roles, such as:

--surface
--foreground-muted
--border-subtle
--data-1
Semantic roles reference primitives and are reassigned in the .dark block.

Build UI against semantic roles:

'bg-surface'
'text-foreground-subtle'
'border-border-subtle'

A component that uses a primitive directly opts out of the intended dark-mode
behavior because primitives do not change between color schemes.

No token is named after a component. The
'libs/ui/src/theme' [blocked] directory mirrors the complete token set
as TypeScript unions and provides themeVar accessors for cases where a utility
class cannot be used.



## Color roles
primary is both the brand color and the main interaction color. Use the
following related roles for its states:

'primary-hover'
'primary-strong'
'primary-subtle'
'primary-foreground'
There is no brand role.

action remains a distinct, lighter interaction blue used by the Service
Location screens.

surface-inverse is the dark banner blue. It is intentionally independent of
the interaction color so the top bar can be re-themed without changing the
primary interaction color.

## Spacing
Spacing has no named tokens. Tailwind derives every spacing step from
--spacing, which is 4px.

For example:

h-9 is 36px
w-56 is 224px


## Typography

Inter is the single application font. It is self-hosted and declared once in
'libs/ui/src/styles/font.css' [blocked], which is the only
file in the repository that names a typeface.

Change the font in that file to update every application and Storybook without
changing components.

Use:

'font-sans' for application typography
tabular-figures when digits need to align in columns, such as record codes, amounts, and counts
Shared product-level values such as max-w-app, max-w-content, and the named
type scale are defined in
'libs/ui/src/styles/theme.css' [blocked].

The named type-scale utilities are:

'text-caption'
'text-field'
'text-control'
'text-body'
'text-title'
The 13px type step is named field, not input. This avoids a collision with
the --color-input token, which would cause text-input to resolve as a color
rather than a type size.

Figma light values and intentionally derived dark values are maintained together
in tokens.css.


## Data-fetching architecture
'libs/platform-contract/src/lib/query-client.ts' [blocked]
is the single source of React Query client defaults and lifecycle helpers.

The shell creates one module-scoped QueryClient for the browser page and passes it
through CmsRuntime.

Hosted MFEs must use that client. They must never clear it when an individual
remote unmounts.

A standalone MFE creates one module-scoped client with
createCmsQueryClient() and owns that isolated cache for the lifetime of its
page.

Storybook and tests create isolated clients and clear them during teardown.


## Shared QueryClient defaults
The shared defaults are:

30 seconds of stale time
10 minutes of garbage collection
One query retry with capped exponential backoff
No mutation retries
Refetching on reconnect
No refetching on window focus
Hosts can pass onError to the factory for telemetry. Feature components remain
responsible for user-facing error states.

Endpoint-specific behavior belongs in a feature-local queryOptions factory,
not in another QueryClient.


## Query keys and factories
Query keys must:

Start with a unique feature scope.
Include every variable that changes the response.
Be defined in the owning MFE's data-access library.
Keep key factories and query option factories in the owning MFE's data-access
library.

Wire request and response types belong in that MFE's contract library so the UI
and MSW fixtures share the same types.

Invalidate the narrowest key possible. Cross-feature prefix invalidation requires
an explicit product reason.

Query functions receive TanStack Query's AbortSignal and must pass it to
network clients that support cancellation.

## SSR status
SSR is planned but not implemented.

There is currently no server entry, renderToString call, or
dehydrate/hydrate boundary in the repository. Every QueryClient described above
runs client-side.

Run the following command to verify shared query behavior:

```bash
pnpm run test:query

The query tests cover:

Shared QueryClient defaults
Request deduplication
Request cancellation
Cache sharing
Standalone isolation
Tenant scoping
Error callbacks



## Runtime configuration
The shell reads remote configuration from
'apps/shell/public/config.json' [blocked] at runtime.

The configuration must be valid JSON. Do not include comments or trailing
commas in deployed files.

The file is copied into apps/shell/dist during the shell build and is fetched
by 'apps/shell/src/config.ts' [blocked].


##Local development
```json
{
  "environment": "development",
  "remotes": {
    "workorder": {
      "name": "workorder",
      "entry": "http://localhost:5101/remoteEntry.js"
    },
    "lead": {
      "name": "lead",
      "entry": "http://localhost:5102/remoteEntry.js"
    },
    "invoice": {
      "name": "invoice",
      "entry": "http://localhost:5103/remoteEntry.js"
    },
    "settings": {
      "name": "settings",
      "entry": "http://localhost:5104/remoteEntry.js"
    }
  }
}
```

## Staging
Use versioned, immutable remote entry URLs for staging deployments:

```json
{
  "environment": "staging",
  "remotes": {
    "workorder": {
      "name": "workorder",
      "entry": "https://staging-workorder.example.com/v1.4.2/remoteEntry.js"
    },
    "lead": {
      "name": "lead",
      "entry": "https://staging-lead.example.com/v1.4.2/remoteEntry.js"
    },
    "invoice": {
      "name": "invoice",
      "entry": "https://staging-invoice.example.com/v1.4.2/remoteEntry.js"
    },
    "settings": {
      "name": "settings",
      "entry": "https://staging-settings.example.com/v1.4.2/remoteEntry.js"
    }
  }
}

```

## Production
Use the same configuration shape with production hosts and versions:

```json


{
  "environment": "production",
  "remotes": {
    "workorder": {
      "name": "workorder",
      "entry": "https://workorder.example.com/v1.4.2/remoteEntry.js"
    },
    "lead": {
      "name": "lead",
      "entry": "https://lead.example.com/v1.4.2/remoteEntry.js"
    },
    "invoice": {
      "name": "invoice",
      "entry": "https://invoice.example.com/v1.4.2/remoteEntry.js"
    },
    "settings": {
      "name": "settings",
      "entry": "https://settings.example.com/v1.4.2/remoteEntry.js"
    }
  }
}

```

Replace the shell's config.json with the environment-specific version as part
of deploying the shell, alongside each remote's own dist directory.


## Validation
Run the complete validation suite with:

````bash
pnpm run format:check
pnpm run lint
pnpm run typecheck
pnpm run build
pnpm run test:query
pnpm run storybook:typecheck
pnpm run storybook:build
pnpm run storybook:test
pnpm run lint and pnpm run typecheck run against every project.
```

To run only projects affected relative to a base branch, use:

````bash
pnpm exec nx affected -t <target>
```

This is the command used by CI for affected-project validation.

The test:query target currently covers only the shared QueryClient factory in
tools/integration. The workorder, lead, and invoice applications do not
yet have component-level tests.


## Storybook
Run Storybook with:

`````bash
pnpm run storybook
```

Open 'http://localhost:6006'.

The workspace has one Storybook owned by @cms/ui. It discovers:

Shared component stories in 'libs/ui/src'
Feature-composition stories in 'apps/*/src'


## Story conventions
- Colocate stories as component-name.stories.tsx.
- Title shared primitives as Components/Name.
- Title application compositions as Features/Area.
- Prefer typed args and controls over one story for every prop combination.
- Add explicit stories for meaningful loading, empty, error, disabled, and layout states.
- Keep fixtures in .storybook/fixtures.
- Use withCmsRuntime for components that need the platform store or QueryClient.
- Ensure every story receives isolated state.
- Use play functions from storybook/test for important keyboard and user flows.
- Keep production global styles in .storybook/preview.css.
- Configure global providers and decorators in .storybook/preview.ts, not in individual stories.
- Accessibility checks run for every story and fail component tests when  violations are found.

Before running browser tests locally or in CI for the first time, install the
pinned Chromium browser:

```bash

pnpm exec playwright install chromium

```

CI installs Chromium and runs the following in its slow lane:

```bash
pnpm run storybook:typecheck
pnpm run storybook:build
pnpm run storybook:test

```
See '.github/workflows/ci.yml' [blocked] for the CI
configuration.

## Production and deployment notes
Library consumption
Each application builds and deploys to its own dist directory.

'@cms/ui' and '@cms/platform-contract' are package-ready libraries, but they are
not currently consumed as published packages. Each library's package.json
exports points to its own libs/*/src source, which applications reach through
the pnpm workspace symlink.

As a result, each application's build compiles its own copy of the library
source.

Changing either library currently requires rebuilding the applications that
consume it. Published package versioning is not yet wired into the standard
build or CI flow.

nx release and the Verdaccio local-registry target exist for closing this
gap, but they are not currently wired into a script or CI job.

Module Federation's shared configuration deduplicates runtime singletons
between the shell and its remotes. It does not change how the build-time
workspace dependency is source-resolved.


## Module Federation aliases
No vite.config.ts may add a resolve.alias for an '@cms/*' package.

Module Federation must see the bare package specifier so it can wrap the import
with loadShare and preserve singleton: true.

An alias rewrites the bare specifier before @module-federation/vite can apply
that behavior, silently defeating runtime singleton sharing.

See 'tools/module-federation/shared.ts' [blocked] for
the shared configuration.

Storybook is the one exception:
'.storybook/aliases.ts' [blocked] uses aliases because Storybook
does not use Module Federation. The workspace root also declares no @cms/*
dependencies for Storybook to resolve through.



## Runtime configuration and caching
The shell creates one Zustand store and one TanStack QueryClient, then passes
both through CmsRuntime.

Hosted providers use those instances. Providers create local instances only when
running in standalone mode.

For deployment:

- Build each shell and remote application.
- Publish each application's dist directory.
- Publish versioned remote entry URLs.
- Replace the shell's config.json with the target environment's configuration.
- Serve config.json and remote entry files with short or disabled caching.
- Serve hashed application chunks with long-lived caching.
- Remote entry URLs should be immutable and versioned per deployment. The shell's
runtime configuration should be changed independently so remote versions can be updated without rebuilding the shell.

- Remote loading failures should be handled at the shell or route boundary so a single unavailable remote does not prevent unrelated shell functionality from
starting.


## Repository conventions
- Use semantic design tokens rather than primitive color tokens in UI code.
- Keep feature wire types in the owning MFE's contract library.
- Keep query keys and query option factories in the owning MFE's data-access library.
- Pass TanStack Query's AbortSignal to cancellable network clients.
- Invalidate the narrowest query key possible.
- Do not clear the shell's QueryClient from a hosted remote.
- Do not add @cms/* aliases to Vite configuration.
- Keep global styles in the shared style entry points, not in the UI JavaScript barrel.
- Use font-sans for typography and tabular-figures for aligned numeric data.