import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../../lib/cn';
import { BodySmall } from '../typography';

const calloutVariants = cva(
  'flex w-full items-start gap-3 rounded-md px-4 py-2.5 text-control leading-[1.4]',
  {
    variants: {
      variant: {
        info: 'bg-action-subtle text-primary',
        success: 'bg-success/15 text-success-foreground',
        warning:
          'border border-warning-border bg-warning text-warning-foreground',
        error: 'border border-destructive/30 bg-surface text-destructive',
      },
    },
    defaultVariants: { variant: 'info' },
  },
);

export interface CalloutProps
  extends Omit<ComponentProps<'div'>, 'title'>,
    VariantProps<typeof calloutVariants> {
  icon?: ReactNode;
  title?: ReactNode;
}

/** Inline contextual message; use error only for non-field-level failures. */
export function Callout({
  children,
  className,
  icon,
  title,
  variant,
  ...props
}: CalloutProps) {
  return (
    <div
      className={cn(calloutVariants({ variant }), className)}
      role={variant === 'error' ? 'alert' : 'status'}
      {...props}
    >
      {icon != null && (
        <span aria-hidden="true" className="mt-0.5 shrink-0">
          {icon}
        </span>
      )}
      <div className="min-w-0">
        {title != null && (
          <BodySmall className="font-semibold">{title}</BodySmall>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
}

export { calloutVariants };
