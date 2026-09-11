import type { CompanyGeneralInfo } from '@cms/settings-data-access';
import { TextInput } from '@cms/ui';
import { COMPANY_SIZE_OPTIONS } from '../../constant';
import { FormSelectField, FormTextInput } from '../form';
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
  return (
    <FormSection title="Company Information">
      <FormTextInput<CompanyGeneralInfo>
        label="Name"
        name="name"
        placeholder="Enter company name"
        required
      />
      <FormTextInput<CompanyGeneralInfo>
        label="Legal Name"
        name="legalName"
        placeholder="Enter legal name"
        required
      />
      <TextInput label="Code" readOnly value={code} variant="soft" />
      <TextInput
        label="Company Number"
        readOnly
        value={companyNumber}
        variant="soft"
      />
      <FormSelectField<CompanyGeneralInfo>
        label="Company Size"
        name="companySize"
        options={COMPANY_SIZE_OPTIONS}
        placeholder="Select company size"
      />
      <FormTextInput<CompanyGeneralInfo>
        label="Tax ID"
        name="taxId"
        placeholder="Enter tax ID"
      />
    </FormSection>
  );
}
