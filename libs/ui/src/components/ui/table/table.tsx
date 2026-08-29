import type { ComponentProps } from 'react';
import { cn } from '../../../lib/cn';

export interface TableProps extends ComponentProps<'table'> {
  /** Class names for the scroll container that wraps the table element. */
  containerClassName?: string;
}

/**
 * Semantic table element with the horizontal scroll container the design needs
 * on narrow viewports. Use the `DataTable` component for a fully wired grid.
 */
export function Table({ className, containerClassName, ...props }: TableProps) {
  return (
    <div className={cn('w-full overflow-x-auto', containerClassName)}>
      <table
        className={cn(
          'w-full border-collapse text-left font-form text-control',
          className,
        )}
        {...props}
      />
    </div>
  );
}

/** Tinted header band matching the Figma table header surface. */
export function TableHeader({ className, ...props }: ComponentProps<'thead'>) {
  return (
    <thead
      className={cn(
        'bg-table-header [&_tr]:border-b [&_tr]:border-divider',
        className,
      )}
      {...props}
    />
  );
}

export function TableBody({ className, ...props }: ComponentProps<'tbody'>) {
  return (
    <tbody className={cn('[&_tr:last-child]:border-0', className)} {...props} />
  );
}

export function TableFooter({ className, ...props }: ComponentProps<'tfoot'>) {
  return (
    <tfoot
      className={cn('border-t border-divider font-medium', className)}
      {...props}
    />
  );
}

export interface TableRowProps extends ComponentProps<'tr'> {
  /** Renders the hover affordance used when rows are clickable. */
  interactive?: boolean;
}

export function TableRow({ className, interactive, ...props }: TableRowProps) {
  return (
    <tr
      className={cn(
        // Tints are kept light on purpose: the muted cell foreground only clears
        // the 4.5:1 contrast threshold against a near-white row background.
        'border-b border-divider bg-card transition-colors hover:bg-secondary/40 data-[state=selected]:bg-brand-subtle/30',
        interactive &&
          'cursor-pointer outline-none focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-ring/30',
        className,
      )}
      {...props}
    />
  );
}

export function TableHead({ className, ...props }: ComponentProps<'th'>) {
  return (
    <th
      className={cn(
        'relative h-9 whitespace-nowrap px-3 text-left align-middle text-caption font-semibold text-heading first:pl-4 last:pr-4',
        className,
      )}
      scope="col"
      {...props}
    />
  );
}

export function TableCell({ className, ...props }: ComponentProps<'td'>) {
  return (
    <td
      className={cn(
        'px-3 py-2.5 align-middle text-input text-table-foreground first:pl-4 last:pr-4',
        className,
      )}
      {...props}
    />
  );
}

export function TableCaption({
  className,
  ...props
}: ComponentProps<'caption'>) {
  return (
    <caption
      className={cn('mt-4 text-caption text-muted-foreground', className)}
      {...props}
    />
  );
}
