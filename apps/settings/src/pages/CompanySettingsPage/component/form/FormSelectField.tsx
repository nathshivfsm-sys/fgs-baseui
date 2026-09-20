import { Controller, useFormContext, type FieldValues } from 'react-hook-form';
import { SelectField } from '@cms/ui';
import type { FormSelectFieldProps } from '../../types';
import { withCurrentOption } from '../../util';

/**
 * `SelectField` bound to the enclosing `FormProvider`. Keeps the value the API returned
 * selectable via `withCurrentOption`, and normalises the primitive's `null` clear to the
 * empty string the form schema expects.
 */
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
          const next = value ?? '';
          field.onChange(next);
          onValueChange?.(next);
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
