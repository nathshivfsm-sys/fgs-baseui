import { Combobox as ComboboxPrimitive } from '@base-ui/react/combobox';
import type { ComponentProps, ReactNode } from 'react';
import { useId } from 'react';
import { ChevronDownIcon } from '../../../icons';
import type { StringClassName } from '../../../lib/class-name';
import { cn } from '../../../lib/cn';
import { Field } from '../field';
import { selectTriggerVariants, type SelectTriggerProps } from '../select';

export const Combobox = ComboboxPrimitive.Root;

export type ComboboxInputGroupProps = StringClassName<
  ComponentProps<typeof ComboboxPrimitive.InputGroup>
>;

export function ComboboxInputGroup({
  className,
  ...props
}: ComboboxInputGroupProps) {
  return (
    <ComboboxPrimitive.InputGroup
      className={cn('relative flex w-full items-center', className)}
      {...props}
    />
  );
}

export interface ComboboxInputProps
  extends Omit<
      StringClassName<ComponentProps<typeof ComboboxPrimitive.Input>>,
      'size'
    >,
    Pick<SelectTriggerProps, 'invalid' | 'size' | 'variant'> {}

/** Input used by the composable Combobox API; reuses Select's trigger geometry and tokens. */
export function ComboboxInput({
  className,
  invalid,
  size,
  variant,
  ...props
}: ComboboxInputProps) {
  return (
    <ComboboxPrimitive.Input
      aria-invalid={invalid || undefined}
      className={cn(
        selectTriggerVariants({ size, variant }),
        'pr-8',
        className,
      )}
      {...props}
    />
  );
}

export type ComboboxTriggerProps = StringClassName<
  ComponentProps<typeof ComboboxPrimitive.Trigger>
>;

export function ComboboxTrigger({
  'aria-label': ariaLabel = 'Show options',
  children,
  className,
  ...props
}: ComboboxTriggerProps) {
  return (
    <ComboboxPrimitive.Trigger
      aria-label={ariaLabel}
      className={cn(
        'absolute right-3 flex items-center text-input-foreground disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
      {...props}
    >
      {children ?? <ChevronDownIcon className="size-4 shrink-0" />}
    </ComboboxPrimitive.Trigger>
  );
}

export type ComboboxContentProps = StringClassName<
  ComponentProps<typeof ComboboxPrimitive.Popup>
> & {
  sideOffset?: ComponentProps<
    typeof ComboboxPrimitive.Positioner
  >['sideOffset'];
};

/** Portalled options surface; siblings Empty and List inside, matching Base UI's anatomy. */
export function ComboboxContent({
  children,
  className,
  sideOffset = 4,
  ...props
}: ComboboxContentProps) {
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner
        align="start"
        className="z-50"
        side="bottom"
        sideOffset={sideOffset}
      >
        <ComboboxPrimitive.Popup
          className={cn(
            'max-h-80 min-w-[var(--anchor-width)] overflow-hidden rounded-md border border-border bg-surface text-surface-foreground shadow-sm',
            className,
          )}
          {...props}
        >
          {children}
        </ComboboxPrimitive.Popup>
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  );
}

export type ComboboxEmptyProps = StringClassName<
  ComponentProps<typeof ComboboxPrimitive.Empty>
>;

export function ComboboxEmpty({ className, ...props }: ComboboxEmptyProps) {
  return (
    <ComboboxPrimitive.Empty
      className={cn(
        'px-2 py-1.5 text-control text-input-foreground',
        className,
      )}
      {...props}
    />
  );
}

export type ComboboxListProps = StringClassName<
  ComponentProps<typeof ComboboxPrimitive.List>
>;

export function ComboboxList({ className, ...props }: ComboboxListProps) {
  return <ComboboxPrimitive.List className={cn('p-1', className)} {...props} />;
}

export type ComboboxItemProps = StringClassName<
  ComponentProps<typeof ComboboxPrimitive.Item>
>;

export function ComboboxItem({
  children,
  className,
  ...props
}: ComboboxItemProps) {
  return (
    <ComboboxPrimitive.Item
      className={cn(
        'relative flex min-h-8 cursor-default select-none items-center rounded-sm py-1.5 px-2 text-control outline-none data-highlighted:bg-primary-subtle data-highlighted:text-primary-subtle-foreground data-disabled:pointer-events-none data-disabled:opacity-50',
        className,
      )}
      {...props}
    >
      {children}
    </ComboboxPrimitive.Item>
  );
}

export interface ComboboxOption {
  disabled?: boolean;
  /** Must be a string: Base UI's built-in filtering and input display both need one. */
  label: string;
  value: string;
}

export interface ComboboxFieldProps extends Pick<SelectTriggerProps, 'size'> {
  className?: string;
  defaultValue?: string;
  description?: ReactNode;
  disabled?: boolean;
  emptyMessage?: ReactNode;
  error?: boolean | ReactNode;
  helperText?: ReactNode;
  id?: string;
  inputClassName?: string;
  label?: ReactNode;
  name?: string;
  onValueChange?: (value: string | null) => void;
  options: readonly ComboboxOption[];
  placeholder?: string;
  required?: boolean;
  value?: string;
}

/** High-level Combobox field for copyable MFE usage; also exposes composable primitives. */
export function ComboboxField({
  className,
  defaultValue,
  description,
  disabled,
  emptyMessage = 'No results found.',
  error,
  helperText,
  id,
  inputClassName,
  label,
  name,
  onValueChange,
  options,
  placeholder = 'Search…',
  required,
  size,
  value,
}: ComboboxFieldProps) {
  const generatedId = useId();
  const comboboxId = id ?? generatedId;
  const descriptionId = `${comboboxId}-description`;
  const messageId = `${comboboxId}-message`;
  const errorMessage = error === true ? undefined : error;
  const describedBy =
    [description && descriptionId, (errorMessage || helperText) && messageId]
      .filter(Boolean)
      .join(' ') || undefined;

  // Base UI works with the full { label, value } item as its own value type
  // (auto-detected for display text and form submission); the public field
  // API stays a plain string, adapted at this boundary in both directions.
  const selectedOption =
    value !== undefined
      ? (options.find((o) => o.value === value) ?? null)
      : undefined;
  const defaultSelectedOption =
    defaultValue !== undefined
      ? (options.find((o) => o.value === defaultValue) ?? null)
      : undefined;

  return (
    <Field
      className={cn('w-full', className)}
      description={description}
      descriptionId={descriptionId}
      disabled={disabled}
      error={errorMessage}
      errorId={messageId}
      helperText={helperText}
      htmlFor={comboboxId}
      label={label}
      required={required}
    >
      <Combobox
        defaultValue={defaultSelectedOption}
        disabled={disabled}
        items={options}
        name={name}
        onValueChange={
          onValueChange
            ? (option: ComboboxOption | null) =>
                onValueChange(option?.value ?? null)
            : undefined
        }
        required={required}
        value={selectedOption}
      >
        <ComboboxInputGroup>
          <ComboboxInput
            aria-describedby={describedBy}
            className={inputClassName}
            id={comboboxId}
            invalid={Boolean(error)}
            placeholder={placeholder}
            size={size}
          />
          <ComboboxTrigger />
        </ComboboxInputGroup>
        <ComboboxContent>
          <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
          <ComboboxList>
            {(option: ComboboxOption) => (
              <ComboboxItem
                disabled={option.disabled}
                key={option.value}
                value={option}
              >
                {option.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Field>
  );
}
