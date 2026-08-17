# @cms/ui

Shared React 19 + TypeScript design-system components for the CMS micro frontends. The package uses shadcn composition patterns, Tailwind CSS v4 semantic tokens, and side-effect-free JavaScript exports. Primitives are migrating from Radix UI to Base UI (`@base-ui/react`) component by component; see "Known issues" below for migration status and an open dev-server-only anomaly.

## Consume from an MFE

```tsx
// Import once from the consuming application's CSS entry.
@import 'tailwindcss';
@import '@cms/ui/styles.css';
```

```tsx
import {
  Button,
  LocationPinIcon,
  MetricCard,
  RadioGroupField,
  SelectField,
  TextInput,
} from '@cms/ui';

<TextInput label="Code" name="code" placeholder="Enter code" required />
<SelectField label="Job type" name="jobType" options={[{ label: 'Maintenance', value: 'maintenance' }]} />
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

Components accept `className` for extension without requiring MFE-specific forks. Native inputs support both `value`/`onChange` and `defaultValue`; Radix controls support `value`/change callbacks and default-value equivalents.

## Public components

| Component                | Default                               | Primary configuration                                                                         |
| ------------------------ | ------------------------------------- | --------------------------------------------------------------------------------------------- |
| `Button`                 | `variant="default"`, `size="default"` | `variant`, `size`, `loading`, `loadingText`, `asChild`, native button events                  |
| `IconButton`             | ghost-compatible square default size  | required `label`, `icon`, `size`, all `Button` states                                         |
| `TextInput`              | 36px text field                       | `label`, `placeholder`, adornments, `error`, `helperText`, `readOnly`, `loading`              |
| `Textarea`               | 80px minimum height                   | `label`, `size`, `error`, `helperText`, native resize/value props                             |
| `SelectField`            | 36px Radix Select                     | `options`, `placeholder`, `value`, `defaultValue`, `onValueChange`, field messaging           |
| `Select*` primitives     | composable Radix API                  | trigger/content/item composition for advanced consumers                                       |
| `RadioGroupField`        | horizontal group                      | `options`, orientation, controlled/uncontrolled value, error/disabled states                  |
| `RadioGroup*` primitives | composable Radix API                  | custom radio compositions                                                                     |
| `SwitchField`            | 44x23px, label before                 | `checked`, `defaultChecked`, `onCheckedChange`, `size`, `labelPosition`                       |
| `Switch`                 | 44x23px                               | low-level Base UI switch                                                                      |
| `Tabs*`                  | underline tabs                        | controlled/uncontrolled value, disabled triggers, keyboard navigation                         |
| `Field`                  | 4px vertical gap                      | reusable label, description, required, helper, error, disabled layout                         |
| `Callout`                | `variant="info"`                      | info/success/warning/error, optional icon and title                                           |
| `MetricCard`             | blue icon tone, 102px minimum height  | `label`, `value`, optional `icon`/`description`, icon `tone`, description tone, loading state |
| `SectionCard*`           | 16px radius/padding                   | semantic settings/pricing section composition                                                 |

## Design contract

Figma values are centralized in `src/styles/tokens.css` and registered as Tailwind utilities by `src/styles/theme.css`. Form controls use Inter at 14px, 1.4 line-height, 8px radii, 1px borders, and 32/36/40px heights. `brand` is Pricing blue (`#0049bc`), `tab-active` is indigo (`#272757`), and `toggle-active` is green (`#009951`). Metric cards use a 102px minimum height, 44px icon tile, 12px radius, and semantic blue/green/orange/purple/neutral tones. Dark mode overrides remain semantic rather than component-specific.

Every public component has an autodocs Storybook entry with state, size, edge-case, and interaction examples. Run:

```bash
npm run storybook:typecheck
npm run storybook:test
npm run storybook:build
```

## Accessibility

Labels and messages are linked by generated IDs, invalid fields expose `aria-invalid`, errors use live alert semantics, loading actions expose `aria-busy`, and icon-only actions require an accessible `label`. Select, radio, switch, and tabs use Radix keyboard/focus behavior. Do not replace visible labels with placeholders.

## Known issues

`Switch` is migrating from Radix to Base UI (`@base-ui/react`). The automated
gate is green — `nx lint ui`, `nx typecheck ui`, `storybook:typecheck`,
`nx build ui`, and `storybook:test` (real Chromium via Vitest browser mode)
all pass, including the a11y `test: 'error'` check and an interaction test
that confirms `defaultChecked` applies correctly and toggles as expected.

However, the interactive Storybook dev preview (`npm run storybook` / `nx run
ui:storybook`) currently renders `Switch`'s initial `defaultChecked`/`checked`
state incorrectly — the control visually and functionally shows unchecked
regardless of the prop. This reproduces even after clearing Vite's dep cache
and forcing `@base-ui/react/switch` into `optimizeDeps.include`, and does not
affect the still-Radix `RadioGroup` story in the same dev session, so it is
isolated to Base UI's `SwitchRoot` under this repo's Storybook Vite dev
config specifically — not the component code, not the production build, and
not the `storybook:test` harness (which bundles differently). Root cause not
yet found. If you notice a Base UI-backed control looking wrong only in the
interactive dev server, check `storybook:test` before assuming a regression.

## Figma assumptions

The linked frame shows desktop layout and default/selected states but does not expose queryable component-set pages for every hidden variant. Hover, active, focus-visible, disabled, error, loading, read-only, and dark-mode behavior therefore follows the shared shadcn/Radix accessibility contract while retaining the frame's visible dimensions, typography, spacing, radii, and colors. Responsive behavior is intrinsic: controls fill their container, tabs scroll horizontally, and fields/cards use min-width-safe layouts; no unsupported mobile screen composition was inferred.
