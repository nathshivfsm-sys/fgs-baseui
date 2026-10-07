import {
  Controller,
  useFormContext,
  type FieldPathByValue,
  type FieldValues,
} from 'react-hook-form';
import { TimePickerField } from '@cms/ui';
import type { FormTimePickerProps } from '../../types';

export const FormTimePicker = <Values extends FieldValues>({
  name,
  ...pickerProps
}: FormTimePickerProps<Values>) => {
  const { control } = useFormContext<Values>();

  return (
    <Controller
      control={control}
      name={name as FieldPathByValue<Values, string>}
      render={({ field, fieldState }) => (
        <TimePickerField
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
