import {
  Controller,
  useFormContext,
  type FieldPathByValue,
  type FieldValues,
} from 'react-hook-form';
import { InfoCircleIcon, Switch } from '@cms/ui';

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
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-control text-surface-foreground">
              {label}
            </span>
            <InfoCircleIcon
              aria-hidden
              className="size-3.5 shrink-0 text-foreground-subtle"
            />
          </div>
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
