import { useId } from 'react';
import {
  Controller,
  useFormContext,
  type FieldPathByValue,
  type FieldValues,
} from 'react-hook-form';
import { Checkbox } from '@cms/ui';

export interface FormCheckboxProps<Values extends FieldValues> {
  disabled?: boolean;
  label: string;
  name: FieldPathByValue<Values, boolean>;
}

export const FormCheckbox = <Values extends FieldValues>({
  disabled,
  label,
  name,
}: FormCheckboxProps<Values>) => {
  const labelId = useId();
  const { control } = useFormContext<Values>();

  return (
    <div className="flex items-center gap-2">
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Checkbox
            aria-labelledby={labelId}
            checked={Boolean(field.value)}
            disabled={disabled}
            onCheckedChange={(checked) => field.onChange(checked === true)}
            radius="xs"
            size="sm"
            tone="action"
          />
        )}
      />
      <span className="text-control text-surface-foreground" id={labelId}>
        {label}
      </span>
    </div>
  );
};
