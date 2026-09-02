import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../../lib/cn';

const fieldLabelVariants = cva('', {
  variants: {
    size: {
      default: 'text-control leading-[1.4] text-surface-foreground',
      /** 12px/16 medium heading label used by the Service Location forms. */
      compact: 'text-caption font-medium leading-4 text-heading',
    },
  },
  defaultVariants: { size: 'default' },
});

const fieldMessageVariants = cva('', {
  variants: {
    size: {
      default: 'text-control leading-[1.4]',
      compact: 'text-caption leading-4',
    },
  },
  defaultVariants: { size: 'default' },
});

export interface FieldProps
  extends ComponentProps<'div'>,
    VariantProps<typeof fieldLabelVariants> {
  description?: ReactNode;
  descriptionId?: string;
  disabled?: boolean;
  error?: ReactNode;
  errorId?: string;
  helperText?: ReactNode;
  htmlFor?: string;
  label?: ReactNode;
  required?: boolean;
}

/** Shared label, description, helper, and error layout for form controls. */
export function Field({
  children,
  className,
  description,
  descriptionId,
  disabled,
  error,
  errorId,
  helperText,
  htmlFor,
  label,
  required,
  size,
  ...props
}: FieldProps) {
  return (
    <div
      className={cn('flex min-w-0 flex-col gap-1', className)}
      data-disabled={disabled || undefined}
      data-invalid={Boolean(error) || undefined}
      {...props}
    >
      {label != null && (
        <label className={fieldLabelVariants({ size })} htmlFor={htmlFor}>
          {label}
          {required && (
            <span aria-hidden="true" className="ml-1 text-destructive">
              *
            </span>
          )}
        </label>
      )}
      {description != null && (
        <p
          className={cn(
            fieldMessageVariants({ size }),
            'text-input-foreground',
          )}
          id={descriptionId}
        >
          {description}
        </p>
      )}
      {children}
      {error != null ? (
        <p
          className={cn(fieldMessageVariants({ size }), 'text-destructive')}
          id={errorId}
          role="alert"
        >
          {error}
        </p>
      ) : (
        helperText != null && (
          <p
            className={cn(
              fieldMessageVariants({ size }),
              'text-input-foreground',
            )}
            id={errorId}
          >
            {helperText}
          </p>
        )
      )}
    </div>
  );
}

export { fieldLabelVariants, fieldMessageVariants };
