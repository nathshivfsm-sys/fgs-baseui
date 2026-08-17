# Monorepo Architecture & Enforcement Remediation

### Product Requirements Document

## 1. Overview

This PRD covers the remediation work identified in `context/ARCHITECTURE-GAPS.md` and `context/project-improvements.md`: closing the gap between what the FieldPro monorepo _claims_ to guarantee — a shared design system at a known version, a single query contract, enforced module boundaries, a validated build — and what it actually enforces today, which is none of the above. The audience is the engineering team maintaining the Nx + Vite Module Federation workspace (`shell`, `workorder`, `lead`, `@cms/ui`, `@cms/platform-contract`). No user-facing feature ships from this work, with one exception: the dark-mode toggle in requirement 40.

The driver is timing. Every gap below is cheap to close now, with two remotes and one developer, and progressively more expensive with each additional domain or team. The enforcement work in Phase 1 is the precondition for everything else holding: without lint, tags, boundaries, and CI, any rule this document establishes decays silently the first time someone doesn't remember it.

## 2. Problem Statement

The workspace has correct architecture and zero mechanical enforcement of it.

- **Nothing verifies the design system is consistent across MFEs.** `@cms/ui` is declared a Module Federation singleton at a hardcoded `requiredVersion: '0.0.1'` (`tools/module-federation/shared.ts`), while all three apps alias `@cms/ui` to raw TypeScript source (`libs/ui/src/index.ts`) compiled independently at each app's own commit. MF resolves the singleton by load order, not by real version, so a remote can run against a stale design system with no error raised. CSS is not shared at all — each app compiles its own Tailwind output — so markup and styles can legitimately come from different commits.
- **The query contract is triplicated while the thing it configures is singular.** `@cms/platform-contract` performs an ambient `declare module '@tanstack/react-query'` augmentation and owns `CMS_QUERY_DEFAULTS`, but is absent from `sharedDependencies` even though `@tanstack/react-query` itself is a shared singleton. Its `package.json` also declares `"type": "commonjs"` for a browser-ESM consumer and a `zustand` peer dependency the library does not use.
- **There is no enforcement infrastructure of any kind.** No ESLint config, no `lint` target, no Nx `tags` on any project (so `@nx/enforce-module-boundaries` cannot be configured), no CI pipeline, no `format`/`format:check` script despite Prettier being installed, and no `typecheck` target — the README instructs three manual `tsc --noEmit` invocations. A boundary violation already exists and is invisible: `apps/shell/src/query-runtime.integration.test.ts` deep-imports across app boundaries (`../../lead/src/lead.queries`, `../../workorder/src/workorder.queries`).
- **Nx cannot cache or order app builds.** `nx.json` declares `targetDefaults` only for `@nx/js:tsc`; app `build` targets have no `outputs`, `cache`, or `dependsOn: ["^build"]`. This is currently harmless only because apps compile library source directly — it becomes a correctness problem the moment builds consume built artifacts.
- **`tsconfig.base.json` is a trap for the next project.** It sets `target: es2015` and `strict: false`; every existing project overrides both, so the next project generated into the workspace silently inherits the wrong defaults.
- **The documented data layer does not exist.** `coding-standards.md` specifies a `libs/shared/api` `customFetch` wrapper as the _only_ sanctioned way to call APIs, and a `libs/<domain>/data-access` + `libs/<domain>/feature` split. Neither exists — `workorder.queries.ts` and `lead.queries.ts` live directly inside each app's `src/`, with no fetch layer behind them.
- **The package manager contradicts the standard.** `coding-standards.md` mandates pnpm; the repo runs npm workspaces (`package-lock.json`, no `pnpm-lock.yaml`).
- **Release infrastructure is configured but inert.** Verdaccio, a `local-registry` target, `nx-release-publish`, and `nx.json`'s `release.version.preVersionCommand` all exist, but no script invokes any of them and `@cms/ui` has never been published.
- **The shell hardcodes every remote three times.** `apps/shell/src/App.tsx` maintains three independent per-remote lists — nav entries, route definitions, and lazy provider declarations — with no manifest, so nav and routes can drift from each other. Remote _registration_ is already fully dynamic via `config.json`; only remote _presentation_ is static.
- **Built infrastructure is silently inert.** Most consequentially, `createCmsQueryClient`'s `onError` telemetry callback is fully implemented and tested, but all three runtimes call the factory with zero arguments — production query errors currently go nowhere. Similarly, the README documents SSR that has no implementation, a complete `.dark` token block has no toggle in the app, and eleven of twelve `@cms/ui` components have no consumer outside Storybook while the remotes hand-roll card markup that `SectionCard` already provides.

## 3. Goals

- Stand up enforcement infrastructure — ESLint with Nx module boundaries, project tags, `lint` and `typecheck` targets, format scripts, and a CI pipeline running the validation steps the README already documents.
- Configure Nx build targets correctly (`cache`, `outputs`, `dependsOn: ["^build"]`) so the dependency graph and cache are trustworthy, and fix `tsconfig.base.json`'s inherited defaults so new projects start strict.
- Make the design-system version contract real: derive `@cms/ui`'s MF `requiredVersion` from the library's actual `package.json`.
- Share `@cms/platform-contract` as an MF singleton so the library that configures a shared `QueryClient` is itself singular, and correct its package manifest.
- Wire the `onError` telemetry callback in all three runtimes so query failures are observable.
- Migrate the workspace from npm workspaces to pnpm, matching `coding-standards.md`.
- Build the documented data layer: `libs/shared/api` with `customFetch`, and per-domain `data-access` libraries holding the query logic currently embedded in the apps.
- Wire the existing release configuration into CI so `@cms/ui` is genuinely versioned and published.
- Retire `lucide-react` in favour of the hand-traced `@cms/ui` icon set, and ship the dark-mode toggle the token layer already supports.
- Correct every documentation statement contradicted by the repo.

## 4. Non-Goals

- **Restructuring `libs/` into `packages/`, or renaming the `@cms/` scope.** The `monorepo-architecture` skill's reference layout uses `apps/` + `packages/` + `@fgs/`; this workspace uses `apps/` + `libs/` + `@cms/`, which is Nx-idiomatic and internally consistent. Renaming is churn with no benefit.
- **Adding a fourth MFE, splitting the design system into multiple packages, or introducing a cross-MFE event bus.** Each is explicitly gated in `ARCHITECTURE-GAPS.md` Appendix A on demonstrated need that does not exist today.
- **Setting `strictVersion: true` on any shared dependency.** Shared deps are added here with `strictVersion: false`; tightening is a later step once versions are genuinely meaningful.
- **Implementing SSR, auth/permissions, or tenant-scoped data.** Real gaps, but new-capability work. This spec only requires that documentation stop claiming they exist.
- **Deleting the eleven currently-unconsumed `@cms/ui` components or any icon.** They are well-built and Figma-derived; the requirement is to stop adding more and prove existing ones with real usage.
- **Adopting Nx Cloud / remote caching.** Local cache correctness comes first; remote cache is a scale answer to a problem the team does not have.
- **Defining a testing standard or a coverage target.** Only one test file exists repo-wide and `coding-standards.md` says testing standards are "to be updated later". CI must run the tests that exist; writing the standard is a separate spec.
- **The shadcn/ui CLI and component-layer alignment.** Covered separately in `context/features/shadcn-cli-alignment-prd.md`.
- **Scheduling Phase 5 (remote manifest).** Specified but explicitly not scheduled — see 7.5.

## 5. User Stories

- As a developer adding a component to `@cms/ui`, I want CI to fail when a remote is built against a mismatched design-system version, so that skew is caught at build time rather than found as a visual bug in production.
- As a developer, I want `nx lint` to reject an import that crosses a project boundary it shouldn't, so that architectural rules are enforced by tooling rather than by review memory.
- As a developer opening a pull request, I want build, typecheck, lint, and test to run automatically, so that correctness doesn't depend on my remembering a manual checklist.
- As a developer writing a new query hook, I want a single sanctioned `customFetch` with typed errors, so that every domain handles auth headers and API failures identically instead of inventing its own.
- As a developer adding a new domain, I want query logic to already live in a `data-access` library, so that I copy an established pattern rather than embedding fetch logic in an app and retrofitting it later.
- As an on-call engineer, I want query failures in any MFE to reach a telemetry sink, so that I learn about production errors from monitoring rather than from a user.
- As a new contributor, I want `coding-standards.md` and the README to describe the tooling the repo actually uses, so that I don't lose a day following instructions that don't apply.

## 6. Reference / Source Material

- `context/ARCHITECTURE-GAPS.md` — the primary evidence base: five gaps with file paths and line references, plus Appendix A's prioritized ordering, Appendix B's decision rules, and Appendix D's explicit list of things that are _not_ gaps.
- `context/project-improvements.md` — earlier companion review; overlaps on CI, package manager, lint, and test coverage.
- `.claude/skills/monorepo-architecture/SKILL.md` — general Nx guidance, used here for the `nx.json` `targetDefaults` shape, `dependsOn` / `outputs` / `cache`, `persistent: true` on dev servers, affected-only CI, dependency pinning, and tag-based boundary enforcement. Where this generic guidance conflicts with repo-specific findings in `ARCHITECTURE-GAPS.md`, the repo-specific findings win.
- `context/project-architecture.md` — the authoritative map of the current structure.

### 6.1 Constraints inherited from the current architecture

The following are correct as they stand and must survive this work unchanged (per `ARCHITECTURE-GAPS.md` Appendix D):

- Cross-MFE communication is props-only, via the `CmsRuntime` contract. No `window`, `globalThis`, `CustomEvent`, `postMessage`, or event-bus pattern exists anywhere in the codebase; none may be introduced.
- `setTenantId` is deliberately absent from `CmsRuntime` — remotes physically cannot write global state.
- `zustand` is deliberately excluded from `sharedDependencies`, which makes cross-boundary store leakage impossible.
- The duplication between `workorder.queries.ts` and `lead.queries.ts` is correct duplication under Appendix B's rules. Moving these files into `data-access` libraries (Phase 3) relocates them; it must not merge or abstract them into a shared query module.
- The single shell-owned router is correct. Only ownership of route _definitions_ moves in Phase 5 — remotes do not get their own router instances.
- Injectable `load*` props are the seam that makes Storybook's Loading/Empty/Error stories real tests. They must be preserved through the `data-access` extraction.

## 7. Functional Requirements

Five phases. Phases 1–2 are must-fix and ship first. Phase 3 is the data layer. Phase 4 is cleanup that can ship alongside. Phase 5 is specified but gated.

### 7.1 Phase 1 — Enforcement

| #   | Requirement                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | The workspace must have a flat-config ESLint setup using `@nx/eslint-plugin`, with a `lint` target on every project (`shell`, `workorder`, `lead`, `ui`, `platform-contract`) and a root `lint` script running it across all projects.                                                                                                                                                                                                                                                                                                      |
| 2   | Every project must declare Nx `tags` in its `project.json`: a type tag (`type:app` for the three apps, `type:lib` for libraries) and a scope tag (`scope:shell`, `scope:workorder`, `scope:lead`, `scope:shared`).                                                                                                                                                                                                                                                                                                                          |
| 3   | `@nx/enforce-module-boundaries` must be configured with `depConstraints` such that `type:app` may depend on `type:lib`; `type:lib` may depend only on `type:lib`; and no `scope:shell` / `scope:workorder` / `scope:lead` project may depend on another of those three scopes. Linting must fail on violation.                                                                                                                                                                                                                              |
| 4   | The existing cross-app import in `apps/shell/src/query-runtime.integration.test.ts` must be resolved honestly rather than exempted by default. Preferred: relocate the test to a dedicated project (e.g. `tools/integration`) tagged `type:integration` and explicitly permitted to depend on any project. Minimum acceptable: a narrowly scoped ESLint override naming the file and documenting why the exception exists. The same resolution must cover `.storybook/fixtures/feature-data.ts`, which imports types across app boundaries. |
| 5   | A CI pipeline must exist and run automatically on push and on pull request, split into a fast lane (`format:check`, lint, typecheck, `test:query`, build — every push) and a slow lane (Playwright install, `storybook:typecheck`, `storybook:build`, `storybook:test` — every PR). The steps must be the ones already documented in `README.md`, not a newly invented set.                                                                                                                                                                 |
| 6   | The fast CI lane must use Nx affected-only execution (`nx affected -t <target>`) rather than running every target on every project.                                                                                                                                                                                                                                                                                                                                                                                                         |
| 7   | A `typecheck` target must exist for each app, replacing the README's three manual `tsc --noEmit` invocations, runnable as a single `nx run-many -t typecheck`.                                                                                                                                                                                                                                                                                                                                                                              |
| 8   | Root `format` and `format:check` scripts must exist, wired to the already-installed Prettier and its `.prettierrc`, with `format:check` in the fast CI lane.                                                                                                                                                                                                                                                                                                                                                                                |
| 9   | Every app and library `build` target must declare `cache: true`, `outputs` pointing at its real output directory, and `dependsOn: ["^build"]`. Shared defaults belong in `nx.json` `targetDefaults`; per-project overrides only where output paths genuinely differ.                                                                                                                                                                                                                                                                        |
| 10  | Long-running targets (`serve`, `storybook`) must declare `persistent: true` so they do not block the Nx task graph.                                                                                                                                                                                                                                                                                                                                                                                                                         |
| 11  | `tsconfig.base.json` must set `strict: true` and raise `target` to at least `es2022`, matching what every project already overrides to. Any project failing to compile under the new base must be fixed, not exempted.                                                                                                                                                                                                                                                                                                                      |
| 12  | CI must run a dependency audit, and all workspace dependencies must be pinned to exact versions (no `^`/`~` ranges) so every project resolves identical versions.                                                                                                                                                                                                                                                                                                                                                                           |

### 7.2 Phase 2 — Shared-dependency correctness

| #   | Requirement                                                                                                                                                                                                                                                                       |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 13  | `tools/module-federation/shared.ts` must derive `@cms/ui`'s `requiredVersion` from `libs/ui/package.json` at config time (e.g. via `createRequire`) rather than the hardcoded `'0.0.1'` literal, declared with `strictVersion: false` so a mismatch warns rather than hard-fails. |
| 14  | `@cms/platform-contract` must be added to `sharedDependencies` as a singleton with `strictVersion: false` and a version derived from its own `package.json`.                                                                                                                      |
| 15  | `libs/platform-contract/package.json` must declare `"type": "module"` (not `"commonjs"`) and an `exports` map matching the shape already used by `libs/ui/package.json`.                                                                                                          |
| 16  | The unused `zustand` peer dependency must be removed from `libs/platform-contract/package.json` — the library contains no zustand code.                                                                                                                                           |
| 17  | The ambient `declare module '@tanstack/react-query'` augmentation must move out of the implementation file into a dedicated `.d.ts` file inside `libs/platform-contract`, so the global side effect is discoverable rather than incidental.                                       |
| 18  | All three runtimes (`shell`, `workorder`, `lead`) must pass an `onError` handler to `createCmsQueryClient` rather than calling it with zero arguments. The handler must route to a telemetry sink and at minimum log the event source, meta, and error.                           |
| 19  | Each remote must render its own error boundary inside its `App`, rather than relying solely on the shell's `ProviderBoundary`, so a failure inside a remote degrades that remote rather than the whole shell.                                                                     |
| 20  | The `@cms/ui` path alias — currently declared independently in `tsconfig.base.json`, three `vite.config.ts` files, and `.storybook/main.ts` — must be collapsed to a single source of truth the others derive from.                                                               |

### 7.3 Phase 3 — Package manager, data layer, and release

| #   | Requirement                                                                                                                                                                                                                                                                                                                                                                                                                           |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 21  | The workspace must migrate from npm workspaces to pnpm: add `pnpm-workspace.yaml` covering `apps/*` and `libs/*`, generate `pnpm-lock.yaml`, and remove `package-lock.json` and the root `workspaces` field. Removal of the lockfile requires explicit confirmation before deletion.                                                                                                                                                  |
| 22  | Any phantom dependency surfaced by pnpm's stricter resolution (a package imported by a project that does not declare it) must be fixed by adding the dependency to that project's `package.json`, not by loosening pnpm's hoisting configuration.                                                                                                                                                                                     |
| 23  | CI and all documentation must be updated to pnpm invocations (`pnpm install --frozen-lockfile`, `pnpm add <pkg> -F <project>`), and `coding-standards.md`'s pnpm mandate becomes accurate as a result rather than being edited.                                                                                                                                                                                                       |
| 24  | A new buildable library `libs/shared/api` (`@cms/shared-api`, tagged `type:lib` / `scope:shared`) must be created, exporting a strongly typed `customFetch<T>` over native `fetch` that injects the auth token and `Content-Type` header, throws a typed `ApiError(status, message)` on non-OK responses, and reads its base URL from environment configuration. Axios must not be introduced.                                        |
| 25  | Per-domain data-access libraries `libs/workorder/data-access` (`@cms/workorder-data-access`) and `libs/lead/data-access` (`@cms/lead-data-access`) must be created, tagged `type:lib` with their respective domain scopes, and must hold the query-key factories, query options, and DTO types currently in `apps/workorder/src/workorder.queries.ts` and `apps/lead/src/lead.queries.ts`. The apps must consume them via path alias. |
| 26  | The two relocated query modules must remain independent. They may both depend on `@cms/shared-api` and `@cms/platform-contract`, but must not depend on each other or be merged into a shared query module — this duplication is deliberate per `ARCHITECTURE-GAPS.md` Appendix D.                                                                                                                                                    |
| 27  | Boundary rules from requirement 3 must be extended so a domain's `data-access` library is importable only by its own app and by `type:integration` projects — `scope:lead` must not import `@cms/workorder-data-access` or vice versa.                                                                                                                                                                                                |
| 28  | All request and response payloads crossing `customFetch` must be validated with Zod schemas colocated in the owning `data-access` library, per `coding-standards.md`.                                                                                                                                                                                                                                                                 |
| 29  | The injectable `load*` props on remote components must be preserved through the extraction, so Storybook's Loading / Empty / Error stories continue to exercise real states.                                                                                                                                                                                                                                                          |
| 30  | `nx release` must be wired into CI so `@cms/ui` and `@cms/platform-contract` are versioned and published as real artifacts, using the existing `nx.json` `release` block, `nx-release-publish` target, and Verdaccio `local-registry` target for local verification. Root scripts must exist for both the local-registry dry run and the CI publish.                                                                                  |
| 31  | Once requirement 30 is in place, the version derived in requirements 13 and 14 must correspond to a genuinely published artifact, and CI must fail if an app is built against a `@cms/ui` version that was never published.                                                                                                                                                                                                           |

### 7.4 Phase 4 — Cleanup and documentation

| #   | Requirement                                                                                                                                                                                                                                                                                                                                    |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 32  | `context/coding-standards.md`'s `libs/shared/api` and `libs/<domain>/data-access` sections must be updated to describe the libraries as built in Phase 3, with their real names and aliases, so the document and the repo agree.                                                                                                               |
| 33  | `README.md` must be corrected: the SSR section removed or explicitly flagged "Planned — not implemented" (there is no server entry, `renderToString`, or dehydrate/hydrate anywhere in the repo); the independent-deploy claim rewritten to describe reality; and the scope caveat on `test:query` stated.                                     |
| 34  | The two `lucide-react` imports (`apps/lead/src/App.tsx`, `apps/workorder/src/App.tsx`) must be replaced with equivalent icons from `@cms/ui/icons`, and `lucide-react` must be removed from the root `package.json`. If no equivalent icon exists, it must be hand-traced from Figma following the existing `createFigmaIcon` pattern.         |
| 35  | `coding-standards.md` must state, unambiguously and without exception, that all icons are hand-traced from Figma into `libs/ui/src/icons` and that no external icon library is a dependency.                                                                                                                                                   |
| 36  | The `@cms/ui` component count must be frozen: no new components are added until existing ones have real consumers. Eleven of twelve components and all icons currently have zero consumers outside Storybook.                                                                                                                                  |
| 37  | The hand-rolled card markup in the remotes (`<article className="rounded-lg border bg-card …">`) must be replaced with the existing `SectionCard` component, as the first real consumption of a non-`Button` design-system component. Component APIs may still change freely at this point — first real usage is the validation, not a freeze. |
| 38  | `.gitignore` must be verified to exclude `apps/*/dist`, `dist/libs/*`, and `.nx/cache`, and any already-tracked build artifact must be untracked.                                                                                                                                                                                              |
| 39  | An example environment-specific `config.json` must be documented for staging and production, showing immutable versioned remote URLs and how the file is deployed alongside each app's `dist`.                                                                                                                                                 |
| 40  | A dark-mode toggle must be added to the shell's top nav, writing the selected theme to `shellStore` and applying the `.dark` class at the document root so the existing token block takes effect. The selection must persist across reloads, and the toggle must be keyboard-accessible with an accessible label.                              |
| 41  | The theme must propagate to remotes without new cross-MFE machinery — via the existing `CmsRuntime` contract or the root-level class only. No `window`, event bus, or `postMessage` mechanism may be introduced (see 6.1).                                                                                                                     |

### 7.5 Phase 5 — Remote manifest (specified, not scheduled)

> _This is the highest-cost item in the source analysis and is deliberately unscheduled. At two or three stable domains the hardcoded lists really are simpler. **Gate:** begin only when a fourth domain or a third team is on the confirmed roadmap._

| #   | Requirement                                                                                                                                                                                                                   |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 42  | `libs/platform-contract` must define a `RemoteManifest` type (`name`, `basePath`, `nav: RemoteNavItem[]`, `routes: RemoteRoute[]`).                                                                                           |
| 43  | Each remote must expose its manifest over Module Federation (`exposes: { './manifest': './src/manifest.ts' }`).                                                                                                               |
| 44  | The shell must load every registered remote's manifest at boot and derive nav entries and routes from a single iteration, replacing the three independently hardcoded lists in `apps/shell/src/App.tsx`.                      |
| 45  | Manifest loading must be failure-isolated: a remote whose manifest fails to load or is malformed is omitted from the nav and resolves to an error route. It must not crash the shell or prevent other remotes from rendering. |
| 46  | The shell must render a 404 route for unmatched paths (currently absent), and `react-router-dom` must be re-evaluated for `sharedDependencies` once remotes actually route.                                                   |

## 8. Edge Cases & Error States

- **Version mismatch after requirement 13.** With `strictVersion: false`, a mismatch produces a console warning, not a failure. The warning must be surfaced in CI output rather than swallowed, or the fix changes nothing observable.
- **Enabling `strict: true` in `tsconfig.base.json` surfaces pre-existing type errors** in files never compiled strictly. These must be fixed; `@ts-expect-error` is acceptable only with an inline reason and a linked follow-up.
- **Boundary enforcement flags violations beyond the two already known.** Each needs the same honest resolution as requirement 4 — relocate or narrowly document. A blanket rule relaxation defeats the phase.
- **`dependsOn: ["^build"]` exposes a build-order or circular-dependency problem** currently masked by apps compiling library source directly. This is the correct time to discover it.
- **The pnpm migration breaks Module Federation or Vite resolution.** pnpm's non-flat `node_modules` can surface resolution assumptions that npm's hoisting hid, particularly around MF singletons and React identity. All three apps must be served together and a remote loaded through the shell before the migration is considered done — a passing build is not sufficient evidence.
- **A phantom dependency turns out to be a peer dependency of a shared MF singleton.** Fix by declaring it correctly, not by adding it to pnpm's hoist patterns, which would reintroduce exactly the ambiguity the migration removes.
- **Pinning exact versions (requirement 12) surfaces conflicting transitive requirements.** Resolve by choosing one version explicitly and recording why, not by reverting to ranges.
- **`customFetch` is built before a real backend contract exists.** `ApiError`'s shape and the error-body parsing are therefore provisional. The library must be written so the error shape can change without every call site changing, and this must be noted in its README.
- **Moving query modules into `data-access` libraries changes their module identity under Module Federation.** `libs/shared/api` and both `data-access` libraries must be evaluated for `sharedDependencies` inclusion; if a query cache is keyed by a factory that exists twice, cache hits silently stop working. The `test:query` integration test must be run after the move.
- **`nx release` publishes a broken artifact.** The Verdaccio `local-registry` dry run must be a required step before any real publish, and the published package must be installed from the local registry and built against once, before CI publishes anywhere real.
- **`onError` fires before a telemetry sink exists.** The handler must degrade to a structured `console.error` rather than throwing or silently returning, and a telemetry handler that itself throws must not break query error handling.
- **The dark-mode toggle desynchronizes between shell and remotes**, or produces a flash of the wrong theme on load. Theme must be applied before first paint, and a remote mounting after a theme change must pick up the current theme rather than a stale default.
- **Removing `lucide-react` leaves an icon with no hand-traced equivalent.** Trace it from Figma rather than keeping the dependency for a single glyph.
- **Deleting `package-lock.json` and release scaffolding is irreversible in the working tree.** Per `context/ai-interaction.md`, no file is deleted without explicit confirmation.

## 9. Success Metrics

- CI runs on every push and PR, and catches at least one real regression before merge.
- `nx lint` fails on a deliberately introduced cross-boundary import — verifiable in one commit, then reverted.
- `nx run-many -t typecheck` and `nx run-many -t lint` both pass from a clean checkout with no manual per-app commands.
- The `@cms/ui` MF `requiredVersion` matches `libs/ui/package.json` and updates automatically when that file is bumped — no literal to forget.
- `@cms/ui` has at least one published version in a real registry, and an app builds successfully against the published artifact rather than source.
- A query error raised in any of the three runtimes produces a structured telemetry record. Baseline: zero of three.
- Every network call in the repo goes through `customFetch`; zero direct `fetch(` calls outside `libs/shared/api`.
- Zero query-key or DTO definitions remain under `apps/*/src`.
- `pnpm install --frozen-lockfile` succeeds from a clean checkout, and `npm` is referenced nowhere in the docs or CI.
- `lucide-react` appears in zero source files and zero `package.json` files.
- Cache hit rate on a repeated local `nx build` of an unchanged project is 100%. Baseline: 0%, since no `cache`/`outputs` are declared.
- `coding-standards.md` and `README.md` contain no statement contradicted by the repo, verified by a read-through against the file tree.
- At least one non-`Button` design-system component has a real, non-Storybook consumer.

## 10. Assumptions

All open questions from the initial draft were resolved with the product owner before this revision. The decisions taken, recorded here so the reasoning is not lost:

- **pnpm migration over correcting the doc** — chosen for pnpm's phantom-dependency detection, accepting that the migration is workspace-wide rather than a one-line doc fix.
- **Release infrastructure wired rather than removed** — `@cms/ui` is intended for real publication, which is also what makes requirements 13 and 31 meaningful rather than cosmetic.
- **Full data-access split, including `customFetch`** — chosen over deferring, accepting that `ApiError`'s shape is provisional until a backend contract exists (see Edge Cases).
- **`lucide-react` dropped entirely** rather than kept with a documented policy.
- **Dark-mode toggle built** rather than documenting the tokens as Storybook-only.
- **Phase 5 specified but unscheduled** — no fourth domain or third team is currently on the roadmap. If that changes, Phase 5 promotes to must-fix and sequences immediately after Phase 2.

Two items remain genuinely undetermined and are called out rather than guessed:

- **Telemetry sink (requirement 18).** No telemetry provider is configured in the repo. Initial implementation is a structured `console.error`, with the real sink swapped in behind the same callback once chosen.
- **The `TYPE-001` remote type-generation failures** recorded in both remotes' `.mf/diagnostics/latest.json` are noted in the source analysis but not diagnosed here. Assumed non-blocking for Phases 1–4; needs its own investigation.
