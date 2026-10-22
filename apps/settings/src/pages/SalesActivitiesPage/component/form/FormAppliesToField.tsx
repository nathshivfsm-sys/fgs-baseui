import { Controller, useFormContext } from 'react-hook-form';
import { Checkbox } from '@cms/ui';
import {
  APPLIES_TO_LABEL,
  APPLIES_TO_LEAD_LABEL,
  APPLIES_TO_OPPORTUNITY_LABEL,
} from '../../constant';

export const FormAppliesToField = () => {
  const { control, formState } = useFormContext();
  const error = formState.errors.appliesToLead?.message;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-col gap-3 rounded-lg border border-border px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-control font-medium text-surface-foreground">
          {APPLIES_TO_LABEL} <span className="text-destructive">*</span>
        </span>
        <div className="flex flex-1 items-center justify-end gap-8">
          <Controller
            control={control}
            name="appliesToLead"
            render={({ field }) => {
              const handleCheckedChange = (checked: boolean) => {
                field.onChange(checked === true);
              };

              return (
                <label className="flex items-center gap-2 text-control font-medium text-surface-foreground">
                  {APPLIES_TO_LEAD_LABEL}
                  <Checkbox
                    aria-invalid={Boolean(error) || undefined}
                    checked={field.value === true}
                    onCheckedChange={handleCheckedChange}
                    tone="action"
                  />
                </label>
              );
            }}
          />
          <Controller
            control={control}
            name="appliesToOpportunity"
            render={({ field }) => {
              const handleCheckedChange = (checked: boolean) => {
                field.onChange(checked === true);
              };

              return (
                <label className="flex items-center gap-2 text-control font-medium text-surface-foreground">
                  {APPLIES_TO_OPPORTUNITY_LABEL}
                  <Checkbox
                    aria-invalid={Boolean(error) || undefined}
                    checked={field.value === true}
                    onCheckedChange={handleCheckedChange}
                    tone="action"
                  />
                </label>
              );
            }}
          />
        </div>
      </div>
      {typeof error === 'string' ? (
        <p className="text-caption text-destructive">{error}</p>
      ) : null}
    </div>
  );
};
