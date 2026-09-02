import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, ReactNode } from 'react';
import { useId } from 'react';
import { cn } from '../../../lib/cn';
import { Field } from '../field';

/**
 * `soft` is the Service Location form appearance: hairline `--border-soft`
 * border with 12px horizontal padding. `default` keeps the original stronger
 * input border so existing screens are untouched.
 */
const controlVariants = {
  size: {
    sm: 'h-8 px-3',
    default: 'h-9 px-4',
    lg: 'h-10 px-4',
  },
  variant: {
    default: 'border-input-strong',
    soft: 'border-border-subtle',
  },
} as const;

const softPadding = [
  { variant: 'soft', size: 'default', class: 'px-3' },
  { variant: 'soft', size: 'lg', class: 'px-3' },
] as const;

const textInputVariants = cva(
  'w-full min-w-0 rounded-md border bg-surface text-control leading-[1.4] text-surface-foreground outline-none transition-[border-color,box-shadow] placeholder:text-input-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:bg-secondary disabled:opacity-60 read-only:bg-secondary/60 aria-invalid:border-destructive aria-invalid:ring-destructive/20',
  {
    variants: controlVariants,
    compoundVariants: [...softPadding],
    defaultVariants: { size: 'default', variant: 'default' },
  },
);

/**
 * Bordered shell used when the field carries an icon, a trailing action, or a
 * segmented add-on, so those elements sit *inside* the control border exactly
 * as they do in Figma.
 */
const inputShellVariants = cva(
  'flex w-full min-w-0 items-center gap-2 rounded-md border bg-surface text-control text-surface-foreground transition-[border-color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/30 data-disabled:cursor-not-allowed data-disabled:bg-secondary data-disabled:opacity-60 data-invalid:border-destructive data-invalid:ring-[3px] data-invalid:ring-destructive/20',
  {
    variants: {
      // Padding only: the height is emitted by compoundVariants so exactly one
      // height utility is ever produced. Note that `h-9` is a standard Tailwind
      // key, so tailwind-merge *does* treat it as a height and a caller passing
      // `h-auto` through `className` will replace it. That is the intended
      // precedence, but it differs from the old custom `h-control` key, which
      // tailwind-merge could not see and so never dropped.
      size: { sm: 'px-3', default: 'px-4', lg: 'px-4' },
      variant: controlVariants.variant,
      /** Lets content wrap onto additional rows and the shell grow to fit. */
      multiline: { false: '', true: 'flex-wrap py-1' },
    },
    compoundVariants: [
      { multiline: false, size: 'sm', class: 'h-8' },
      { multiline: false, size: 'default', class: 'h-9' },
      { multiline: false, size: 'lg', class: 'h-10' },
      { multiline: true, size: 'sm', class: 'min-h-8' },
      { multiline: true, size: 'default', class: 'min-h-9' },
      { multiline: true, size: 'lg', class: 'min-h-10' },
      ...softPadding,
    ],
    defaultVariants: { size: 'default', variant: 'default', multiline: false },
  },
);

export interface TextInputProps
  extends Omit<ComponentProps<'input'>, 'size'>,
    VariantProps<typeof textInputVariants> {
  /**
   * Interactive trailing control, e.g. a clear button. Unlike `endAdornment`
   * this stays focusable and clickable.
   */
  action?: ReactNode;
  /**
   * Segmented leading block flush with the control border and separated by its
   * own divider, e.g. the phone country selector.
   */
  addOn?: ReactNode;
  description?: ReactNode;
  /** Decorative trailing icon. */
  endAdornment?: ReactNode;
  error?: boolean | ReactNode;
  helperText?: ReactNode;
  /** Targets the inner `input` when a shell is rendered. */
  inputClassName?: string;
  label?: ReactNode;
  /** Defaults to `compact` for the `soft` variant, matching the designs. */
  labelSize?: 'default' | 'compact';
  loading?: boolean;
  /** Decorative leading icon rendered inside the control border. */
  startAdornment?: ReactNode;
}

/** Text input supporting labels, adornments, validation, and native controlled/uncontrolled usage. */
export function TextInput({
  action,
  addOn,
  'aria-describedby': ariaDescribedBy,
  className,
  description,
  disabled,
  endAdornment,
  error,
  helperText,
  id,
  inputClassName,
  label,
  labelSize,
  loading = false,
  required,
  size,
  startAdornment,
  variant,
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

  const hasShell =
    addOn != null ||
    startAdornment != null ||
    endAdornment != null ||
    action != null ||
    loading;

  const input = (
    <input
      aria-busy={loading || undefined}
      aria-describedby={describedBy}
      aria-invalid={invalid || undefined}
      className={
        hasShell
          ? cn(
              'h-full min-w-0 flex-1 bg-transparent p-0 leading-[1.4] outline-none placeholder:text-input-foreground disabled:cursor-not-allowed',
              addOn != null && 'px-2',
              inputClassName,
            )
          : cn(textInputVariants({ size, variant }), className)
      }
      disabled={disabled}
      id={inputId}
      required={required}
      {...props}
    />
  );

  const spinner = (
    <span
      aria-hidden="true"
      className="size-4 shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent text-icon-muted"
    />
  );

  return (
    <Field
      description={description}
      descriptionId={descriptionId}
      disabled={disabled}
      error={errorMessage}
      errorId={messageId}
      helperText={helperText}
      htmlFor={inputId}
      label={label}
      required={required}
      size={labelSize ?? (variant === 'soft' ? 'compact' : 'default')}
    >
      {hasShell ? (
        <div
          className={cn(
            inputShellVariants({ size, variant }),
            addOn != null && 'gap-0 overflow-hidden pl-0',
            className,
          )}
          data-disabled={disabled || undefined}
          data-invalid={invalid || undefined}
        >
          {addOn}
          {startAdornment != null && (
            <span
              aria-hidden="true"
              className="flex shrink-0 items-center text-icon-muted"
            >
              {startAdornment}
            </span>
          )}
          {input}
          {loading
            ? spinner
            : endAdornment != null && (
                <span
                  aria-hidden="true"
                  className="flex shrink-0 items-center text-icon-muted"
                >
                  {endAdornment}
                </span>
              )}
          {action}
        </div>
      ) : (
        input
      )}
    </Field>
  );
}

export { inputShellVariants, textInputVariants };
