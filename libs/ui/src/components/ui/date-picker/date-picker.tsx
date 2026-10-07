import type { Matcher } from 'react-day-picker';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ReactNode } from 'react';
import { useId, useMemo, useState } from 'react';
import { ScheduleIcon } from '../../../icons';
import { cn } from '../../../lib/cn';
import { Calendar } from '../calendar';
import { Field } from '../field';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import { selectTriggerVariants } from '../select';
import {
  formatIsoDate,
  formatIsoDateDisplay,
  isFutureLocalDay,
  parseIsoDate,
} from './iso-date';

const datePickerTriggerVariants = cva(
  'inline-flex w-full min-w-0 items-center justify-start gap-2 font-normal',
  {
    variants: {
      placeholder: {
        true: 'text-input-foreground',
        false: 'text-surface-foreground',
      },
    },
    defaultVariants: { placeholder: false },
  },
);

export interface DatePickerFieldProps
  extends VariantProps<typeof selectTriggerVariants> {
  className?: string;
  description?: ReactNode;
  /** When true, days after today cannot be selected. */
  disableFutureDates?: boolean;
  disabled?: boolean;
  error?: boolean | ReactNode;
  helperText?: ReactNode;
  id?: string;
  label?: ReactNode;
  labelSize?: 'default' | 'compact';
  name?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  triggerClassName?: string;
  value?: string;
}

export const DatePickerField = ({
  className,
  description,
  disableFutureDates = false,
  disabled,
  error,
  helperText,
  id,
  label,
  labelSize,
  name,
  onValueChange,
  placeholder = 'Select date',
  required,
  size,
  triggerClassName,
  value = '',
  variant = 'soft',
}: DatePickerFieldProps) => {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const descriptionId = `${fieldId}-description`;
  const messageId = `${fieldId}-message`;
  const errorMessage = error === true ? undefined : error;
  const describedBy =
    [description && descriptionId, (errorMessage || helperText) && messageId]
      .filter(Boolean)
      .join(' ') || undefined;

  const [open, setOpen] = useState(false);
  const selectedDate = useMemo(() => parseIsoDate(value), [value]);
  const displayValue = value.trim() ? formatIsoDateDisplay(value) : null;

  const disabledDays = useMemo((): Matcher | Matcher[] | undefined => {
    if (!disableFutureDates) return undefined;
    return (date) => isFutureLocalDay(date);
  }, [disableFutureDates]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (disabled) return;
    setOpen(nextOpen);
  };

  const handleSelect = (date: Date | undefined) => {
    if (!date) return;
    onValueChange?.(formatIsoDate(date));
    setOpen(false);
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
      htmlFor={fieldId}
      label={label}
      required={required}
      size={labelSize ?? (variant === 'soft' ? 'compact' : 'default')}
    >
      <Popover onOpenChange={handleOpenChange} open={open}>
        <PopoverTrigger
          aria-describedby={describedBy}
          aria-invalid={Boolean(error) || undefined}
          disabled={disabled}
          id={fieldId}
          name={name}
          render={
            <button
              className={cn(
                selectTriggerVariants({ size, variant }),
                datePickerTriggerVariants({
                  placeholder: !displayValue,
                }),
                triggerClassName,
              )}
              type="button"
            />
          }
        >
          <ScheduleIcon aria-hidden className="size-4 shrink-0 opacity-70" />
          <span className="truncate">{displayValue ?? placeholder}</span>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            defaultMonth={selectedDate}
            disabled={disabledDays}
            mode="single"
            onSelect={handleSelect}
            selected={selectedDate}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
};
