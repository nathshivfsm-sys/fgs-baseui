import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../../lib/cn';

const badgeVariants = cva(
  'inline-flex max-w-full shrink-0 items-center gap-1.5 rounded-full font-form font-medium whitespace-nowrap [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      size: {
        sm: 'px-2 py-0.5 text-caption leading-4',
        default: 'px-2.5 py-1 text-control leading-4',
      },
      tone: {
        neutral: '',
        action: '',
        success: '',
        warning: '',
        destructive: '',
        info: '',
      },
      variant: {
        soft: '',
        solid: '',
        outline: 'border bg-transparent',
      },
    },
    compoundVariants: [
      // Soft: tinted surface, saturated text.
      {
        variant: 'soft',
        tone: 'neutral',
        class: 'bg-secondary text-secondary-foreground',
      },
      {
        variant: 'soft',
        tone: 'action',
        class: 'bg-action-subtle text-action',
      },
      // Tinted surfaces pair with the darker text tokens: --metric-green-foreground
      // and --destructive do not reach 4.5:1 against their own tints.
      {
        variant: 'soft',
        tone: 'success',
        class: 'bg-metric-green text-metric-positive',
      },
      {
        variant: 'soft',
        tone: 'warning',
        class: 'bg-warning text-warning-foreground',
      },
      {
        variant: 'soft',
        tone: 'destructive',
        class: 'bg-destructive/10 text-destructive-strong',
      },
      { variant: 'soft', tone: 'info', class: 'bg-brand-subtle text-brand' },
      // Solid: saturated surface, inverted text.
      {
        variant: 'solid',
        tone: 'neutral',
        class: 'bg-secondary-foreground text-card',
      },
      {
        variant: 'solid',
        tone: 'action',
        class: 'bg-action text-action-foreground',
      },
      {
        variant: 'solid',
        tone: 'success',
        class: 'bg-success text-success-foreground',
      },
      {
        variant: 'solid',
        tone: 'warning',
        class: 'bg-warning-foreground text-card',
      },
      {
        variant: 'solid',
        tone: 'destructive',
        class: 'bg-destructive text-destructive-foreground',
      },
      {
        variant: 'solid',
        tone: 'info',
        class: 'bg-brand text-brand-foreground',
      },
      // Outline: hairline border, saturated text.
      {
        variant: 'outline',
        tone: 'neutral',
        class: 'border-divider text-secondary-foreground',
      },
      {
        variant: 'outline',
        tone: 'action',
        class: 'border-action/40 text-action',
      },
      {
        variant: 'outline',
        tone: 'success',
        class: 'border-success/40 text-metric-positive',
      },
      {
        variant: 'outline',
        tone: 'warning',
        class: 'border-warning-border text-warning-foreground',
      },
      {
        variant: 'outline',
        tone: 'destructive',
        class: 'border-destructive/40 text-destructive-strong',
      },
      { variant: 'outline', tone: 'info', class: 'border-brand/40 text-brand' },
    ],
    defaultVariants: { size: 'default', tone: 'neutral', variant: 'soft' },
  },
);

export interface BadgeProps
  extends ComponentProps<'span'>,
    VariantProps<typeof badgeVariants> {
  /**
   * Trailing interactive control, e.g. a remove button. Kept outside the
   * truncating label so it stays on the same line as the text.
   */
  action?: ReactNode;
  /** Leading status dot, as used by the Service Location status pills. */
  dot?: boolean;
  icon?: ReactNode;
}

/**
 * Compact status or category label (VIP, Commercial, Net 30, Tax Exempt).
 *
 * Exact Figma values for these pills could not be measured because the source
 * screens are flattened images, so tones are mapped to library tokens.
 */
export function Badge({
  action,
  children,
  className,
  dot = false,
  icon,
  size,
  tone,
  variant,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ size, tone, variant }), className)}
      data-slot="badge"
      {...props}
    >
      {dot && (
        <span
          aria-hidden="true"
          className="size-1.5 shrink-0 rounded-full bg-current"
        />
      )}
      {icon != null && (
        <span aria-hidden="true" className="inline-flex shrink-0">
          {icon}
        </span>
      )}
      <span className="min-w-0 truncate">{children}</span>
      {action}
    </span>
  );
}

export { badgeVariants };
