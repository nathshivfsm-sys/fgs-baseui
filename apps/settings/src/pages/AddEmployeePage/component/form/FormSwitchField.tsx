import {
  Controller,
  useFormContext,
  type FieldPathByValue,
  type FieldValues,
} from 'react-hook-form';
import { SwitchField } from '@cms/ui';

export interface FormSwitchFieldProps<Values extends FieldValues> {
  name: FieldPathByValue<Values, boolean>;
  label: string;
}

export const FormSwitchField = <Values extends FieldValues>({
  label,
  name,
}: FormSwitchFieldProps<Values>) => {
  const { control } = useFormContext<Values>();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <SwitchField
          checked={field.value}
          label={label}
          labelPosition="after"
          name={field.name}
          onCheckedChange={field.onChange}
        />
      )}
    />
  );
};
