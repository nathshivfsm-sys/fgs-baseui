import { Controller, useFormContext, type FieldValues } from 'react-hook-form';
import { MultiSelectField } from '@cms/ui';
import type { FormMultiSelectFieldProps } from '../../types';
import { withCurrentOptions } from '../../util';

/**
 * `MultiSelectField` bound to the enclosing `FormProvider`. Keeps API-returned
 * values selectable even when they are missing from the lookup list.
 */
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
          onValueChange={(value) => field.onChange(value ?? [])}
          options={withCurrentOptions(options, field.value ?? [])}
          value={field.value ?? []}
          variant="soft"
        />
      )}
    />
  );
};
