import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../../lib/cn';

const descriptionListVariants = cva('m-0 grid min-w-0', {
  variants: {
    columns: {
      1: 'grid-cols-1',
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-2 lg:grid-cols-4',
    },
    gap: { default: 'gap-4', tight: 'gap-3' },
  },
  defaultVariants: { columns: 2, gap: 'default' },
});

export interface DescriptionListProps
  extends ComponentProps<'dl'>,
    VariantProps<typeof descriptionListVariants> {}

/** Read-only label/value pairs used across the Service Location detail views. */
export function DescriptionList({
  className,
  columns,
  gap,
  ...props
}: DescriptionListProps) {
  return (
    <dl
      className={cn(descriptionListVariants({ columns, gap }), className)}
      data-slot="description-list"
      {...props}
    />
  );
}

export function DescriptionTerm({ className, ...props }: ComponentProps<'dt'>) {
  return (
    <dt
      className={cn(
        'text-caption font-medium leading-4 text-foreground-subtle',
        className,
      )}
      data-slot="description-term"
      {...props}
    />
  );
}

export function DescriptionDetails({
  className,
  ...props
}: ComponentProps<'dd'>) {
  return (
    <dd
      className={cn(
        'm-0 text-control leading-5 text-heading tabular-figures',
        className,
      )}
      data-slot="description-details"
      {...props}
    />
  );
}

export interface DescriptionItemProps extends ComponentProps<'div'> {
  /** Rendered when `children` is empty, e.g. an em dash. */
  fallback?: ReactNode;
  term: ReactNode;
}

/** Convenience wrapper pairing one term with its details. */
export function DescriptionItem({
  children,
  className,
  fallback = '—',
  term,
  ...props
}: DescriptionItemProps) {
  const empty = children == null || children === '';
  return (
    <div className={cn('flex min-w-0 flex-col gap-0.5', className)} {...props}>
      <DescriptionTerm>{term}</DescriptionTerm>
      <DescriptionDetails
        className={empty ? 'text-foreground-subtle' : undefined}
      >
        {empty ? fallback : children}
      </DescriptionDetails>
    </div>
  );
}

export { descriptionListVariants };
