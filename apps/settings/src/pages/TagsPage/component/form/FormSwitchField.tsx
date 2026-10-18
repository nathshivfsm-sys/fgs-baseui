import {
  Controller,
  useFormContext,
  type FieldPathByValue,
  type FieldValues,
} from 'react-hook-form';
import { Switch } from '@cms/ui';
import { ACTIVE_TOGGLE_LABEL } from '../../constant';

export interface FormSwitchFieldProps<Values extends FieldValues> {
  name: FieldPathByValue<Values, boolean>;
}

export const FormSwitchField = <Values extends FieldValues>({
  name,
}: FormSwitchFieldProps<Values>) => {
  const { control } = useFormContext<Values>();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className="flex items-center gap-2">
          <Switch
            aria-label={ACTIVE_TOGGLE_LABEL}
            checked={field.value}
            onCheckedChange={field.onChange}
          />
          <span className="text-control text-foreground">
            {ACTIVE_TOGGLE_LABEL}
          </span>
        </div>
      )}
    />
  );
};
