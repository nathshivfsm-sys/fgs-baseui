/**
 * Public type vocabulary for the design tokens in `styles/theme.css` and
 * `styles/tokens.css`.
 *
 * Every union here is *derived* from the tuples in `style.constants.ts` rather
 * than written out by hand, so a token added to the theme flows into the types
 * by editing one list. Hand-maintained unions drift; derived ones cannot.
 *
 * The imports are `import type`, so this module contributes nothing to the
 * runtime bundle.
 */

import type {
  ANIMATIONS,
  BREAKPOINTS,
  COLOR_MODES,
  CONTAINERS,
  FONT_FAMILIES,
  PALETTE_COLORS,
  RADII,
  SHADOWS,
  TEXT_SIZES,
  THEME_COLORS,
  TRACKING_TOKENS,
} from './style.constants';

/** `light` or `dark`. The `.dark` overrides live in styles/tokens.css. */
export type ColorMode = (typeof COLOR_MODES)[number];

/**
 * A primitive palette entry: hue family plus ramp step, e.g. `blue-55`,
 * `gray-blue-10`. Mode-invariant — a primitive is the same value in light and
 * dark.
 *
 * Prefer `ThemeColor`. Typing a component prop as `PaletteColor` opts that
 * component out of dark mode.
 */
export type PaletteColor = (typeof PALETTE_COLORS)[number];

/**
 * A semantic colour role: what the colour is *for*, e.g. `heading`, `action`,
 * `foreground-subtle`, `data-1`. Roles resolve to a primitive and are
 * reassigned for dark mode, so this is the type to use for component props.
 */
export type ThemeColor = (typeof THEME_COLORS)[number];

/** A step of the named type scale, e.g. `caption`, `field`, `title`. */
export type TextSize = (typeof TEXT_SIZES)[number];

/** A letter-spacing step, e.g. `section`. */
export type TrackingToken = (typeof TRACKING_TOKENS)[number];

/** A breakpoint this theme declares, e.g. `nav`. */
export type Breakpoint = (typeof BREAKPOINTS)[number];

/** A max-width container, e.g. `content`. */
export type Container = (typeof CONTAINERS)[number];

/** A corner radius, `xs` through `xl`. */
export type Radius = (typeof RADII)[number];

/** An elevation step, `xs` through `lg`. */
export type Shadow = (typeof SHADOWS)[number];

/** A font family role. */
export type FontFamily = (typeof FONT_FAMILIES)[number];

/** A keyframe animation the theme declares. */
export type Animation = (typeof ANIMATIONS)[number];

/**
 * Size and leading for one step of the type scale. Values are `var()`
 * references into the theme, never literals — see `textScale()`.
 */
export interface TextScaleEntry {
  fontSize: string;
  lineHeight: string;
}

/**
 * A `var()` reference produced by the `themeVar` accessors. Assignable to the
 * CSS-value positions in React's `style` prop and to SVG paint attributes.
 */
export type ThemeVarRef = `var(--${string})`;

/**
 * Convenience for props that accept a subset of the roles. Keeps a component
 * honest: the listed names are checked against the real theme, so a role that
 * is renamed or removed in the stylesheets breaks the build here rather than
 * failing silently at runtime.
 *
 * @example
 * type BadgeTone = ThemeColorSubset<'success' | 'warning' | 'destructive'>;
 */
export type ThemeColorSubset<T extends ThemeColor> = Extract<ThemeColor, T>;
