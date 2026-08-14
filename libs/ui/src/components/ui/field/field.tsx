import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../../lib/cn';

export interface FieldProps extends ComponentProps<'div'> {
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
  ...props
}: FieldProps) {
  return (
    <div
      className={cn('flex min-w-0 flex-col gap-1 font-form', className)}
      data-disabled={disabled || undefined}
      data-invalid={Boolean(error) || undefined}
      {...props}
    >
      {label != null && (
        <label
          className="text-control leading-[1.4] text-card-foreground"
          htmlFor={htmlFor}
        >
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
          className="text-control leading-[1.4] text-field-foreground"
          id={descriptionId}
        >
          {description}
        </p>
      )}
      {children}
      {error != null ? (
        <p
          className="text-control leading-[1.4] text-destructive"
          id={errorId}
          role="alert"
        >
          {error}
        </p>
      ) : (
        helperText != null && (
          <p
            className="text-control leading-[1.4] text-field-foreground"
            id={errorId}
          >
            {helperText}
          </p>
        )
      )}
    </div>
  );
}
