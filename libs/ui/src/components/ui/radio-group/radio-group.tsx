import { Radio } from '@base-ui/react/radio';
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group';
import type { ComponentProps, ReactNode } from 'react';
import { useId } from 'react';
import type { StringClassName } from '../../../lib/class-name';
import { cn } from '../../../lib/cn';

export interface RadioGroupProps
  extends Omit<
    StringClassName<ComponentProps<typeof RadioGroupPrimitive>>,
    'defaultValue' | 'onValueChange' | 'value'
  > {
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Base UI's RadioGroup has no built-in orientation; this drives layout and aria-orientation. */
  orientation?: 'horizontal' | 'vertical';
  value?: string;
}

export function RadioGroup({
  className,
  onValueChange,
  orientation,
  ...props
}: RadioGroupProps) {
  return (
    <RadioGroupPrimitive
      aria-orientation={orientation}
      className={cn(
        'flex gap-6',
        orientation === 'vertical' && 'flex-col gap-3',
        className,
      )}
      onValueChange={
        onValueChange ? (value: string) => onValueChange(value) : undefined
      }
      {...props}
    />
  );
}

export interface RadioGroupItemProps
  extends Omit<StringClassName<ComponentProps<typeof Radio.Root>>, 'value'> {
  value: string;
}

/** Figma-aligned 16px radio with accessible selected, focus, and disabled states. */
export function RadioGroupItem({ className, ...props }: RadioGroupItemProps) {
  return (
    <Radio.Root
      className={cn(
        'aspect-square size-4 shrink-0 rounded-full border border-input-strong bg-card text-brand outline-none transition-[border-color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30 data-disabled:cursor-not-allowed data-disabled:opacity-50 data-checked:border-brand',
        className,
      )}
      {...props}
    >
      <Radio.Indicator className="flex size-full items-center justify-center">
        <span className="size-2 rounded-full bg-brand" />
      </Radio.Indicator>
    </Radio.Root>
  );
}

export interface RadioOption {
  description?: ReactNode;
  disabled?: boolean;
  label: ReactNode;
  value: string;
}

export interface RadioGroupFieldProps
  extends Omit<RadioGroupProps, 'children'> {
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
  orientation,
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
      className="flex flex-col gap-2"
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
      <RadioGroup
        aria-describedby={describedBy}
        aria-invalid={Boolean(error) || undefined}
        aria-labelledby={label ? labelId : undefined}
        className={className}
        id={groupId}
        orientation={orientation}
        required={required}
        {...props}
      >
        {options.map((option) => {
          const optionLabelId = `${groupId}-option-${option.value}`;
          return (
            <label
              className={cn(
                'flex cursor-pointer items-start gap-3 text-body leading-[1.4] text-card-foreground',
                option.disabled && 'cursor-not-allowed text-muted-foreground',
              )}
              key={option.value}
            >
              <RadioGroupItem
                aria-labelledby={optionLabelId}
                disabled={option.disabled}
                value={option.value}
              />
              <span id={optionLabelId}>
                {option.label}
                {option.description != null && (
                  <span className="block text-control text-field-foreground">
                    {option.description}
                  </span>
                )}
              </span>
            </label>
          );
        })}
      </RadioGroup>
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
