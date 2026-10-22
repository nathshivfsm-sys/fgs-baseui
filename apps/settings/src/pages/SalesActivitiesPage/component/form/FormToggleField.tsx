import {
  Controller,
  useFormContext,
  type FieldPathByValue,
  type FieldValues,
} from 'react-hook-form';
import { Switch, cn } from '@cms/ui';

export interface FormToggleFieldProps<Values extends FieldValues> {
  disabled?: boolean;
  label: string;
  name: FieldPathByValue<Values, boolean>;
}

export const FormToggleField = <Values extends FieldValues>({
  disabled,
  label,
  name,
}: FormToggleFieldProps<Values>) => {
  const { control } = useFormContext<Values>();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div
          className={cn(
            'flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2.5',
          )}
        >
          <span className="text-control font-medium text-surface-foreground">
            {label}
          </span>
          <Switch
            aria-label={label}
            checked={field.value}
            disabled={disabled}
            onCheckedChange={field.onChange}
          />
        </div>
      )}
    />
  );
};
