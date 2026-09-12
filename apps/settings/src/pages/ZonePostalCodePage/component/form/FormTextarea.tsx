import {
  useFormContext,
  type FieldPathByValue,
  type FieldValues,
} from 'react-hook-form';
import { Textarea, type TextareaProps } from '@cms/ui';

export interface FormTextareaProps<Values extends FieldValues>
  extends Omit<TextareaProps, 'defaultValue' | 'error' | 'name' | 'value'> {
  name: FieldPathByValue<Values, string>;
}

export function FormTextarea<Values extends FieldValues>({
  name,
  ...textareaProps
}: FormTextareaProps<Values>) {
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
}
