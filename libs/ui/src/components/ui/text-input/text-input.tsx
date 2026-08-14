import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, ReactNode } from 'react';
import { useId } from 'react';
import { cn } from '../../../lib/cn';
import { Field } from '../field';

const textInputVariants = cva(
  'w-full min-w-0 rounded-md border border-input-strong bg-card font-form text-control leading-[1.4] text-card-foreground outline-none transition-[border-color,box-shadow] placeholder:text-field-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:bg-secondary disabled:opacity-60 read-only:bg-secondary/60 aria-invalid:border-destructive aria-invalid:ring-destructive/20',
  {
    variants: {
      size: {
        sm: 'h-control-sm px-3',
        default: 'h-control px-4',
        lg: 'h-control-lg px-4',
      },
    },
    defaultVariants: { size: 'default' },
  },
);

export interface TextInputProps
  extends Omit<ComponentProps<'input'>, 'size'>,
    VariantProps<typeof textInputVariants> {
  description?: ReactNode;
  endAdornment?: ReactNode;
  error?: boolean | ReactNode;
  helperText?: ReactNode;
  label?: ReactNode;
  loading?: boolean;
  startAdornment?: ReactNode;
}

/** Text input supporting labels, adornments, validation, and native controlled/uncontrolled usage. */
export function TextInput({
  'aria-describedby': ariaDescribedBy,
  className,
  description,
  disabled,
  endAdornment,
  error,
  helperText,
  id,
  label,
  loading = false,
  required,
  size,
  startAdornment,
  ...props
}: TextInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const descriptionId = `${inputId}-description`;
  const messageId = `${inputId}-message`;
  const invalid = Boolean(error);
  const errorMessage = error === true ? undefined : error;
  const describedBy =
    [
      ariaDescribedBy,
      description && descriptionId,
      (errorMessage || helperText) && messageId,
    ]
      .filter(Boolean)
      .join(' ') || undefined;

  return (
    <Field
      className="w-full"
      description={description}
      descriptionId={descriptionId}
      disabled={disabled}
      error={errorMessage}
      errorId={messageId}
      helperText={helperText}
      htmlFor={inputId}
      label={label}
      required={required}
    >
      <div className="relative">
        {startAdornment != null && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-icon-muted"
          >
            {startAdornment}
          </span>
        )}
        <input
          aria-busy={loading || undefined}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          className={cn(
            textInputVariants({ size }),
            startAdornment && 'pl-10',
            (endAdornment || loading) && 'pr-10',
            className,
          )}
          disabled={disabled}
          id={inputId}
          required={required}
          {...props}
        />
        {(endAdornment != null || loading) && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-icon-muted"
          >
            {loading ? (
              <span className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
            ) : (
              endAdornment
            )}
          </span>
        )}
      </div>
    </Field>
  );
}

export { textInputVariants };
