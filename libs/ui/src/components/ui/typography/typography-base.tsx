import { cva, type VariantProps } from 'class-variance-authority';
import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../../lib/cn';
import { themeVar } from '../../../theme/style.constants';
import type { ThemeColor } from '../../../theme/style.types';

/**
 * Every typographic style in the library resolves from this one config, so a
 * change to a level lands everywhere at once and no component carries a size or
 * weight of its own.
 *
 * Sizes map onto the existing `--text-*` scale in styles/theme.css rather than
 * introducing a parallel heading scale. Levels are allowed to share a size and
 * separate on weight, which is why Heading3/Body and Heading4/BodySmall pair up
 * at 1rem and 0.875rem.
 *
 * Colour is deliberately absent from this config. It resolves at render time
 * straight from the theme — see `resolveColor` below.
 */
const typographyVariants = cva('m-0', {
  variants: {
    /** Size and resting weight for each level of the scale. */
    variant: {
      heading1: 'text-title font-semibold',
      // The scale has no dedicated 1.25rem heading step, so this borrows the
      // metric-value size. Swap in a heading token if the scale gains one.
      heading2: 'text-metric-value font-semibold',
      heading3: 'text-body font-semibold',
      heading4: 'text-control font-semibold',
      body: 'text-body font-normal',
      bodySmall: 'text-control font-normal',
    },
    isUpperCase: { false: '', true: 'uppercase' },
    italic: { false: '', true: 'italic' },
    /**
     * Declared after `variant` so cva emits it second and cn() resolves the
     * font-weight conflict in its favour (see lib/cn.ts).
     */
    bold: { false: '', true: 'font-bold' },
    /** `min-w-0` so the ellipsis still resolves inside a flex row. */
    truncationEnabled: { false: '', true: 'min-w-0 truncate' },
  },
  defaultVariants: {
    bold: false,
    isUpperCase: false,
    italic: false,
    truncationEnabled: false,
  },
});

/** Levels of the scale. Each level component supplies one of these. */
export type TypographyVariant = NonNullable<
  VariantProps<typeof typographyVariants>['variant']
>;

/**
 * Any semantic colour role in the theme. This is the theme's own union, not a
 * list maintained here, so a role added or renamed in the stylesheets flows
 * through without touching this component.
 */
export type TypographyColor = ThemeColor;

/**
 * Resolves a role to a CSS custom property reference. Going through `themeVar`
 * rather than a `text-*` utility is deliberate:
 *
 * - Tailwind only emits utilities it finds as *literal* strings in source, so a
 *   utility-based approach would need a hand-written map of every role — the
 *   parallel list this component used to carry.
 * - A `var(--color-*)` reference reaches every role in the theme for free and
 *   still follows light/dark, because the role is what the `.dark` block
 *   reassigns.
 *
 * Returns `undefined` when no role is given, which leaves the text inheriting
 * its surface colour.
 */
function resolveColor(
  color: ThemeColor | undefined,
): CSSProperties | undefined {
  return color ? { color: themeVar.color(color) } : undefined;
}

/**
 * Shared prop surface for the whole typography set. Every prop is optional, and
 * anything else valid on the rendered element (`id`, `className`, `style`,
 * `aria-*`) passes straight through to it.
 *
 * The inherited `color` attribute is omitted first because this `color` is a
 * design-system role, not the deprecated HTML presentational attribute.
 */
export interface TypographyProps
  extends Omit<HTMLAttributes<HTMLElement>, 'color'> {
  /** Renders at `font-bold`, overriding the level's resting weight. */
  bold?: boolean;
  /** Text or nodes to render. */
  children?: ReactNode;
  /**
   * A semantic colour role from the theme, e.g. `foreground-muted`,
   * `destructive-strong`, `data-1-foreground`. Overrides the level's default.
   * Omit it to inherit the surrounding surface colour.
   */
  color?: TypographyColor;
  /** Renders the text uppercase without changing the underlying content. */
  isUpperCase?: boolean;
  italic?: boolean;
  /** Clamps to a single line with a trailing ellipsis. */
  truncationEnabled?: boolean;
}

export interface TypographyBaseProps extends TypographyProps {
  as: 'h1' | 'h2' | 'h3' | 'h4' | 'p';
  /** Used when the caller passes no `color`. Omit to inherit. */
  defaultColor?: TypographyColor;
  variant: TypographyVariant;
}

/**
 * Shared renderer behind every level. Internal to the typography folder: it is
 * deliberately not re-exported from the package barrel, so the level components
 * stay the only public entry points and the class composition lives here alone.
 */
export function Typography({
  as: Element,
  bold,
  className,
  color,
  defaultColor,
  isUpperCase,
  italic,
  style,
  truncationEnabled,
  variant,
  ...props
}: TypographyBaseProps) {
  const resolved = resolveColor(color ?? defaultColor);
  return (
    <Element
      className={cn(
        typographyVariants({
          bold,
          isUpperCase,
          italic,
          truncationEnabled,
          variant,
        }),
        className,
      )}
      // Caller's `style` is spread last so an explicit override still wins.
      style={resolved || style ? { ...resolved, ...style } : undefined}
      {...props}
    />
  );
}

export { typographyVariants };
