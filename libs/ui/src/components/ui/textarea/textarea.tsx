import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, ReactNode } from 'react';
import { useId } from 'react';
import { cn } from '../../../lib/cn';
import { Field } from '../field';

const textareaVariants = cva(
  'w-full min-w-60 resize-y rounded-md border border-input-strong bg-card px-4 font-form text-control leading-[1.4] text-card-foreground outline-none transition-[border-color,box-shadow] placeholder:text-field-placeholder focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:bg-secondary disabled:opacity-60 read-only:bg-secondary/60 aria-invalid:border-destructive aria-invalid:ring-destructive/20',
  {
    variants: {
      size: {
        sm: 'min-h-16 py-2',
        default: 'min-h-20 py-3',
        lg: 'min-h-28 py-3',
      },
    },
    defaultVariants: { size: 'default' },
  },
);

export interface TextareaProps
  extends ComponentProps<'textarea'>,
    VariantProps<typeof textareaVariants> {
  description?: ReactNode;
  error?: boolean | ReactNode;
  helperText?: ReactNode;
  label?: ReactNode;
}

/** Multiline field matching the Figma 80px default while preserving native resize behavior. */
export function Textarea({
  'aria-describedby': ariaDescribedBy,
  className,
  description,
  disabled,
  error,
  helperText,
  id,
  label,
  required,
  size,
  ...props
}: TextareaProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const descriptionId = `${textareaId}-description`;
  const messageId = `${textareaId}-message`;
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
      htmlFor={textareaId}
      label={label}
      required={required}
    >
      <textarea
        aria-describedby={describedBy}
        aria-invalid={Boolean(error) || undefined}
        className={cn(textareaVariants({ size }), className)}
        disabled={disabled}
        id={textareaId}
        required={required}
        {...props}
      />
    </Field>
  );
}

export { textareaVariants };
