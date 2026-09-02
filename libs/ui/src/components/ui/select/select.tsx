import { Select as SelectPrimitive } from '@base-ui/react/select';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, ReactNode } from 'react';
import { useId } from 'react';
import { CheckIcon, ChevronDownIcon } from '../../../icons';
import type { StringClassName } from '../../../lib/class-name';
import { cn } from '../../../lib/cn';
import { Field } from '../field';

const selectTriggerVariants = cva(
  'flex w-full items-center justify-between gap-2 rounded-md border bg-surface px-4 text-control leading-[1.4] text-surface-foreground outline-none transition-[border-color,box-shadow] data-placeholder:text-input-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:bg-secondary disabled:opacity-60 aria-invalid:border-destructive aria-invalid:ring-destructive/20',
  {
    variants: {
      size: {
        sm: 'h-8 px-3',
        default: 'h-9',
        lg: 'h-10',
      },
      variant: {
        default: 'border-input-strong',
        /** Service Location form appearance: hairline border, 12px padding. */
        soft: 'border-border-subtle',
      },
    },
    compoundVariants: [
      { variant: 'soft', size: 'default', class: 'px-3' },
      { variant: 'soft', size: 'lg', class: 'px-3' },
    ],
    defaultVariants: { size: 'default', variant: 'default' },
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
  variant,
  ...props
}: SelectTriggerProps) {
  return (
    <SelectPrimitive.Trigger
      aria-invalid={invalid || undefined}
      className={cn(selectTriggerVariants({ size, variant }), className)}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon>
        {/* The designs pair the soft appearance with a 12px chevron. */}
        <ChevronDownIcon
          className={cn('shrink-0', variant === 'soft' ? 'size-3' : 'size-4')}
        />
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
            'max-h-80 min-w-[var(--anchor-width)] overflow-hidden rounded-md border border-border bg-surface text-surface-foreground shadow-sm',
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
        'relative flex min-h-8 cursor-default select-none items-center rounded-sm py-1.5 pr-8 pl-2 text-control outline-none data-highlighted:bg-primary-subtle data-highlighted:text-primary-subtle-foreground data-disabled:pointer-events-none data-disabled:opacity-50',
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

/**
 * Presentational checkbox mirroring `Checkbox`'s appearance. It is a span, not
 * a real checkbox: the row itself is the control, so nesting a focusable
 * checkbox inside it would create a second tab stop and a click conflict.
 */
function SelectItemCheckbox() {
  return (
    <span
      aria-hidden="true"
      className="flex size-4 shrink-0 items-center justify-center rounded-xs border border-input-strong bg-surface text-action-foreground transition-[background-color,border-color] group-data-selected/select-item:border-action group-data-selected/select-item:bg-action"
    >
      <CheckIcon className="size-3 opacity-0 group-data-selected/select-item:opacity-100" />
    </span>
  );
}

/** Option row for `multiple` selects: shows a checkbox instead of a checkmark. */
export function MultiSelectItem({
  children,
  className,
  ...props
}: SelectItemProps) {
  return (
    <SelectPrimitive.Item
      className={cn(
        'group/select-item relative flex min-h-8 cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-control outline-none data-highlighted:bg-primary-subtle data-highlighted:text-primary-subtle-foreground data-disabled:pointer-events-none data-disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <SelectItemCheckbox />
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
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
  /** Defaults to `compact` for the `soft` variant, matching the designs. */
  labelSize?: 'default' | 'compact';
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
  labelSize,
  size,
  triggerClassName,
  variant,
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
      size={labelSize ?? (variant === 'soft' ? 'compact' : 'default')}
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
          variant={variant}
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

export interface MultiSelectFieldProps
  extends VariantProps<typeof selectTriggerVariants> {
  className?: string;
  defaultValue?: readonly string[];
  description?: ReactNode;
  disabled?: boolean;
  error?: boolean | ReactNode;
  helperText?: ReactNode;
  id?: string;
  label?: ReactNode;
  /** Defaults to `compact` for the `soft` variant, matching the designs. */
  labelSize?: 'default' | 'compact';
  name?: string;
  onValueChange?: (value: string[]) => void;
  options: readonly SelectOption[];
  placeholder?: ReactNode;
  /**
   * Formats the trigger text. Defaults to the single option's label when one is
   * selected and `"N selected"` beyond that, because `SelectOption.label` is a
   * `ReactNode` and cannot be reliably joined into a sentence.
   */
  renderValue?: (selected: SelectOption[]) => ReactNode;
  required?: boolean;
  triggerClassName?: string;
  value?: readonly string[];
}

/**
 * Multi-select field: same trigger geometry as `SelectField`, with a checkbox
 * on every row. The popup stays open across selections so several options can
 * be picked in one pass.
 */
export function MultiSelectField({
  className,
  defaultValue,
  description,
  disabled,
  error,
  helperText,
  id,
  label,
  labelSize,
  name,
  onValueChange,
  options,
  placeholder = 'Select options',
  renderValue,
  required,
  size,
  triggerClassName,
  value,
  variant,
}: MultiSelectFieldProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const descriptionId = `${selectId}-description`;
  const messageId = `${selectId}-message`;
  const errorMessage = error === true ? undefined : error;
  const describedBy =
    [description && descriptionId, (errorMessage || helperText) && messageId]
      .filter(Boolean)
      .join(' ') || undefined;

  const summarise = (selected: readonly string[] | null) => {
    const chosen = options.filter((option) =>
      (selected ?? []).includes(option.value),
    );
    if (chosen.length === 0) {
      return placeholder;
    }
    if (renderValue) {
      return renderValue(chosen);
    }
    return chosen.length === 1 ? chosen[0].label : `${chosen.length} selected`;
  };

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
      size={labelSize ?? (variant === 'soft' ? 'compact' : 'default')}
    >
      <SelectPrimitive.Root
        defaultValue={defaultValue as string[] | undefined}
        disabled={disabled}
        multiple
        name={name}
        onValueChange={
          onValueChange
            ? (next: string[]) => onValueChange(next ?? [])
            : undefined
        }
        required={required}
        value={value as string[] | undefined}
      >
        <SelectTrigger
          aria-describedby={describedBy}
          className={triggerClassName}
          id={selectId}
          invalid={Boolean(error)}
          size={size}
          variant={variant}
        >
          <SelectValue>
            {(selected: readonly string[] | null) => summarise(selected)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <MultiSelectItem
              disabled={option.disabled}
              key={option.value}
              value={option.value}
            >
              {option.label}
            </MultiSelectItem>
          ))}
        </SelectContent>
      </SelectPrimitive.Root>
    </Field>
  );
}
