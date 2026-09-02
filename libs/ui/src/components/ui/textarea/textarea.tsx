import { cva, type VariantProps } from 'class-variance-authority';
import type { ChangeEvent, ComponentProps, ReactNode } from 'react';
import { useId, useState } from 'react';
import { cn } from '../../../lib/cn';
import { Field } from '../field';

const textareaVariants = cva(
  'w-full min-w-60 resize-y rounded-md border bg-surface text-control leading-[1.4] text-surface-foreground outline-none transition-[border-color,box-shadow] placeholder:text-placeholder focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:bg-secondary disabled:opacity-60 read-only:bg-secondary/60 aria-invalid:border-destructive aria-invalid:ring-destructive/20',
  {
    variants: {
      size: {
        sm: 'min-h-16 py-2',
        default: 'min-h-20 py-3',
        lg: 'min-h-28 py-3',
      },
      variant: {
        default: 'border-input-strong px-4',
        /** Service Location notes appearance: hairline border, 12px padding. */
        soft: 'border-border-subtle px-3 py-2',
      },
    },
    defaultVariants: { size: 'default', variant: 'default' },
  },
);

export interface TextareaProps
  extends ComponentProps<'textarea'>,
    VariantProps<typeof textareaVariants> {
  description?: ReactNode;
  error?: boolean | ReactNode;
  helperText?: ReactNode;
  label?: ReactNode;
  /** Defaults to `compact` for the `soft` variant, matching the designs. */
  labelSize?: 'default' | 'compact';
  /** Renders a `used/maxLength` counter beneath the control. */
  showCount?: boolean;
}

/** Multiline field matching the Figma 80px default while preserving native resize behavior. */
export function Textarea({
  'aria-describedby': ariaDescribedBy,
  className,
  defaultValue,
  description,
  disabled,
  error,
  helperText,
  id,
  label,
  labelSize,
  maxLength,
  onChange,
  required,
  showCount = false,
  size,
  value,
  variant,
  ...props
}: TextareaProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const descriptionId = `${textareaId}-description`;
  const messageId = `${textareaId}-message`;
  const countId = `${textareaId}-count`;
  const errorMessage = error === true ? undefined : error;

  // The counter must work for both controlled and uncontrolled usage, so track
  // an internal length that the controlled value overrides when present.
  const [uncontrolledLength, setUncontrolledLength] = useState(
    () => String(defaultValue ?? '').length,
  );
  const length =
    value !== undefined ? String(value).length : uncontrolledLength;

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (value === undefined) {
      setUncontrolledLength(event.target.value.length);
    }
    onChange?.(event);
  };

  const describedBy =
    [
      ariaDescribedBy,
      description && descriptionId,
      (errorMessage || helperText) && messageId,
      showCount && countId,
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
      size={labelSize ?? (variant === 'soft' ? 'compact' : 'default')}
    >
      <textarea
        aria-describedby={describedBy}
        aria-invalid={Boolean(error) || undefined}
        className={cn(textareaVariants({ size, variant }), className)}
        defaultValue={defaultValue}
        disabled={disabled}
        id={textareaId}
        maxLength={maxLength}
        onChange={handleChange}
        required={required}
        value={value}
        {...props}
      />
      {showCount && (
        <p
          aria-live="polite"
          // Figma specifies #9CA3AF here, which fails WCAG AA on the card
          // surface; using the slightly darker table-foreground token instead.
          className="text-caption leading-4 text-foreground-subtle text-right"
          id={countId}
        >
          {maxLength == null ? length : `${length}/${maxLength}`}
        </p>
      )}
    </Field>
  );
}

export { textareaVariants };
