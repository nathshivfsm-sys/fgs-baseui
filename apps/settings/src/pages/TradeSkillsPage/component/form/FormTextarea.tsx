import {
  Controller,
  useFormContext,
  type FieldPathByValue,
  type FieldValues,
} from 'react-hook-form';
import { Textarea, type TextareaProps } from '@cms/ui';

export interface FormTextareaProps<Values extends FieldValues>
  extends Omit<TextareaProps, 'defaultValue' | 'error' | 'name' | 'value'> {
  name: FieldPathByValue<Values, string>;
}

export const FormTextarea = <Values extends FieldValues>({
  name,
  ...textareaProps
}: FormTextareaProps<Values>) => {
  const { control } = useFormContext<Values>();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Textarea
          {...textareaProps}
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
