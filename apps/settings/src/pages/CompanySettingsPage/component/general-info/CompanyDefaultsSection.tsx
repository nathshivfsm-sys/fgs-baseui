import { Controller, useFormContext } from 'react-hook-form';
import type { CompanyGeneralInfo } from '@cms/settings-data-access';
import { SwitchField } from '@cms/ui';
import { TIME_ZONE_OPTIONS } from '../../constant';
import { FormSelectField } from '../form';
import { FormSection } from './FormSection';

export function CompanyDefaultsSection() {
  const { control } = useFormContext<CompanyGeneralInfo>();

  return (
    <FormSection title="Company Defaults">
      <FormSelectField<CompanyGeneralInfo>
        label="Time Zone"
        name="timeZone"
        options={TIME_ZONE_OPTIONS}
        placeholder="Select time zone"
        required
      />
      {/* Left as a bare Controller: the switch carries its own label markup, so a
          wrapper would have nothing to share with the text and select fields. */}
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
