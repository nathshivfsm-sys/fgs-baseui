import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import type { ComponentProps, ReactNode } from 'react';
import { useId } from 'react';
import { cn } from '../../../lib/cn';

export function RadioGroup({
  className,
  ...props
}: ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      className={cn(
        'flex gap-6',
        props.orientation === 'vertical' && 'flex-col gap-3',
        className,
      )}
      {...props}
    />
  );
}

/** Figma-aligned 16px radio with accessible selected, focus, and disabled states. */
export function RadioGroupItem({
  className,
  ...props
}: ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      className={cn(
        'aspect-square size-4 shrink-0 rounded-full border border-input-strong bg-card text-brand outline-none transition-[border-color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-brand',
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex size-full items-center justify-center">
        <span className="size-2 rounded-full bg-brand" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export interface RadioOption {
  description?: ReactNode;
  disabled?: boolean;
  label: ReactNode;
  value: string;
}

export interface RadioGroupFieldProps
  extends Omit<ComponentProps<typeof RadioGroupPrimitive.Root>, 'children'> {
  description?: ReactNode;
  error?: ReactNode;
  helperText?: ReactNode;
  label?: ReactNode;
  options: readonly RadioOption[];
}

/** Complete radio field; state is represented by the group value as specified in Figma. */
export function RadioGroupField({
  className,
  description,
  error,
  helperText,
  id,
  label,
  options,
  required,
  ...props
}: RadioGroupFieldProps) {
  const generatedId = useId();
  const groupId = id ?? generatedId;
  const labelId = `${groupId}-label`;
  const messageId = `${groupId}-message`;
  const describedBy = error || helperText ? messageId : undefined;
  return (
    <div
      className="flex flex-col gap-2 font-form"
      data-invalid={Boolean(error) || undefined}
    >
      {label != null && (
        <div className="text-control text-card-foreground" id={labelId}>
          {label}
          {required && (
            <span aria-hidden="true" className="ml-1 text-destructive">
              *
            </span>
          )}
        </div>
      )}
      {description != null && (
        <p className="text-control text-field-foreground">{description}</p>
      )}
      <RadioGroupPrimitive.Root
        aria-describedby={describedBy}
        aria-invalid={Boolean(error) || undefined}
        aria-labelledby={label ? labelId : undefined}
        className={cn(
          'flex gap-6',
          props.orientation === 'vertical' && 'flex-col gap-3',
          className,
        )}
        id={groupId}
        required={required}
        {...props}
      >
        {options.map((option) => (
          <label
            className={cn(
              'flex cursor-pointer items-start gap-3 text-body leading-[1.4] text-card-foreground',
              option.disabled && 'cursor-not-allowed text-muted-foreground',
            )}
            key={option.value}
          >
            <RadioGroupItem disabled={option.disabled} value={option.value} />
            <span>
              {option.label}
              {option.description != null && (
                <span className="block text-control text-field-foreground">
                  {option.description}
                </span>
              )}
            </span>
          </label>
        ))}
      </RadioGroupPrimitive.Root>
      {error != null ? (
        <p
          className="text-control text-destructive"
          id={messageId}
          role="alert"
        >
          {error}
        </p>
      ) : (
        helperText != null && (
          <p className="text-control text-field-foreground" id={messageId}>
            {helperText}
          </p>
        )
      )}
    </div>
  );
}
