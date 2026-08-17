import { Select as SelectPrimitive } from '@base-ui/react/select';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, ReactNode } from 'react';
import { useId } from 'react';
import { CheckIcon, ChevronDownIcon } from '../../../icons';
import type { StringClassName } from '../../../lib/class-name';
import { cn } from '../../../lib/cn';
import { Field } from '../field';

const selectTriggerVariants = cva(
  'flex w-full items-center justify-between gap-2 rounded-md border border-input-strong bg-card px-4 font-form text-control leading-[1.4] text-card-foreground outline-none transition-[border-color,box-shadow] data-placeholder:text-field-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:bg-secondary disabled:opacity-60 aria-invalid:border-destructive aria-invalid:ring-destructive/20',
  {
    variants: {
      size: {
        sm: 'h-control-sm px-3',
        default: 'h-control',
        lg: 'h-control-lg',
      },
    },
    defaultVariants: { size: 'default' },
  },
);

export const Select = SelectPrimitive.Root;
export const SelectGroup = SelectPrimitive.Group;
export const SelectValue = SelectPrimitive.Value;

export interface SelectTriggerProps
  extends StringClassName<ComponentProps<typeof SelectPrimitive.Trigger>>,
    VariantProps<typeof selectTriggerVariants> {
  invalid?: boolean;
}

/** Trigger used by the composable shadcn/Base UI Select API. */
export function SelectTrigger({
  children,
  className,
  invalid,
  size,
  ...props
}: SelectTriggerProps) {
  return (
    <SelectPrimitive.Trigger
      aria-invalid={invalid || undefined}
      className={cn(selectTriggerVariants({ size }), className)}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon>
        <ChevronDownIcon className="size-4 shrink-0" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

export interface SelectContentProps
  extends StringClassName<ComponentProps<typeof SelectPrimitive.Popup>> {
  alignItemWithTrigger?: boolean;
}

/** Portalled options surface with native Base UI keyboard navigation. */
export function SelectContent({
  alignItemWithTrigger = false,
  children,
  className,
  ...props
}: SelectContentProps) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        alignItemWithTrigger={alignItemWithTrigger}
        align="start"
        className="z-50"
        side="bottom"
        sideOffset={4}
      >
        <SelectPrimitive.Popup
          className={cn(
            'max-h-80 min-w-[var(--anchor-width)] overflow-hidden rounded-md border border-border-component bg-popover text-popover-foreground shadow-surface',
            className,
          )}
          {...props}
        >
          <SelectPrimitive.List className="p-1">
            {children}
          </SelectPrimitive.List>
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  );
}

export type SelectItemProps = StringClassName<
  ComponentProps<typeof SelectPrimitive.Item>
>;

export function SelectItem({ children, className, ...props }: SelectItemProps) {
  return (
    <SelectPrimitive.Item
      className={cn(
        'relative flex min-h-8 cursor-default select-none items-center rounded-sm py-1.5 pr-8 pl-2 text-control outline-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="absolute right-2">
        <CheckIcon className="size-4" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}

export interface SelectOption {
  disabled?: boolean;
  label: ReactNode;
  value: string;
}

export interface SelectFieldProps
  extends VariantProps<typeof selectTriggerVariants> {
  className?: string;
  defaultValue?: string;
  description?: ReactNode;
  disabled?: boolean;
  error?: boolean | ReactNode;
  helperText?: ReactNode;
  id?: string;
  label?: ReactNode;
  name?: string;
  onValueChange?: (value: string | null) => void;
  options: readonly SelectOption[];
  placeholder?: ReactNode;
  required?: boolean;
  triggerClassName?: string;
  value?: string;
}

/** High-level Select field for copyable MFE usage; also exposes composable primitives. */
export function SelectField({
  className,
  description,
  disabled,
  error,
  helperText,
  id,
  label,
  onValueChange,
  options,
  placeholder = 'Select an option',
  required,
  size,
  triggerClassName,
  ...props
}: SelectFieldProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const descriptionId = `${selectId}-description`;
  const messageId = `${selectId}-message`;
  const errorMessage = error === true ? undefined : error;
  const describedBy =
    [description && descriptionId, (errorMessage || helperText) && messageId]
      .filter(Boolean)
      .join(' ') || undefined;
  return (
    <Field
      className={cn('w-full', className)}
      description={description}
      descriptionId={descriptionId}
      disabled={disabled}
      error={errorMessage}
      errorId={messageId}
      helperText={helperText}
      htmlFor={selectId}
      label={label}
      required={required}
    >
      <SelectPrimitive.Root
        disabled={disabled}
        onValueChange={
          onValueChange
            ? (value: string | null) => onValueChange(value)
            : undefined
        }
        required={required}
        {...props}
      >
        <SelectTrigger
          aria-describedby={describedBy}
          id={selectId}
          invalid={Boolean(error)}
          size={size}
          className={triggerClassName}
        >
          <SelectValue placeholder={placeholder}>
            {(value: string | null) =>
              options.find((option) => option.value === value)?.label ??
              placeholder
            }
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              disabled={option.disabled}
              key={option.value}
              value={option.value}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectPrimitive.Root>
    </Field>
  );
}

export { selectTriggerVariants };
