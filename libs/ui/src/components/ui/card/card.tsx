import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '../../../lib/cn';

/**
 * Single source of truth for the library's card surface (radius, border,
 * background). `SectionCard` composes it so both stay visually identical.
 */
const cardSurfaceVariants = cva(
  'rounded-card border border-border-component bg-card text-card-foreground',
);

const cardVariants = cva(
  'group/card flex min-w-0 flex-col gap-(--card-spacing) overflow-hidden py-(--card-spacing) text-control has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 *:[img:first-child]:rounded-t-card *:[img:last-child]:rounded-b-card',
  {
    variants: {
      size: {
        sm: '[--card-spacing:--spacing(3)]',
        default: '[--card-spacing:--spacing(4)]',
      },
    },
    defaultVariants: { size: 'default' },
  },
);

export interface CardProps
  extends ComponentProps<'div'>,
    VariantProps<typeof cardVariants> {}

/**
 * Content card surface. `size` is published as `data-size` so nested parts
 * (`CardTitle`) can scale from the root.
 */
export function Card({ className, size = 'default', ...props }: CardProps) {
  return (
    <div
      className={cn(cardSurfaceVariants(), cardVariants({ size }), className)}
      data-size={size}
      data-slot="card"
      {...props}
    />
  );
}

/** Grid header; switches to two columns when a `CardAction` is present. */
export function CardHeader({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'grid auto-rows-min items-start gap-1 px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-(--card-spacing)',
        className,
      )}
      data-slot="card-header"
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'text-body font-semibold leading-snug text-heading group-data-[size=sm]/card:text-control',
        className,
      )}
      data-slot="card-title"
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div
      className={cn('text-control text-field-foreground', className)}
      data-slot="card-description"
      {...props}
    />
  );
}

/** Top-right slot of `CardHeader`, e.g. an `IconButton` or `DropdownMenu`. */
export function CardAction({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
        className,
      )}
      data-slot="card-action"
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('min-w-0 px-(--card-spacing)', className)}
      data-slot="card-content"
      {...props}
    />
  );
}

export function CardFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-b-card border-t border-divider bg-secondary/40 p-(--card-spacing)',
        className,
      )}
      data-slot="card-footer"
      {...props}
    />
  );
}

export { cardSurfaceVariants, cardVariants };
