import {
  Controller,
  useFormContext,
  type FieldPathByValue,
  type FieldValues,
} from 'react-hook-form';
import { TextInput, type TextInputProps } from '@cms/ui';

export interface FormTextInputProps<Values extends FieldValues>
  extends Omit<TextInputProps, 'defaultValue' | 'error' | 'name' | 'value'> {
  name: FieldPathByValue<Values, string>;
}

export const FormTextInput = <Values extends FieldValues>({
  name,
  ...inputProps
}: FormTextInputProps<Values>) => {
  const { control } = useFormContext<Values>();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <TextInput
          {...inputProps}
          error={fieldState.error?.message}
          name={field.name}
          onBlur={field.onBlur}
          onChange={field.onChange}
          ref={field.ref}
          value={field.value}
          variant="soft"
        />
      )}
    />
  );
};
