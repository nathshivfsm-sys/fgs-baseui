import type { ChangeEvent } from 'react';
import {
  Controller,
  useFormContext,
  type FieldPathByValue,
  type FieldValues,
} from 'react-hook-form';
import { TextInput } from '@cms/ui';

interface FormDaysFieldProps<Values extends FieldValues> {
  disabled?: boolean;
  label: string;
  name: FieldPathByValue<Values, string>;
  required?: boolean;
}

export const FormDaysField = <Values extends FieldValues>({
  disabled = false,
  label,
  name,
  required = false,
}: FormDaysFieldProps<Values>) => {
  const { control } = useFormContext<Values>();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
          field.onChange(event.target.value.replace(/\D/g, ''));
        };

        return (
          <TextInput
            disabled={disabled}
            error={fieldState.error?.message}
            inputMode="numeric"
            label={label}
            name={field.name}
            onBlur={field.onBlur}
            onChange={handleChange}
            ref={field.ref}
            required={required}
            value={field.value}
            variant="soft"
          />
        );
      }}
    />
  );
};
