import {
  Controller,
  useFormContext,
  type FieldPathByValue,
  type FieldValues,
} from 'react-hook-form';
import { SelectField, type SelectFieldProps, type SelectOption } from '@cms/ui';

export interface FormSelectFieldProps<Values extends FieldValues>
  extends Omit<
    SelectFieldProps,
    'defaultValue' | 'error' | 'name' | 'onValueChange' | 'options' | 'value'
  > {
  name: FieldPathByValue<Values, string>;
  options: readonly SelectOption[];
}

export const FormSelectField = <Values extends FieldValues>({
  name,
  options,
  ...selectProps
}: FormSelectFieldProps<Values>) => {
  const { control } = useFormContext<Values>();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const handleValueChange = (next: string | null) => {
          field.onChange(next ?? '');
        };

        return (
          <SelectField
            {...selectProps}
            error={fieldState.error?.message}
            name={field.name}
            onValueChange={handleValueChange}
            options={options}
            value={field.value}
            variant="soft"
          />
        );
      }}
    />
  );
};
