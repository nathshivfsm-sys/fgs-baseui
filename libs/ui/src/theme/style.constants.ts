/**
 * Runtime mirror of the design tokens in `styles/theme.css` and
 * `styles/tokens.css`.
 *
 * Three rules keep this file honest:
 *
 * 1. It holds token *names* and `var()` references, never literal values. No
 *    `0.75rem` or `#111827` appears here, so the stylesheets stay the single
 *    source of truth.
 * 2. Names are kebab-case, matching the CSS custom property and the Tailwind
 *    utility exactly (`foreground-subtle` -> `--color-foreground-subtle` ->
 *    `text-foreground-subtle`). No camelCase translation layer to keep in step.
 * 3. No token is named after a component.
 *
 * ── The two colour layers ─────────────────────────────────────────────────
 * PALETTE_COLORS are primitives: a generic hue-and-step ramp, identical in
 * light and dark. THEME_COLORS are semantic roles that reference a primitive
 * and are reassigned in the `.dark` block.
 *
 * Build UI against the roles. A component that reaches for a primitive opts
 * out of dark mode, because primitives do not change between modes.
 *
 * ── Spacing ──────────────────────────────────────────────────────────────
 * There is deliberately no spacing token list. Tailwind derives every step
 * from `--spacing` (4px), so `h-9` is 36px and `w-56` is 224px without any
 * named token. Use `spacingStep(n)` when you need the value in JS.
 *
 * ── Regenerating after a theme change ────────────────────────────────────
 *   grep -oE '^\s*--color-[a-z0-9-]+:' libs/ui/src/styles/theme.css \
 *     | sed 's/.*--color-//;s/://'
 *
 * ── Important: do not build Tailwind class names from these ──────────────
 * Tailwind generates utilities by scanning source for *literal* class strings.
 * `` `text-${role}` `` produces no CSS. For dynamic styling use the `themeVar`
 * accessors, which resolve to CSS custom properties and work regardless of
 * scanning. Use literal utilities (`text-heading`) in static markup.
 */

/** Colour schemes the app ships. `.dark` is defined in styles/tokens.css. */
export const COLOR_MODES = ['light', 'dark'] as const;

/**
 * Primitive palette: generic hue families, each ramping 5 (lightest) to 100
 * (darkest). Mode-invariant. A trailing `a` marks a translucent step.
 *
 * Prefer a semantic role from THEME_COLORS; reach for a primitive only when
 * defining a role or when a value genuinely must not change with the mode.
 */
export const PALETTE_COLORS = [
  'white-5',
  'neutral-20a',
  'neutral-30',
  'neutral-45',
  'neutral-60',
  'neutral-75',
  'neutral-85',
  'neutral-100',
  'gray-blue-5',
  'gray-blue-10',
  'gray-blue-20',
  'gray-blue-25',
  'gray-blue-30',
  'gray-blue-40',
  'gray-blue-45',
  'gray-blue-55',
  'gray-blue-60',
  'gray-blue-65',
  'gray-blue-75',
  'gray-blue-80',
  'gray-blue-85',
  'gray-blue-95',
  'gray-blue-100',
  'blue-5',
  'blue-10',
  'blue-20',
  'blue-25',
  'blue-30',
  'blue-40',
  'blue-45',
  'blue-55',
  'blue-60',
  'blue-65',
  'blue-75',
  'blue-80',
  'blue-85',
  'blue-95',
  'blue-100',
  'dark-blue-5',
  'dark-blue-15',
  'dark-blue-30',
  'dark-blue-40',
  'dark-blue-55',
  'dark-blue-65',
  'dark-blue-75',
  'dark-blue-90',
  'dark-blue-100',
  'indigo-5',
  'indigo-25',
  'indigo-45',
  'indigo-60',
  'indigo-80',
  'indigo-100',
  'dark-indigo-5',
  'dark-indigo-55',
  'dark-indigo-100',
  'green-5',
  'green-15',
  'green-30',
  'green-40',
  'green-55',
  'green-65',
  'green-75',
  'green-90',
  'green-100',
  'yellow-5',
  'yellow-100',
  'orange-5',
  'orange-25',
  'orange-45',
  'orange-60',
  'orange-80',
  'orange-100',
  'red-5',
  'red-30',
  'red-55',
  'red-75',
  'red-100',
] as const;

/**
 * Semantic colour roles — what a colour is *for*, not what it looks like.
 * These are the tokens components should use. Each resolves to a primitive and
 * is reassigned for dark mode.
 */
export const THEME_COLORS = [
  'background',
  'surface',
  'surface-foreground',
  'surface-subtle',
  'surface-sunken',
  'surface-raised',
  'surface-raised-foreground',
  'surface-inverse',
  'surface-inverse-foreground',
  'surface-inverse-hover',
  'accent-surface',
  'accent-surface-foreground',
  'heading',
  'foreground-strong',
  'foreground',
  'foreground-muted',
  'foreground-subtle',
  'label',
  'placeholder',
  'icon-muted',
  'primary',
  'primary-hover',
  'primary-strong',
  'primary-foreground',
  'primary-subtle',
  'primary-subtle-foreground',
  'action',
  'action-hover',
  'action-foreground',
  'action-subtle',
  'link',
  'ring',
  'secondary',
  'secondary-foreground',
  'success',
  'success-strong',
  'success-foreground',
  'warning',
  'warning-border',
  'warning-foreground',
  'destructive',
  'destructive-foreground',
  'destructive-strong',
  'border',
  'border-subtle',
  'divider',
  'input',
  'input-strong',
  'input-foreground',
  'data-1',
  'data-1-foreground',
  'data-2',
  'data-2-foreground',
  'data-3',
  'data-3-foreground',
  'data-4',
  'data-4-foreground',
  'data-5',
  'data-5-foreground',
] as const;

/**
 * Named type scale. Each entry has a paired `--text-<name>--line-height`, so
 * the Tailwind utility sets size and leading together.
 *
 * The 13px step is `field`, not `input`: `--color-input` exists, so
 * `text-input` resolved to the colour rather than the size. See lib/cn.ts.
 */
export const TEXT_SIZES = [
  'caption',
  'field',
  'control',
  'body',
  'metric-value',
  'title',
  'tenant',
  'badge',
] as const;

/** Letter-spacing steps. */
export const TRACKING_TOKENS = ['brand', 'section'] as const;

/**
 * Breakpoints this theme adds. Tailwind's own `sm`/`md`/`lg`/`xl`/`2xl`
 * remain available and are intentionally not repeated here.
 */
export const BREAKPOINTS = ['xs', 'nav', '3xl', '4xl'] as const;

/** Max-width containers for page shells. */
export const CONTAINERS = ['form', 'content', 'app'] as const;

/** Corner radii, ramping xs to xl. Deduplicated: the previous scale repeated
 * two values under different names. */
export const RADII = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

/** Elevation steps, ramping xs to lg. */
export const SHADOWS = ['xs', 'sm', 'lg'] as const;

/**
 * Font families. There is one application family; see styles/font.css, which is
 * the only place a typeface is named.
 */
export const FONT_FAMILIES = ['sans', 'mono'] as const;

/** Keyframe animations the theme declares. */
export const ANIMATIONS = ['caret-blink'] as const;

/* Local derivations so the accessors below are typed without importing from
   style.types.ts, which would create a cycle. The public type names live
   there and derive from these same tuples. */
type PaletteName = (typeof PALETTE_COLORS)[number];
type ColorName = (typeof THEME_COLORS)[number];
type TextSizeName = (typeof TEXT_SIZES)[number];
type TrackingName = (typeof TRACKING_TOKENS)[number];
type BreakpointName = (typeof BREAKPOINTS)[number];
type ContainerName = (typeof CONTAINERS)[number];
type RadiusName = (typeof RADII)[number];
type ShadowName = (typeof SHADOWS)[number];
type FontFamilyName = (typeof FONT_FAMILIES)[number];
type AnimationName = (typeof ANIMATIONS)[number];

/**
 * Typed `var()` references into the theme, for the cases Tailwind utilities
 * cannot reach: inline `style`, chart and canvas configs, and any value chosen
 * at runtime. Because these resolve through CSS custom properties they respond
 * to light/dark automatically, and they never inline a literal value.
 *
 * Colours point at the *role* variable (`--heading`), not the Tailwind theme
 * variable (`--color-heading`). That is deliberate and load-bearing: `theme.css`
 * declares the colour block as `@theme inline`, so Tailwind resolves utilities
 * straight to `var(--heading)` and never references `--color-*`, which means
 * Tailwind tree-shakes that whole layer out of the build. Pointing at
 * `--color-*` here would resolve to nothing and silently fall back to the
 * inherited colour.
 *
 * @example
 * <div style={{ borderColor: themeVar.color('divider') }} />
 * <svg><rect fill={themeVar.color('data-1')} /></svg>
 */
export const themeVar = {
  animation: (name: AnimationName) => `var(--animate-${name})` as const,
  breakpoint: (name: BreakpointName) => `var(--breakpoint-${name})` as const,
  /** A semantic role. Responds to light/dark. Prefer this. */
  color: (name: ColorName) => `var(--${name})` as const,
  container: (name: ContainerName) => `var(--container-${name})` as const,
  fontFamily: (name: FontFamilyName) => `var(--font-${name})` as const,
  /** A raw primitive. Does *not* respond to light/dark. */
  palette: (name: PaletteName) => `var(--${name})` as const,
  radius: (name: RadiusName) => `var(--radius-${name})` as const,
  shadow: (name: ShadowName) => `var(--shadow-${name})` as const,
  /** Font size only. Pair with `textLineHeight` to match the utility. */
  textSize: (name: TextSizeName) => `var(--text-${name})` as const,
  textLineHeight: (name: TextSizeName) =>
    `var(--text-${name}--line-height)` as const,
  tracking: (name: TrackingName) => `var(--tracking-${name})` as const,
} as const;

/**
 * One step of the spacing scale as a CSS value. `spacingStep(9)` is 36px,
 * matching `h-9`. There are no named spacing tokens by design.
 */
export function spacingStep(steps: number) {
  return `calc(var(--spacing) * ${steps})` as const;
}

/**
 * Size and leading for one step of the type scale, as `var()` references.
 * Useful where a utility class cannot be applied.
 */
export function textScale(name: TextSizeName) {
  return {
    fontSize: themeVar.textSize(name),
    lineHeight: themeVar.textLineHeight(name),
  };
}
