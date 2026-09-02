import type { ComponentProps, ReactNode } from 'react';
import { ChevronRightIcon } from '../../../icons';
import { cn } from '../../../lib/cn';

export interface BreadcrumbProps extends ComponentProps<'nav'> {
  label?: string;
}

/** Trail of ancestor links ending in the current page. */
export function Breadcrumb({
  label = 'Breadcrumb',
  ...props
}: BreadcrumbProps) {
  return <nav aria-label={label} data-slot="breadcrumb" {...props} />;
}

export function BreadcrumbList({ className, ...props }: ComponentProps<'ol'>) {
  return (
    <ol
      className={cn(
        'flex list-none flex-wrap items-center gap-1.5 p-0 text-control leading-5 text-foreground-subtle',
        className,
      )}
      data-slot="breadcrumb-list"
      {...props}
    />
  );
}

export function BreadcrumbItem({ className, ...props }: ComponentProps<'li'>) {
  return (
    <li
      className={cn('inline-flex items-center gap-1.5', className)}
      data-slot="breadcrumb-item"
      {...props}
    />
  );
}

export function BreadcrumbLink({ className, ...props }: ComponentProps<'a'>) {
  return (
    <a
      className={cn(
        'rounded-sm outline-none transition-colors hover:text-action focus-visible:ring-[3px] focus-visible:ring-ring/30',
        className,
      )}
      data-slot="breadcrumb-link"
      {...props}
    />
  );
}

/** Final, non-interactive segment. */
export function BreadcrumbPage({
  className,
  ...props
}: ComponentProps<'span'>) {
  return (
    <span
      aria-current="page"
      className={cn('font-medium text-heading', className)}
      data-slot="breadcrumb-page"
      {...props}
    />
  );
}

export interface BreadcrumbSeparatorProps extends ComponentProps<'li'> {
  children?: ReactNode;
}

export function BreadcrumbSeparator({
  children,
  className,
  ...props
}: BreadcrumbSeparatorProps) {
  return (
    <li
      aria-hidden="true"
      className={cn('[&_svg]:size-3.5 text-icon-muted', className)}
      data-slot="breadcrumb-separator"
      role="presentation"
      {...props}
    >
      {children ?? <ChevronRightIcon />}
    </li>
  );
}
