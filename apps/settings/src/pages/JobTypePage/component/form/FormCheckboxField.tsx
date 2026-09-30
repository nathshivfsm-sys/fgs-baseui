import {
  Controller,
  useFormContext,
  type FieldPathByValue,
  type FieldValues,
} from 'react-hook-form';
import { Checkbox } from '@cms/ui';

export interface FormCheckboxFieldProps<Values extends FieldValues> {
  label: string;
  name: FieldPathByValue<Values, boolean>;
}

export const FormCheckboxField = <Values extends FieldValues>({
  label,
  name,
}: FormCheckboxFieldProps<Values>) => {
  const { control } = useFormContext<Values>();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const handleCheckedChange = (checked: boolean) => {
          field.onChange(checked === true);
        };

        return (
          <label className="flex items-center gap-2 text-field text-heading">
            <Checkbox
              checked={field.value === true}
              onCheckedChange={handleCheckedChange}
              tone="action"
            />
            {label}
          </label>
        );
      }}
    />
  );
};
