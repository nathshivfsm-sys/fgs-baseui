import {
  Controller,
  useFormContext,
  type FieldPathByValue,
  type FieldValues,
} from 'react-hook-form';
import { SelectField, type SelectFieldProps, type SelectOption } from '@cms/ui';
import { withCurrentOption } from '../../util';

export interface FormSelectFieldProps<Values extends FieldValues>
  extends Omit<
    SelectFieldProps,
    'defaultValue' | 'error' | 'name' | 'onValueChange' | 'options' | 'value'
  > {
  name: FieldPathByValue<Values, string>;
  onValueChange?: (value: string) => void;
  options: readonly SelectOption[];
}

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
        const handleValueChange = (value: string | null) => {
          if (value == null || value === '') {
            if (selectProps.required) {
              return;
            }
            field.onChange('');
            onValueChange?.('');
            return;
          }
          field.onChange(value);
          onValueChange?.(value);
        };

        const selectValue =
          field.value === '' || field.value == null ? undefined : field.value;

        return (
          <SelectField
            {...selectProps}
            error={fieldState.error?.message}
            name={field.name}
            onValueChange={handleValueChange}
            options={withCurrentOption(options, field.value ?? '')}
            value={selectValue}
            variant="soft"
          />
        );
      }}
    />
  );
};
