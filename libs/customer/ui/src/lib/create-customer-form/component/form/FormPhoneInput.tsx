import {
  Controller,
  useFormContext,
  type FieldPathByValue,
  type FieldValues,
} from 'react-hook-form';
import {
  isValidPhoneNumber,
  PHONE_INVALID_MESSAGE,
  phoneDigitsOnly,
  PhoneInput,
} from '@cms/ui';
import type { FormPhoneInputProps } from '../../types';

export const FormPhoneInput = <Values extends FieldValues>({
  name,
  ...inputProps
}: FormPhoneInputProps<Values>) => {
  const { control } = useFormContext<Values>();

  return (
    <Controller
      control={control}
      name={name as FieldPathByValue<Values, string>}
      render={({ field, fieldState }) => (
        <PhoneInput
          {...inputProps}
          error={fieldState.error?.message}
          name={field.name}
          onBlur={field.onBlur}
          onValueChange={field.onChange}
          value={phoneDigitsOnly(field.value ?? '')}
          variant="soft"
        />
      )}
      rules={{
        validate: (value) => {
          const digits = phoneDigitsOnly(String(value ?? ''));
          if (digits === '') return true;
          return isValidPhoneNumber(digits) || PHONE_INVALID_MESSAGE;
        },
      }}
    />
  );
};
