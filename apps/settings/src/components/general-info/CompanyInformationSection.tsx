import { Controller, useFormContext } from 'react-hook-form';
import type { CompanyGeneralInfo } from '@cms/settings-data-access';
import { SelectField, TextInput } from '@cms/ui';
import { COMPANY_SIZE_OPTIONS } from '../../constants/company-options';
import { withCurrentOption } from '../../lib/with-current-option';
import { FormSection } from './FormSection';

export interface CompanyInformationSectionProps {
  code: string;
  companyNumber: string;
}

/** Code and Company Number are read-only: the number is the endpoint's path key. */
export function CompanyInformationSection({
  code,
  companyNumber,
}: CompanyInformationSectionProps) {
  const {
    control,
    formState: { errors },
    register,
  } = useFormContext<CompanyGeneralInfo>();

  return (
    <FormSection title="Company Information">
      <TextInput
        error={errors.name?.message}
        label="Name"
        placeholder="Enter company name"
        required
        variant="soft"
        {...register('name')}
      />
      <TextInput
        error={errors.legalName?.message}
        label="Legal Name"
        placeholder="Enter legal name"
        required
        variant="soft"
        {...register('legalName')}
      />
      <TextInput label="Code" readOnly value={code} variant="soft" />
      <TextInput
        label="Company Number"
        readOnly
        value={companyNumber}
        variant="soft"
      />
      <Controller
        control={control}
        name="companySize"
        render={({ field, fieldState }) => (
          <SelectField
            error={fieldState.error?.message}
            label="Company Size"
            name={field.name}
            onValueChange={(value) => field.onChange(value ?? '')}
            options={withCurrentOption(COMPANY_SIZE_OPTIONS, field.value)}
            placeholder="Select company size"
            value={field.value}
            variant="soft"
          />
        )}
      />
      <TextInput
        error={errors.taxId?.message}
        label="Tax ID"
        placeholder="Enter tax ID"
        variant="soft"
        {...register('taxId')}
      />
    </FormSection>
  );
}
