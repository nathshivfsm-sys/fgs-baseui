import { type ChangeEvent } from 'react';
import {
  Controller,
  useFormContext,
  type FieldPathByValue,
  type FieldValues,
} from 'react-hook-form';
import { TextInput } from '@cms/ui';

const HEX_COLOR = /^#[0-9A-Fa-f]{6}$/;

export interface FormColorInputProps<Values extends FieldValues> {
  fallback: string;
  label: string;
  name: FieldPathByValue<Values, string>;
}

export const FormColorInput = <Values extends FieldValues>({
  fallback,
  label,
  name,
}: FormColorInputProps<Values>) => {
  const { control } = useFormContext<Values>();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const swatch = HEX_COLOR.test(field.value) ? field.value : fallback;
        const handleSwatchChange = (event: ChangeEvent<HTMLInputElement>) => {
          field.onChange(event.target.value);
        };

        return (
          <TextInput
            addOn={
              <input
                aria-label={`${label} swatch`}
                className="mx-2 size-7 cursor-pointer rounded border-0 bg-transparent p-0"
                onChange={handleSwatchChange}
                type="color"
                value={swatch}
              />
            }
            error={fieldState.error?.message}
            label={label}
            name={field.name}
            onBlur={field.onBlur}
            onChange={field.onChange}
            ref={field.ref}
            required
            value={field.value}
            variant="soft"
          />
        );
      }}
    />
  );
};
