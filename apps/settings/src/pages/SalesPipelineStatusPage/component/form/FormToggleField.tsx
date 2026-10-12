import {
  Controller,
  useFormContext,
  type FieldPathByValue,
  type FieldValues,
} from 'react-hook-form';
import { BodySmall, Switch, cn } from '@cms/ui';

export interface FormToggleFieldProps<Values extends FieldValues> {
  description?: string;
  disabled?: boolean;
  label: string;
  muted?: boolean;
  name: FieldPathByValue<Values, boolean>;
}

export const FormToggleField = <Values extends FieldValues>({
  description,
  disabled,
  label,
  muted,
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
            muted && 'bg-muted/60',
          )}
        >
          <div className="min-w-0">
            <span className="text-control font-medium text-surface-foreground">
              {label}
            </span>
            {description ? (
              <BodySmall className="mt-0.5" color="foreground-subtle">
                {description}
              </BodySmall>
            ) : null}
          </div>
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
