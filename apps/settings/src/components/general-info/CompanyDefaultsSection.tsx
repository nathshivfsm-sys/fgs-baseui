import { Controller, useFormContext } from 'react-hook-form';
import type { CompanyGeneralInfo } from '@cms/settings-data-access';
import { SelectField, SwitchField } from '@cms/ui';
import { TIME_ZONE_OPTIONS } from '../../constants/company-options';
import { withCurrentOption } from '../../lib/with-current-option';
import { FormSection } from './FormSection';

export function CompanyDefaultsSection() {
  const { control } = useFormContext<CompanyGeneralInfo>();

  return (
    <FormSection title="Company Defaults">
      <Controller
        control={control}
        name="timeZone"
        render={({ field, fieldState }) => (
          <SelectField
            error={fieldState.error?.message}
            label="Time Zone"
            name={field.name}
            onValueChange={(value) => field.onChange(value ?? '')}
            options={withCurrentOption(TIME_ZONE_OPTIONS, field.value)}
            placeholder="Select time zone"
            required
            value={field.value}
            variant="soft"
          />
        )}
      />
      <Controller
        control={control}
        name="isActive"
        render={({ field }) => (
          <div aria-label="Status" className="flex flex-col gap-2" role="group">
            <span
              aria-hidden="true"
              className="text-caption font-medium leading-4 text-heading"
            >
              Status
            </span>
            <SwitchField
              checked={field.value}
              label={field.value ? 'Active' : 'Inactive'}
              labelPosition="after"
              name={field.name}
              onCheckedChange={field.onChange}
            />
          </div>
        )}
      />
    </FormSection>
  );
}
