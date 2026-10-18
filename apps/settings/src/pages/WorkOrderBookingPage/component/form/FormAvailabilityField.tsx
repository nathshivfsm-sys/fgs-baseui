import {
  Controller,
  useFormContext,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';
import { SelectField, TextInput } from '@cms/ui';
import { AVAILABILITY_UNIT_OPTIONS } from '../../constant';

export interface FormAvailabilityFieldProps<Values extends FieldValues> {
  label: string;
  name: FieldPath<Values>;
  readOnly?: boolean;
}

export const FormAvailabilityField = <Values extends FieldValues>({
  label,
  name,
  readOnly = false,
}: FormAvailabilityFieldProps<Values>) => {
  const { control } = useFormContext<Values>();

  return (
    <div className="space-y-1.5">
      <span className="text-label text-foreground-subtle">{label}</span>
      <div className="flex gap-0">
        <Controller
          control={control}
          name={`${name}.duration` as FieldPath<Values>}
          render={({ field, fieldState }) => (
            <TextInput
              className="rounded-r-none border-r-0"
              disabled={readOnly}
              error={fieldState.error?.message}
              inputMode="numeric"
              label={undefined}
              name={field.name}
              onChange={field.onChange}
              type="number"
              value={field.value === undefined ? '' : String(field.value)}
              variant="soft"
            />
          )}
        />
        <Controller
          control={control}
          name={`${name}.unit` as FieldPath<Values>}
          render={({ field, fieldState }) => (
            <SelectField
              className="min-w-[7.5rem] rounded-l-none"
              disabled={readOnly}
              error={fieldState.error?.message}
              label={undefined}
              name={field.name}
              onValueChange={(value) => field.onChange(value ?? 'Hours')}
              options={AVAILABILITY_UNIT_OPTIONS}
              value={field.value}
              variant="soft"
            />
          )}
        />
      </div>
    </div>
  );
};
