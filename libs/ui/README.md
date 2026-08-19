# @cms/ui

Shared React 19 + TypeScript design-system components for the CMS micro frontends. The package uses shadcn composition patterns, Tailwind CSS v4 semantic tokens, and side-effect-free JavaScript exports. All interactive primitives run on Base UI (`@base-ui/react`), which also unlocked `ComboboxField` -- a filterable, searchable select that Radix never shipped stable. See "Known issues" below for an open dev-server-only anomaly.

## Consume from an MFE

```tsx
// Import once from the consuming application's CSS entry.
@import 'tailwindcss';
@import '@cms/ui/styles.css';
```

```tsx
import {
  Button,
  ComboboxField,
  LocationPinIcon,
  MetricCard,
  RadioGroupField,
  SelectField,
  TextInput,
} from '@cms/ui';

<TextInput label="Code" name="code" placeholder="Enter code" required />
<SelectField label="Job type" name="jobType" options={[{ label: 'Maintenance', value: 'maintenance' }]} />
<ComboboxField label="Assign to" name="assignee" options={[{ label: 'Alex Morgan', value: 'alex-morgan' }]} />
<RadioGroupField label="Pricing" name="pricing" options={[{ label: 'Static', value: 'static' }]} />
<MetricCard
  label="Total locations"
  value={48}
  description="Across all business units"
  icon={<LocationPinIcon />}
  tone="blue"
/>
<Button loading={saving} loadingText="Saving…">Save</Button>
```

Components accept `className` for extension without requiring MFE-specific forks. Native inputs support both `value`/`onChange` and `defaultValue`; Base UI-backed controls support `value`/change callbacks and default-value equivalents.

## Public components

| Component                | Default                               | Primary configuration                                                                               |
| ------------------------ | ------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `Button`                 | `variant="default"`, `size="default"` | `variant`, `size`, `loading`, `loadingText`, `render`, native button events                         |
| `IconButton`             | ghost-compatible square default size  | required `label`, `icon`, `size`, all `Button` states                                               |
| `Checkbox`               | 16px, Base UI                         | `size`, `invalid`, `indeterminate`, `checked`/`defaultChecked`, `onCheckedChange`                   |
| `Accordion*`             | single panel open, Base UI            | `value`/`defaultValue` (array), `multiple`, per-item `disabled`, height transition                  |
| `Avatar*`                | 32px, initials fallback               | `size` (published as `data-size`), `AvatarImage`/`AvatarFallback`/`AvatarBadge`/`AvatarGroup`       |
| `Card*`                  | `size="default"` (16px spacing)       | `size`, header/title/description/action/content/footer slots                                        |
| `Dialog*`                | modal, close action, Base UI          | `showCloseButton`, `closeLabel`, header/footer slots; footer `showCloseButton`                      |
| `Popover*`               | 288px wide, bottom/center             | `align`, `alignOffset`, `side`, `sideOffset`, header/title/description slots                        |
| `Calendar`               | single month, label caption           | `mode`, `captionLayout`, `buttonVariant`, `showWeekNumber`, all react-day-picker props              |
| `TextInput`              | 36px text field                       | `label`, `placeholder`, adornments, `error`, `helperText`, `readOnly`, `loading`                    |
| `Textarea`               | 80px minimum height                   | `label`, `size`, `error`, `helperText`, native resize/value props                                   |
| `SelectField`            | 36px Base UI Select                   | `options`, `placeholder`, `value`, `defaultValue`, `onValueChange`, field messaging                 |
| `Select*` primitives     | composable Base UI API                | trigger/content/item composition for advanced consumers                                             |
| `RadioGroupField`        | horizontal group                      | `options`, orientation, controlled/uncontrolled value, error/disabled states                        |
| `RadioGroup*` primitives | composable Base UI API                | custom radio compositions                                                                           |
| `SwitchField`            | 44x23px, label before                 | `checked`, `defaultChecked`, `onCheckedChange`, `size`, `labelPosition`                             |
| `Switch`                 | 44x23px                               | low-level Base UI switch                                                                            |
| `Tabs*`                  | underline tabs, Base UI               | controlled/uncontrolled value, disabled triggers, keyboard navigation                               |
| `DropdownMenu*`          | modal popup, Base UI                  | `DropdownMenuGroup` required around `DropdownMenuLabel`; items use `onClick`, not `onSelect`        |
| `ComboboxField`          | 36px filterable Base UI Combobox      | `options`, `placeholder`, `value`, `defaultValue`, `onValueChange`, `emptyMessage`, field messaging |
| `Combobox*` primitives   | composable Base UI API                | input/trigger/content/item composition; `ComboboxOption.label` must be a `string`                   |
| `Field`                  | 4px vertical gap                      | reusable label, description, required, helper, error, disabled layout                               |
| `Callout`                | `variant="info"`                      | info/success/warning/error, optional icon and title                                                 |
| `MetricCard`             | blue icon tone, 102px minimum height  | `label`, `value`, optional `icon`/`description`, icon `tone`, description tone, loading state       |
| `SectionCard*`           | 16px radius/padding                   | semantic settings/pricing section composition                                                       |

### Shared internals worth knowing

- `Card` and `SectionCard` share one surface definition, `cardSurfaceVariants` (radius, border, background). `Card` is the content card with header/action/footer slots; `SectionCard` is the page-level `<section>` group. Neither redefines the surface.
- `Dialog`'s corner close action is an `IconButton`, and its footer dismiss action is a `Button`, both passed through Base UI's `render` prop rather than reimplemented. `Calendar`'s day cells and month navigation reuse `Button`/`buttonVariants` the same way.
- `Combobox` reuses `selectTriggerVariants` for its input geometry; `SelectField`, `ComboboxField`, `TextInput`, and `Textarea` all compose `Field` for label/description/error layout.
- Composed parts that need to react to a parent's configuration read it from a `data-*` attribute on the root (`data-size` on `Card`/`Avatar`, `data-slot` on every part). `Calendar` also keys off `data-slot` to drop its background inside `CardContent` and `PopoverContent`.

## Design contract

Figma values are centralized in `src/styles/tokens.css` and registered as Tailwind utilities by `src/styles/theme.css`. Form controls use Inter at 14px, 1.4 line-height, 8px radii, 1px borders, and 32/36/40px heights. `brand` is Pricing blue (`#0049bc`), `tab-active` is indigo (`#272757`), and `toggle-active` is green (`#009951`). Metric cards use a 102px minimum height, 44px icon tile, 12px radius, and semantic blue/green/orange/purple/neutral tones. Dark mode overrides remain semantic rather than component-specific.

`components.json`'s `style` is `base-nova`: the shadcn CLI's `-b/--base` choice isn't a separate config field, it's baked into `style` itself (`init -b base` writes `style: "<base>-<preset>"`, e.g. `base-nova`), which is what the CLI resolves into a registry URL (`.../r/styles/{style}/{name}.json`). This was `new-york` -- a pre-Base UI, Radix-era style -- until this migration; it now points at the Base UI registry, matching the six components already ported by hand.

`npx shadcn add <component>` now runs: `tsconfig.base.json` declares a wildcard, `"@cms/ui/*": ["./libs/ui/src/*"]`, alongside the existing bare `"@cms/ui": ["./libs/ui/src/index.ts"]` mapping, so the CLI can resolve `components.json`'s `components`/`ui`/`lib`/`hooks`/`utils` aliases to real directories. The CLI still has one operational quirk worth knowing: it resolves tsconfig `paths` relative to its own working directory rather than to the tsconfig file that declares them, so running it with `--cwd libs/ui` alone drops files a directory too deep (`libs/ui/libs/ui/src/...`). Always pass an explicit `--path`, e.g. from the workspace root:

```bash
npx shadcn@latest add <component> --cwd libs/ui --path ./src/components/ui
```

`@cms/ui/*` deep imports (e.g. `import { Button } from '@cms/ui/components/ui/button'`) are also supported from `apps/*` code now, not just inside `libs/ui` -- the `no-restricted-imports` rule that used to block them outside the library is gone. Two other places had to change to make that real rather than just typecheck: `tools/module-federation/shared.ts`'s `workspaceAliases()` (shared by all four `vite.config.ts` files and `.storybook/main.ts`) resolves `@cms/ui/<subpath>` to `libs/ui/src/<subpath>` via an array-form Vite alias, and `sharedDependencies` there has a `'@cms/ui/'` entry (trailing slash is `@module-federation/vite`'s prefix-share convention) so a deep-imported component is still deduplicated as a Module Federation singleton across host/remote bundles, the same way the barrel import is. The barrel remains the default for normal usage; deep imports exist for cases that want a single component without the full `@cms/ui` surface.

One caveat worth flagging, not introduced by this and not fully understood: `@module-federation/vite` logs `Detected alias conflicts with shared modules ... may bypass Module Federation's sharing mechanism` for every `@cms/ui*` entry (this predates the deep-import work -- it already fired for the plain barrel and for `@cms/platform-contract`/`@cms/shared-api` before any of this changed). In practice a build-output check showed the deep import folding into the same already-shared `@cms/ui` module rather than duplicating it, and a real browser check confirmed the component renders correctly -- but whether this warning reflects a real, deeper sharing gap that predates this work is still open. Worth a closer look if MF sharing behavior is ever investigated directly.

The workflow for adding a component is in `context/coding-standards.md` ("Adding a Design System Component"): check the registry and the provenance table below first, generate with `shadcn add` when a registry equivalent exists, then swap icons, retoken the styling, add stories with a `play` function, and record the result below.

## Component provenance

Where each component came from. Check this before running `shadcn add` — several of ours solve a registry problem under a different name, so a component that looks missing may already exist.

**(a) Registry component, used substantially as generated.** None currently. Every component here has either been reworked onto Base UI or was written for a FieldPro pattern with no registry equivalent. A component generated by `shadcn add` and kept close to the registry output belongs in this category.

**(b) Registry component, intentionally modified.** All were hand-migrated from the Radix-era registry output to Base UI, which changes the primitive imports and the polymorphism mechanism (`render` prop, not `asChild`):

| Component       | Registry source | Divergence                                                                                                                |
| --------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `Button`        | `button`        | `asChild` replaced by Base UI `render`; adds `loading`/`loadingText`                                                      |
| `Select*`       | `select`        | Base UI Select; adds the `SelectField` field-wrapper layer                                                                |
| `Switch`        | `switch`        | Base UI Switch; adds `SwitchField`, `size`, `labelPosition`                                                               |
| `Tabs*`         | `tabs`          | Base UI Tabs; underline visual rather than the registry's boxed variant                                                   |
| `RadioGroup*`   | `radio-group`   | Base UI Radio; adds the `RadioGroupField` wrapper                                                                         |
| `DropdownMenu*` | `dropdown-menu` | Base UI Menu; items use `onClick`, not `onSelect`; `DropdownMenuGroup` required around `DropdownMenuLabel`                |
| `Combobox*`     | `combobox`      | Written against Base UI's Combobox (`b15c329`) — Radix never shipped one, so there was no registry equivalent at the time |

**(c) Bespoke FieldPro — no registry equivalent.** Traced from the Figma component sets:

| Component      | Why it is not a registry component                                                  |
| -------------- | ----------------------------------------------------------------------------------- |
| `TextInput`    | Figma's field pattern: label, adornments, helper/error, loading, all in one control |
| `Textarea`     | Same field contract as `TextInput`, sized for multi-line                            |
| `Field`        | The shared label/description/required/error layout the above compose                |
| `Callout`      | FieldPro's info/success/warning/error banner                                        |
| `IconButton`   | Square icon-only action with a required accessible `label`                          |
| `MetricCard`   | Dashboard stat tile — 102px min height, 44px icon tile, semantic tones              |
| `SectionCard*` | Page-level `<section>` grouping for settings/pricing composition                    |

### Naming collisions — read before `shadcn add`

Our name differs from the registry's for the same job. Running `add` on the right-hand name creates a duplicate rather than an upgrade:

| Ours          | Registry equivalent  | Note                                                                                                                                                                                                                                                |
| ------------- | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `TextInput`   | `input`              | Do not add `input`                                                                                                                                                                                                                                  |
| `SectionCard` | `card`               | Related, not identical. `SectionCard` is a page-level `<section>` group. Adding the registry's `card` is reasonable for a content card with header/action/footer slots, but give the two a shared surface definition rather than two competing ones |
| `Callout`     | `alert`              | Do not add `alert`                                                                                                                                                                                                                                  |
| `IconButton`  | `button` (icon size) | Covered by our `Button` + `IconButton` pair                                                                                                                                                                                                         |
| `Field`       | `label` / `form`     | Do not add either                                                                                                                                                                                                                                   |

Every public component has an autodocs Storybook entry with state, size, edge-case, and interaction examples. Run:

```bash
pnpm run storybook:typecheck
pnpm run storybook:test
pnpm run storybook:build
```

## Accessibility

Labels and messages are linked by generated IDs, invalid fields expose `aria-invalid`, errors use live alert semantics, loading actions expose `aria-busy`, and icon-only actions require an accessible `label` -- including `ComboboxTrigger`, which defaults its own to "Show options" since it's a separate interactive control from the input, and `DialogContent`'s close action, whose label is configurable via `closeLabel`. `Checkbox` renders a `button[role=checkbox]` (Base UI), so pair a visible label with `aria-labelledby` rather than `label[for]`. Select, switch, tabs, radio, dropdown menu, and combobox all use Base UI keyboard/focus behavior. Menus are modal by default: the rest of the page goes `aria-hidden`/inert while one is open. Do not replace visible labels with placeholders.

## Known issues

`Switch` runs on Base UI (`@base-ui/react`) as of the Radix -> Base UI
migration. The automated gate is green — `nx lint ui`, `nx typecheck ui`,
`storybook:typecheck`, `nx build ui`, and `storybook:test` (real Chromium via
Vitest browser mode) all pass, including the a11y `test: 'error'` check and
an interaction test that confirms `defaultChecked` applies correctly and
toggles as expected.

However, the interactive Storybook dev preview (`pnpm run storybook` / `nx run
ui:storybook`) currently renders `Switch`'s initial `defaultChecked`/`checked`
state incorrectly — the control visually and functionally shows unchecked
regardless of the prop. This reproduces even after clearing Vite's dep cache
and forcing `@base-ui/react/switch` into `optimizeDeps.include`, and does not
affect `RadioGroup`'s equivalent Base UI-backed story in the same dev
session, so it is isolated to Base UI's `SwitchRoot` under this repo's
Storybook Vite dev config specifically — not the component code, not the
production build, and not the `storybook:test` harness (which bundles
differently). Root cause not yet found. If you notice a Base UI-backed
control looking wrong only in the interactive dev server, check
`storybook:test` before assuming a regression.

## Figma assumptions

The linked frame shows desktop layout and default/selected states but does not expose queryable component-set pages for every hidden variant. Hover, active, focus-visible, disabled, error, loading, read-only, and dark-mode behavior therefore follows the shared shadcn/Base UI accessibility contract while retaining the frame's visible dimensions, typography, spacing, radii, and colors. Responsive behavior is intrinsic: controls fill their container, tabs scroll horizontally, and fields/cards use min-width-safe layouts; no unsupported mobile screen composition was inferred.
