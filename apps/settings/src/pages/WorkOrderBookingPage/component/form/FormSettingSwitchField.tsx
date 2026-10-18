import {
  Controller,
  useFormContext,
  type FieldPathByValue,
  type FieldValues,
} from 'react-hook-form';
import { BodySmall, Switch } from '@cms/ui';

export interface FormSettingSwitchFieldProps<Values extends FieldValues> {
  description: string;
  label: string;
  name: FieldPathByValue<Values, boolean>;
  readOnly?: boolean;
}

export const FormSettingSwitchField = <Values extends FieldValues>({
  description,
  label,
  name,
  readOnly = false,
}: FormSettingSwitchFieldProps<Values>) => {
  const { control } = useFormContext<Values>();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className="flex items-start justify-between gap-4 border-b border-border-subtle py-4 last:border-b-0 last:pb-0 first:pt-0">
          <div className="min-w-0 space-y-1">
            <p className="text-control font-medium text-surface-foreground">
              {label}
            </p>
            <BodySmall color="foreground-subtle">{description}</BodySmall>
          </div>
          <Switch
            aria-label={label}
            checked={field.value}
            disabled={readOnly}
            onCheckedChange={field.onChange}
          />
        </div>
      )}
    />
  );
};
