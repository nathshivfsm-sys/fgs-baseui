import { useId } from 'react';
import {
  Controller,
  useFormContext,
  type FieldPathByValue,
  type FieldValues,
} from 'react-hook-form';
import { Checkbox, Field } from '@cms/ui';

export interface FormStackedCheckboxProps<Values extends FieldValues> {
  checkboxLabel?: string;
  disabled?: boolean;
  label: string;
  name: FieldPathByValue<Values, boolean>;
}

/** Checkbox with a field label above the control, aligned with soft `TextInput` rows. */
export const FormStackedCheckbox = <Values extends FieldValues>({
  checkboxLabel,
  disabled,
  label,
  name,
}: FormStackedCheckboxProps<Values>) => {
  const inputId = useId();
  const checkboxLabelId = useId();
  const { control } = useFormContext<Values>();

  return (
    <Field htmlFor={inputId} label={label} size="compact">
      <div className="flex min-h-9 items-center gap-2">
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <Checkbox
              aria-labelledby={checkboxLabel ? checkboxLabelId : undefined}
              aria-label={checkboxLabel ? undefined : label}
              checked={Boolean(field.value)}
              disabled={disabled}
              id={inputId}
              onCheckedChange={(checked) => field.onChange(checked === true)}
              radius="xs"
              size="sm"
              tone="action"
            />
          )}
        />
        {checkboxLabel ? (
          <span
            className="text-control text-surface-foreground"
            id={checkboxLabelId}
          >
            {checkboxLabel}
          </span>
        ) : null}
      </div>
    </Field>
  );
};
