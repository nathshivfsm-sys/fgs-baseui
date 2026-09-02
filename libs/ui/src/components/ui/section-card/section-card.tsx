import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '../../../lib/cn';
import { cardSurfaceVariants } from '../card';

const sectionCardVariants = cva('', {
  variants: {
    tone: {
      default: 'border-border',
      /** Hairline panel border used by the Service Location form. */
      soft: 'border-border-subtle',
    },
    radius: {
      /** 16px, the library default. */
      card: 'rounded-xl',
      /** 12px, the Service Location form panels. */
      panel: 'rounded-lg',
    },
    padding: {
      default: 'p-4',
      /** 20px, the Service Location form panels. */
      comfortable: 'p-5',
      none: 'p-0',
    },
  },
  defaultVariants: { tone: 'default', radius: 'card', padding: 'default' },
});

export interface SectionCardProps
  extends ComponentProps<'section'>,
    VariantProps<typeof sectionCardVariants> {}

/**
 * Neutral section surface used by the Figma settings, pricing, and Service
 * Location form groups. Shares `Card`'s surface styling; use `Card` for content
 * cards with header/action/footer slots, `SectionCard` for page-level
 * `<section>` groups.
 */
export function SectionCard({
  className,
  padding,
  radius,
  tone,
  ...props
}: SectionCardProps) {
  return (
    <section
      className={cn(
        cardSurfaceVariants(),
        sectionCardVariants({ padding, radius, tone }),
        className,
      )}
      {...props}
    />
  );
}

const sectionHeaderVariants = cva('flex min-h-9 items-center gap-2', {
  variants: {
    /** Adds the hairline rule the Figma section headers sit above. */
    bordered: {
      false: 'mb-6',
      true: 'mb-4 border-b border-border-subtle pb-2',
    },
  },
  defaultVariants: { bordered: false },
});

export interface SectionHeaderProps
  extends ComponentProps<'header'>,
    VariantProps<typeof sectionHeaderVariants> {}

export function SectionHeader({
  bordered,
  className,
  ...props
}: SectionHeaderProps) {
  return (
    <header
      className={cn(sectionHeaderVariants({ bordered }), className)}
      {...props}
    />
  );
}

const sectionTitleVariants = cva('m-0 font-semibold text-surface-foreground', {
  variants: {
    size: {
      default: 'text-body leading-[1.4]',
      /** 14px title used inside the compact form panels. */
      sm: 'text-control leading-[1.4]',
    },
  },
  defaultVariants: { size: 'default' },
});

export interface SectionTitleProps
  extends ComponentProps<'h2'>,
    VariantProps<typeof sectionTitleVariants> {}

export function SectionTitle({ className, size, ...props }: SectionTitleProps) {
  return (
    <h2 className={cn(sectionTitleVariants({ size }), className)} {...props} />
  );
}

/**
 * Uppercase micro-heading that separates groups inside a panel (ADDRESS,
 * PRICING & TAX, NOTES, TAGS in the Service Location form).
 */
export function SectionSubheading({
  className,
  ...props
}: ComponentProps<'h3'>) {
  return (
    <h3
      className={cn(
        'm-0 text-caption font-medium uppercase leading-4 tracking-section text-heading',
        className,
      )}
      {...props}
    />
  );
}

export function SectionContent({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('min-w-0', className)} {...props} />;
}

export { sectionCardVariants, sectionHeaderVariants, sectionTitleVariants };
