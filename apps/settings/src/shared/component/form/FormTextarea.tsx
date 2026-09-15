import {
  useFormContext,
  type FieldValues,
} from 'react-hook-form';
import { Textarea } from '@cms/ui';
import type { FormTextareaProps } from '../../types';

export const FormTextarea = <Values extends FieldValues>({
  name,
  ...textareaProps
}: FormTextareaProps<Values>) => {
  const { formState, getFieldState, register } = useFormContext<Values>();
  const { error } = getFieldState(name, formState);

  return (
    <Textarea
      {...textareaProps}
      error={error?.message}
      variant="soft"
      {...register(name)}
    />
  );
};
