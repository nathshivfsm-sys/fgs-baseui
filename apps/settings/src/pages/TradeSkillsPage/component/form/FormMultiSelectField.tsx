import {
  Controller,
  useFormContext,
  type FieldPathByValue,
  type FieldValues,
} from 'react-hook-form';
import {
  MultiSelectField,
  type MultiSelectFieldProps,
  type SelectOption,
} from '@cms/ui';
import { withCurrentOptions } from '../../util';

export interface FormMultiSelectFieldProps<Values extends FieldValues>
  extends Omit<
    MultiSelectFieldProps,
    'defaultValue' | 'error' | 'name' | 'onValueChange' | 'options' | 'value'
  > {
  name: FieldPathByValue<Values, string[]>;
  options: readonly SelectOption[];
}

export const FormMultiSelectField = <Values extends FieldValues>({
  name,
  options,
  ...selectProps
}: FormMultiSelectFieldProps<Values>) => {
  const { control } = useFormContext<Values>();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <MultiSelectField
          {...selectProps}
          error={fieldState.error?.message}
          name={field.name}
          onValueChange={field.onChange}
          options={withCurrentOptions(options, field.value ?? [])}
          value={field.value ?? []}
          variant="soft"
        />
      )}
    />
  );
};
