import {
  useFormContext,
  type FieldPathByValue,
  type FieldValues,
} from 'react-hook-form';
import { TextInput, type TextInputProps } from '@cms/ui';

export interface FormTextInputProps<Values extends FieldValues>
  extends Omit<TextInputProps, 'defaultValue' | 'error' | 'name' | 'value'> {
  name: FieldPathByValue<Values, string>;
}

export function FormTextInput<Values extends FieldValues>({
  name,
  ...inputProps
}: FormTextInputProps<Values>) {
  const { formState, getFieldState, register } = useFormContext<Values>();
  const { error } = getFieldState(name, formState);

  return (
    <TextInput
      {...inputProps}
      error={error?.message}
      variant="soft"
      {...register(name)}
    />
  );
}
