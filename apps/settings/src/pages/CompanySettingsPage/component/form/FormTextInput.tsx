import { useFormContext, type FieldValues } from 'react-hook-form';
import { TextInput } from '@cms/ui';
import type { FormTextInputProps } from '../../types';

/**
 * `TextInput` bound to the enclosing `FormProvider`: register plus error lookup in one
 * line, so a section lists its fields instead of restating the wiring for each one.
 * Uncontrolled, like `register` on its own — `getFieldState` only reads the error.
 */
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
