import type { ComponentProps } from 'react';
import { cn } from '../../../lib/cn';

export type SkeletonProps = ComponentProps<'div'>;

/**
 * Loading placeholder. Size it with `className`; give it an accessible name
 * only when it is the sole indicator that content is loading.
 */
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'animate-pulse rounded-md bg-secondary motion-reduce:animate-none',
        className,
      )}
      data-slot="skeleton"
      {...props}
    />
  );
}
