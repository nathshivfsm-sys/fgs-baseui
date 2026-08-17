# shadcn/ui CLI Alignment

### Product Requirements Document

## 1. Overview

This PRD covers making the shadcn/ui CLI genuinely usable against `@cms/ui`, so that future components are pulled from the official shadcn registry rather than hand-authored, and existing components sit in a structure the CLI recognises. The audience is the engineering team maintaining `libs/ui`.

The request that produced this spec was to "use shadcn components instead of Radix UI". That framing rests on a misconception worth correcting before any requirement below makes sense.

### 1.1 shadcn/ui is not an alternative to Radix UI

shadcn/ui is not a component library and is not a competitor to Radix. It is a **registry of component source code that you copy into your own repo**, and the interactive components in that registry are themselves built on Radix UI primitives. When you run `npx shadcn add dropdown-menu`, the file it writes into your project imports `@radix-ui/react-dropdown-menu`. Radix supplies unstyled, accessible behaviour — focus management, keyboard interaction, portalling, ARIA wiring; shadcn supplies a styled, opinionated composition of it that you then own and edit.

"Replacing Radix with shadcn" is therefore not a thing that can be done. Adopting shadcn _means adopting Radix_, and `libs/ui` already did both: `libs/ui/package.json` declares six `@radix-ui/*` dependencies, and `libs/ui/components.json` — the shadcn CLI's config file, with `"style": "new-york"` — already exists.

### 1.2 What is actually wrong

The repo is shadcn-shaped but not shadcn-operable. `components.json` declares path aliases (`@cms/ui/components/ui`, `@cms/ui/lib/cn`, `@cms/ui/hooks`) that do not resolve — `tsconfig.base.json` maps only the bare specifier `@cms/ui`. Because the CLI resolves its aliases through TypeScript path mappings, `npx shadcn add <component>` cannot correctly place a file today. On top of that, the existing components use a directory-per-component layout the CLI does not produce, and several carry project-invented names that collide conceptually with registry names.

The result is a design system that looks like it is on the shadcn workflow but is in practice hand-maintained, so every new component is written from scratch instead of starting from a vetted, accessibility-reviewed upstream implementation.

## 2. Problem Statement

Adding a component to `@cms/ui` today means writing Radix composition, variant styling, and accessibility wiring by hand, then reviewing it against nothing in particular. The shadcn registry exists precisely to remove that work — its implementations are widely used, accessibility-reviewed, and kept current with Radix API changes — but the workspace cannot consume it:

- **The CLI cannot resolve where to write.** `components.json` aliases point at `@cms/ui/components/ui`, `@cms/ui/lib`, and `@cms/ui/hooks`. `tsconfig.base.json` declares one path, `"@cms/ui": ["./libs/ui/src/index.ts"]`. No subpath resolves, so alias resolution fails and generated imports would not compile.
- **The layout does not match what the CLI writes.** Canonical shadcn writes flat files — `components/ui/button.tsx`. This repo uses `components/ui/button/button.tsx` plus a barrel `index.ts` and a colocated `.stories.tsx`. Running `add` would drop a flat file beside the directories, producing two conventions in one folder.
- **`components.json` is missing fields the current CLI expects.** There is no `$schema`, no `iconLibrary`, and no `tailwind.config` key. Without an explicit empty `tailwind.config`, the CLI cannot reliably detect that this is a Tailwind v4 CSS-first project.
- **The default icon library is a direct conflict.** shadcn's generated components import icons from `lucide-react` by default. The monorepo remediation spec (`monorepo-architecture-remediation-prd.md`, requirement 34) removes `lucide-react` entirely in favour of hand-traced Figma icons. Every `shadcn add` would reintroduce the dependency that spec deletes.
- **Component names diverge from the registry.** `text-input`, `icon-button`, `section-card`, `metric-card`, `callout`, and `field` are project inventions. Their nearest registry equivalents are `input`, `button` with a size variant, `card`, `alert`, and `label`/`form`. Nothing records which project components are meant to be shadcn components under a different name and which are genuinely bespoke, so a future `shadcn add input` would silently duplicate `text-input`.
- **`lib/cn.ts` diverges from the registry's `lib/utils.ts`.** Generated components import `cn` from the `utils` alias; the alias is declared correctly but, per the first point, does not resolve.
- **The declared `hooks` alias has no directory behind it.** Any registry component that ships a hook (`use-mobile`, for example) has nowhere to land.
- **`dropdown-menu` has no stories file**, unlike every other component, so it is not covered by the Storybook a11y check that `.storybook/preview.ts` enforces at `error` level.

The token layer, by contrast, is already correct and needs no migration — see 6.1.

## 3. Goals

- State the shadcn/Radix relationship in the project's own documentation so this question does not recur.
- Make `npx shadcn add <component>` work correctly against `libs/ui` — correct aliases, resolvable TypeScript paths, complete `components.json`.
- Align the existing twelve components to the flat-file layout the CLI writes, without changing their public API or behaviour.
- Prevent the shadcn CLI from reintroducing `lucide-react`, keeping the hand-traced Figma icon set as the single icon source.
- Record, per component, whether it is a shadcn registry component (and which one), a registry component intentionally modified, or a bespoke FieldPro component with no registry equivalent.
- Define the standing workflow for adding a component: check the registry first, generate via CLI, then adapt — rather than hand-authoring from scratch.

## 4. Non-Goals

- **Removing Radix UI.** Radix is what shadcn's interactive components are built on. The six `@radix-ui/*` dependencies stay.
- **Rewriting existing components' behaviour or public API.** This work is structural — file layout, config, and documentation. `Button`'s seven variants, `MetricCard`'s Figma-derived layout, and every existing prop signature are preserved exactly. Any behavioural change is out of scope and would need its own spec.
- **Regenerating existing components from the registry and discarding local work.** The components are Figma-derived and deliberately diverge from upstream defaults. Alignment means matching _structure and naming conventions_, not reverting _implementations_.
- **Replacing the token layer or changing any colour.** The tokens are already shadcn-compatible (6.1) and Figma-derived.
- **Adding new components.** The remediation spec freezes the component count until existing components have real consumers (`monorepo-architecture-remediation-prd.md`, requirement 36). This spec establishes _how_ the next component gets added; it does not add one.
- **Adopting a shadcn theme or `baseColor` palette.** `cssVariables: true` with project tokens is the correct configuration and stays.
- **Everything in `monorepo-architecture-remediation-prd.md`** — boundaries, CI, pnpm, the data layer, release. Those are that spec's scope.

## 5. User Stories

- As a developer adding a `Dialog` to the design system, I want `npx shadcn add dialog` to place a correctly-importing file in the right directory, so that I start from a vetted accessible implementation instead of composing Radix primitives by hand.
- As a developer, I want every component in `components/ui/` to follow one file convention, so that I don't have to check whether a given component is a directory or a file before importing it.
- As a developer running the shadcn CLI, I want the generated component to use `@cms/ui` icons rather than pulling in `lucide-react`, so that the icon policy the remediation spec establishes isn't quietly reversed.
- As a developer reviewing `TextInput`, I want to know whether it's the shadcn `input` component under a different name or something bespoke, so that I know whether upstream fixes apply to it.
- As a reviewer, I want the shadcn/Radix relationship stated in `coding-standards.md`, so that "should we drop Radix for shadcn?" gets answered by the document rather than re-litigated.

## 6. Reference / Source Material

- `libs/ui/components.json` — the existing shadcn CLI config: `style: "new-york"`, `rsc: false`, `tsx: true`, `tailwind.css: "src/styles.css"`, `baseColor: "neutral"`, `cssVariables: true`.
- `libs/ui/package.json` — six Radix dependencies: `react-dropdown-menu`, `react-radio-group`, `react-select`, `react-slot`, `react-switch`, `react-tabs`, alongside `class-variance-authority`, `clsx`, and `tailwind-merge` — the exact dependency set canonical shadcn requires.
- `libs/ui/src/styles/theme.css` and `tokens.css` — the token layer (see 6.1).
- shadcn/ui official documentation — `components.json` schema, the Tailwind v4 setup guide, and the CLI's alias-resolution behaviour.

### 6.1 What is already correct

The token layer needs no change and must not be touched:

- `tokens.css` already defines the canonical shadcn variable set on `:root` — `--background`, `--foreground`, `--card`, `--card-foreground`, `--popover`, `--popover-foreground`, `--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground`, `--muted`, `--muted-foreground`, `--accent`, `--accent-foreground`, `--destructive`, `--border`, `--input`, `--ring`, `--radius` — plus FieldPro extensions (`--brand`, `--brand-blue`, `--success`, `--warning`, `--heading`) that upstream does not have and does not object to.
- `theme.css` uses the `@theme inline { --color-background: var(--background); … }` bridge, which is exactly the pattern shadcn's own Tailwind v4 guide prescribes.
- A complete `.dark` block exists.
- `cn` is implemented as `twMerge(clsx(inputs))` — byte-for-byte the upstream implementation.
- Tailwind v4 CSS-first configuration with no `tailwind.config.js`, matching both `coding-standards.md` and current shadcn.

The consequence: generated components will style correctly against these tokens with no adaptation. The gap is structural and configurational only.

### 6.2 Current component inventory

Thirteen entries under `libs/ui/src/components/ui/`, each a directory containing `<name>.tsx`, `index.ts`, and (except `dropdown-menu`) `<name>.stories.tsx`:

`button`, `callout`, `dropdown-menu`, `field`, `icon-button`, `metric-card`, `radio-group`, `section-card`, `select`, `switch`, `tabs`, `text-input`, `textarea`.

## 7. Functional Requirements

### 7.1 Configuration — make the CLI work

| #   | Requirement                                                                                                                                                                                                                                                                                                                                                                   |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `tsconfig.base.json` must declare subpath mappings that satisfy every alias in `components.json`: `@cms/ui/components/*`, `@cms/ui/lib/*`, and `@cms/ui/hooks/*`, each resolving into `libs/ui/src/`. The existing bare `@cms/ui` → `libs/ui/src/index.ts` mapping must be preserved so all current imports keep working.                                                     |
| 2   | The new subpath aliases must resolve identically in all four places the `@cms/ui` alias is configured — `tsconfig.base.json`, the three app `vite.config.ts` files, and `.storybook/main.ts`. Where `monorepo-architecture-remediation-prd.md` requirement 20 collapses these into a single source of truth, the subpath mappings must be added there rather than duplicated. |
| 3   | Adding subpath aliases must not create a second import path for the same component in application code. The barrel `@cms/ui` remains the only sanctioned specifier for apps; the subpath aliases exist so the CLI and intra-library imports resolve. This must be enforced by an ESLint `no-restricted-imports` rule blocking `@cms/ui/*` subpath imports outside `libs/ui`.  |
| 4   | `libs/ui/components.json` must add a `$schema` field pointing at the official shadcn schema URL.                                                                                                                                                                                                                                                                              |
| 5   | `libs/ui/components.json` must declare `"tailwind": { "config": "" }` alongside the existing `tailwind` keys, so the CLI correctly detects Tailwind v4 CSS-first configuration rather than assuming v3.                                                                                                                                                                       |
| 6   | `libs/ui/components.json` must declare an explicit `iconLibrary` so the CLI does not default to `lucide-react`.                                                                                                                                                                                                                                                               |
| 7   | A `libs/ui/src/hooks/` directory must exist with a barrel `index.ts`, so registry components that ship hooks have a declared destination. If it would otherwise be empty, the `hooks` alias must instead be removed from `components.json` — a declared alias with no directory behind it is not acceptable.                                                                  |
| 8   | Running `npx shadcn add <component>` inside `libs/ui` must place the file at `libs/ui/src/components/ui/<component>.tsx` with imports that typecheck against the configured aliases and require no manual path rewriting. This must be verified end-to-end against at least one real registry component before this phase is considered complete.                             |

### 7.2 Structure — align existing components

| #   | Requirement                                                                                                                                                                                                                                                                                                                                                                                                        |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 9   | Every component under `libs/ui/src/components/ui/` must be flattened from `<name>/<name>.tsx` to `<name>.tsx`, matching the layout the CLI writes. Per-component `index.ts` barrels are removed.                                                                                                                                                                                                                   |
| 10  | Story files must be relocated to a sibling path that does not collide with CLI-generated files — either `<name>.stories.tsx` alongside the flattened component, or a dedicated `stories/` directory. Whichever is chosen must be applied uniformly and recorded in `coding-standards.md`, so a future `shadcn add` never overwrites or sits awkwardly beside a story.                                              |
| 11  | `libs/ui/src/components/ui/index.ts` must be updated to export from the flattened paths, and `libs/ui/src/index.ts` must continue to export the identical public surface it does today.                                                                                                                                                                                                                            |
| 12  | No component's public API may change during the flattening: exported names, prop types, variant names, and default values must be identical before and after. This is a file-move refactor only.                                                                                                                                                                                                                   |
| 13  | Every import of a component across `apps/` and `libs/` must continue to resolve after the move, verified by `nx run-many -t typecheck` and a Storybook build.                                                                                                                                                                                                                                                      |
| 14  | `libs/ui/src/lib/cn.ts` must be renamed to `libs/ui/src/lib/utils.ts` to match the registry convention that generated components import from, with the `utils` alias in `components.json` updated accordingly and the `cn` export unchanged. Alternatively, `lib/cn.ts` is kept and the alias left pointing at it — but the choice must be recorded, and generated components must import successfully either way. |
| 15  | A `dropdown-menu.stories.tsx` must be added, bringing the one component currently without stories under the Storybook a11y check that `.storybook/preview.ts` enforces at `error` level.                                                                                                                                                                                                                           |

### 7.3 Icons — prevent lucide reintroduction

| #   | Requirement                                                                                                                                                                                                                                                                                         |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 16  | Any component generated by the shadcn CLI that imports from `lucide-react` must have those imports replaced with equivalent icons from `@cms/ui/icons` before the component is merged. Where no equivalent exists, the icon is hand-traced from Figma using the existing `createFigmaIcon` pattern. |
| 17  | An ESLint `no-restricted-imports` rule must block `lucide-react` across the entire workspace, so a generated component importing it fails lint rather than passing review unnoticed.                                                                                                                |
| 18  | The icon-replacement step must be documented as a mandatory part of the add-a-component workflow (requirement 22), not left as something a reviewer is expected to catch.                                                                                                                           |

### 7.4 Documentation — record the relationship and the workflow

| #   | Requirement                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 19  | `context/coding-standards.md` must state plainly that shadcn/ui is a source-code registry built on Radix UI primitives, not an alternative to Radix, and that both are intentionally used together. It must state that `@radix-ui/*` dependencies are expected and correct.                                                                                                                                                                                                                                                                           |
| 20  | A component provenance table must be added to `libs/ui`'s documentation (README or Storybook docs page), recording for each of the thirteen components whether it is: **(a)** a shadcn registry component used substantially as generated, naming the registry component; **(b)** a registry component intentionally modified, naming it and summarising the divergence; or **(c)** bespoke FieldPro, with no registry equivalent.                                                                                                                    |
| 21  | Components in category (b) must have their divergence from upstream recorded in a comment at the top of the file, so a future developer comparing against the registry knows the difference is deliberate.                                                                                                                                                                                                                                                                                                                                            |
| 22  | `context/coding-standards.md` must document the standing workflow for adding a design-system component: **1.** check the shadcn registry for an existing component; **2.** if one exists, generate it with `npx shadcn add`; **3.** replace any `lucide-react` icons with `@cms/ui` icons; **4.** adapt styling to FieldPro tokens; **5.** add stories including a `play` function; **6.** record it in the provenance table. Hand-authoring from scratch is reserved for components with no registry equivalent, and requires a note explaining why. |
| 23  | The provenance table must explicitly flag the naming collisions — `text-input` versus registry `input`, `section-card` versus registry `card`, `callout` versus registry `alert`, `icon-button` versus `button` with an icon size, `field` versus registry `label`/`form` — so a future `shadcn add input` is recognised as a duplicate rather than merged as a new component.                                                                                                                                                                        |
| 24  | `coding-standards.md` must state that shadcn's `style` is pinned to `new-york` and that mixing styles within one design system is not permitted.                                                                                                                                                                                                                                                                                                                                                                                                      |

## 8. Edge Cases & Error States

- **Subpath aliases create a second valid import path for every component.** `@cms/ui` and `@cms/ui/components/ui/button` would both resolve, and the codebase would drift into using both — which under Module Federation can mean the same component loaded twice as distinct modules. Requirement 3's lint rule is the mitigation, and must be in place in the same change that adds the aliases, not afterwards.
- **The flattening (requirement 9) is a large mechanical diff across every consumer.** It should land as its own commit containing no behavioural change, so that a later regression can be bisected against a pure file move.
- **Storybook's `main.ts` globs may not match relocated story files**, silently dropping components from Storybook and from the a11y check. A Storybook build must confirm all thirteen components still appear, not just that the build exits zero.
- **Renaming `cn.ts` to `utils.ts` (requirement 14) breaks any deep import of `@cms/ui/lib/cn`.** The subpath alias in `components.json` currently names that exact file, so both must change together.
- **A registry component's Radix dependency version conflicts with an installed one.** `shadcn add` installs peer dependencies at its own resolved version, which can conflict with the exactly-pinned versions the remediation spec requires. Generated `package.json` changes must be reviewed and re-pinned before commit rather than accepted as written.
- **A generated component pulls in a Radix package that is not currently a dependency** — expected and acceptable, provided it is added to `libs/ui/package.json` explicitly and pinned, not left as a transitive.
- **A generated component's default variants clash with the FieldPro token palette**, rendering with upstream's neutral `baseColor` rather than project tokens. `cssVariables: true` should prevent this, but the first generated component must be visually verified in both light and dark mode.
- **`shadcn add` overwrites an existing component.** The CLI prompts before overwriting, but in a non-interactive or `--yes` run it will not. Requirement 23's provenance table is the defence — check for a differently-named equivalent before running `add`.
- **The `hooks` alias is removed (requirement 7) and a later registry component needs one.** Reinstating it is trivial, but the alias and directory must be added together.
- **Blocking `lucide-react` at lint level (requirement 17) fires on the two current usages** in `apps/lead/src/App.tsx` and `apps/workorder/src/App.tsx`. Those are removed by `monorepo-architecture-remediation-prd.md` requirement 34; this rule must land after that change or the workspace fails lint on arrival.

## 9. Success Metrics

- `npx shadcn add <component>` run inside `libs/ui` produces a file that typechecks, lints, builds, and renders correctly with no manual path or import fixes. Baseline: fails today.
- All thirteen components live at `components/ui/<name>.tsx` — zero per-component directories, zero per-component barrels.
- `nx run-many -t typecheck`, `nx run-many -t lint`, `nx build`, and the Storybook build all pass after the flattening, with all thirteen components present in Storybook.
- The public export surface of `@cms/ui` is byte-identical before and after the structural work, verified against the generated `.d.ts`.
- Every one of the thirteen components has an entry in the provenance table, and every category-(b) component carries an in-file divergence note.
- `lucide-react` appears in zero source files, and an added import of it fails lint.
- Every component has a stories file — currently twelve of thirteen.
- The next component added to `@cms/ui` after this work goes through the registry-first workflow, with the CLI invocation recorded in its PR description.

## 10. Assumptions

- **The originating request — "use shadcn components instead of Radix UI" — was based on the understanding that these are competing libraries.** They are not: shadcn's interactive components are built on Radix. This spec was confirmed with the product owner as covering CLI enablement and structural alignment rather than any Radix removal. Removing Radix was considered and rejected as not feasible — the registry's own `dropdown-menu`, `select`, `tabs`, `switch`, and `radio-group` recipes are all Radix-based, so there is nothing to switch to.
- **Existing component implementations are deliberate and Figma-derived**, so alignment is structural only. If the intent were instead to adopt upstream implementations wholesale and re-apply Figma styling on top, that is a materially larger and different project.
- **Sequencing.** Requirement 17 (lint-block `lucide-react`) depends on `monorepo-architecture-remediation-prd.md` requirement 34 (remove the two existing usages) landing first. Requirement 2 (alias configuration) is best sequenced after that spec's requirement 20 (collapse the duplicated alias declarations), to avoid configuring the same alias in four places twice.
- **`iconLibrary` value (requirement 6).** The shadcn CLI's supported values are a fixed set; whether it accepts a custom local icon source, or whether requirement 16's manual replacement step is the only viable mechanism, must be confirmed against the CLI's current behaviour during implementation.
- **Story-file location (requirement 10).** Colocation alongside the flattened component is assumed, since it matches current practice and Storybook's existing globs. A dedicated `stories/` directory is the alternative if colocation proves to interfere with CLI overwrites.
