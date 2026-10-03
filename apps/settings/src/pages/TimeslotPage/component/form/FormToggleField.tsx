import {
  Controller,
  useFormContext,
  type FieldPathByValue,
  type FieldValues,
} from 'react-hook-form';
import { Switch } from '@cms/ui';

export interface FormToggleFieldProps<Values extends FieldValues> {
  label: string;
  name: FieldPathByValue<Values, boolean>;
}

export const FormToggleField = <Values extends FieldValues>({
  label,
  name,
}: FormToggleFieldProps<Values>) => {
  const { control } = useFormContext<Values>();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className="flex items-center gap-3">
          <span className="text-control text-surface-foreground">{label}</span>
          <Switch
            aria-label={label}
            checked={field.value}
            onCheckedChange={field.onChange}
          />
        </div>
      )}
    />
  );
};
