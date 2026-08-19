import type { ComponentProps } from 'react';
import { cn } from '../../../lib/cn';
import { cardSurfaceVariants } from '../card';

/**
 * Neutral 16px-radius section surface used by the Figma settings and pricing
 * groups. Shares `Card`'s surface styling; use `Card` for content cards with
 * header/action/footer slots, `SectionCard` for page-level `<section>` groups.
 */
export function SectionCard({
  className,
  ...props
}: ComponentProps<'section'>) {
  return (
    <section
      className={cn(cardSurfaceVariants(), 'p-4', className)}
      {...props}
    />
  );
}

export function SectionHeader({
  className,
  ...props
}: ComponentProps<'header'>) {
  return (
    <header
      className={cn('mb-6 flex min-h-control items-center gap-2', className)}
      {...props}
    />
  );
}

export function SectionTitle({ className, ...props }: ComponentProps<'h2'>) {
  return (
    <h2
      className={cn(
        'm-0 font-form text-body font-semibold leading-[1.4] text-card-foreground',
        className,
      )}
      {...props}
    />
  );
}

export function SectionContent({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('min-w-0', className)} {...props} />;
}
