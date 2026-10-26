import { useFormContext, type FieldValues } from 'react-hook-form';
import {
  EMAIL_INVALID_MESSAGE,
  EmailInputField,
  isValidEmailAddress,
} from '@cms/ui';
import type { FormEmailInputProps } from '../../types';

export const FormEmailInput = <Values extends FieldValues>({
  name,
  ...inputProps
}: FormEmailInputProps<Values>) => {
  const { formState, getFieldState, register } = useFormContext<Values>();
  const { error } = getFieldState(name, formState);

  return (
    <EmailInputField
      {...inputProps}
      error={error?.message}
      variant="soft"
      {...register(name, {
        setValueAs: (value) =>
          typeof value === 'string' ? value.trim() : value,
        validate: (value) => {
          const trimmed = String(value ?? '').trim();
          if (trimmed === '') return true;
          return isValidEmailAddress(trimmed) || EMAIL_INVALID_MESSAGE;
        },
      })}
    />
  );
};
