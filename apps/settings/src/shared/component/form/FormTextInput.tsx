import {
  useFormContext,
  type FieldValues,
} from 'react-hook-form';
import { TextInput } from '@cms/ui';
import type { FormTextInputProps } from '../../types';

export const FormTextInput = <Values extends FieldValues>({
  name,
  ...inputProps
}: FormTextInputProps<Values>) => {
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
};
