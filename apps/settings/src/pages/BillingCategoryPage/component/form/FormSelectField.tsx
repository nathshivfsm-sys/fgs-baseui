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
  onValueChange?: (value: string) => void;
  options: readonly SelectOption[];
}

const withCurrentOption = (
  options: readonly SelectOption[],
  value: string,
): SelectOption[] => {
  if (!value) return [...options];
  if (options.some((option) => option.value === value)) return [...options];
  return [{ label: value, value }, ...options];
};

export const FormSelectField = <Values extends FieldValues>({
  name,
  onValueChange,
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
          const value = next ?? '';
          field.onChange(value);
          onValueChange?.(value);
        };

        return (
          <SelectField
            {...selectProps}
            error={fieldState.error?.message}
            name={field.name}
            onValueChange={handleValueChange}
            options={withCurrentOption(options, field.value)}
            value={field.value}
            variant="soft"
          />
        );
      }}
    />
  );
};
