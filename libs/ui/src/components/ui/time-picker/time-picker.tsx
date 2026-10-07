import { cva, type VariantProps } from 'class-variance-authority';
import type { ReactNode } from 'react';
import { useEffect, useId, useMemo, useState } from 'react';
import { ClockIcon } from '../../../icons';
import { cn } from '../../../lib/cn';
import { Button } from '../button';
import { Field } from '../field';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import { selectTriggerVariants } from '../select';
import {
  formatIsoTime,
  formatIsoTimeDisplay,
  HOUR_OPTIONS,
  minuteOptionsForStep,
  padTimeUnit,
  parseIsoTime,
} from './iso-time';
import { TimePickerColumn } from './time-picker-column';

const timePickerTriggerVariants = cva(
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

export interface TimePickerFieldProps
  extends VariantProps<typeof selectTriggerVariants> {
  className?: string;
  clearable?: boolean;
  description?: ReactNode;
  disabled?: boolean;
  error?: boolean | ReactNode;
  helperText?: ReactNode;
  id?: string;
  label?: ReactNode;
  labelSize?: 'default' | 'compact';
  /** Minute increment in the picker list (1–30). */
  minuteStep?: number;
  name?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  triggerClassName?: string;
  value?: string;
}

export const TimePickerField = ({
  className,
  clearable = false,
  description,
  disabled,
  error,
  helperText,
  id,
  label,
  labelSize,
  minuteStep = 1,
  name,
  onValueChange,
  placeholder = 'Select time',
  required,
  size,
  triggerClassName,
  value = '',
  variant = 'soft',
}: TimePickerFieldProps) => {
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
  const parsed = useMemo(() => parseIsoTime(value), [value]);
  const displayValue = value.trim() ? formatIsoTimeDisplay(value) : null;

  const minuteOptions = useMemo(() => {
    const base = minuteOptionsForStep(minuteStep);
    if (!parsed) return base;
    const minuteLabel = padTimeUnit(parsed.minutes);
    if (base.includes(minuteLabel)) return base;
    return [...base, minuteLabel].sort();
  }, [minuteStep, parsed]);

  const [draftHour, setDraftHour] = useState('09');
  const [draftMinute, setDraftMinute] = useState('00');

  useEffect(() => {
    if (!open) return;
    if (parsed) {
      setDraftHour(String(parsed.hours).padStart(2, '0'));
      setDraftMinute(String(parsed.minutes).padStart(2, '0'));
      return;
    }
    setDraftHour('09');
    setDraftMinute(minuteOptions[0] ?? '00');
  }, [minuteOptions, open, parsed]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (disabled) return;
    setOpen(nextOpen);
  };

  const commitTime = (hours: string, minutes: string) => {
    onValueChange?.(
      formatIsoTime(Number.parseInt(hours, 10), Number.parseInt(minutes, 10)),
    );
    setOpen(false);
  };

  const handleHourChange = (hour: string) => {
    setDraftHour(hour);
  };

  const handleMinuteChange = (minute: string) => {
    setDraftMinute(minute);
  };

  const handleDone = () => {
    commitTime(draftHour, draftMinute);
  };

  const handleClear = () => {
    onValueChange?.('');
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
                timePickerTriggerVariants({
                  placeholder: !displayValue,
                }),
                triggerClassName,
              )}
              type="button"
            />
          }
        >
          <ClockIcon aria-hidden className="size-4 shrink-0 opacity-70" />
          <span className="truncate">{displayValue ?? placeholder}</span>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto min-w-[11rem] p-0">
          <div className="flex flex-col gap-2 p-3">
            <div className="flex gap-3">
              <TimePickerColumn
                label="Hour"
                onValueChange={handleHourChange}
                options={HOUR_OPTIONS}
                value={draftHour}
              />
              <TimePickerColumn
                label="Min"
                onValueChange={handleMinuteChange}
                options={minuteOptions}
                value={draftMinute}
              />
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-border pt-2">
              {clearable && value.trim() !== '' ? (
                <Button
                  onClick={handleClear}
                  size="compact"
                  type="button"
                  variant="ghost"
                >
                  Clear
                </Button>
              ) : null}
              <Button
                onClick={handleDone}
                size="compact"
                type="button"
                variant="action"
              >
                Done
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </Field>
  );
};
