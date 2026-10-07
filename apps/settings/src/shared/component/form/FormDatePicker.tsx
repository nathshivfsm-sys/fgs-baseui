import {
  Controller,
  useFormContext,
  type FieldPathByValue,
  type FieldValues,
} from 'react-hook-form';
import { DatePickerField } from '@cms/ui';
import type { FormDatePickerProps } from '../../types';

export const FormDatePicker = <Values extends FieldValues>({
  name,
  ...pickerProps
}: FormDatePickerProps<Values>) => {
  const { control } = useFormContext<Values>();

  return (
    <Controller
      control={control}
      name={name as FieldPathByValue<Values, string>}
      render={({ field, fieldState }) => (
        <DatePickerField
          {...pickerProps}
          error={fieldState.error?.message}
          name={field.name}
          onValueChange={field.onChange}
          value={field.value ?? ''}
          variant="soft"
        />
      )}
    />
  );
};
