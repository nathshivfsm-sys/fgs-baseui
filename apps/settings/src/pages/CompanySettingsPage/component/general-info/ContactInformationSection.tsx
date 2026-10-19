import type { CompanyGeneralInfo } from '@cms/settings-data-access';
import {
  FormEmailInput,
  FormPhoneInput,
} from '../../../../shared/component/form';
import { FormTextInput } from '../form';
import { FormSection } from './FormSection';

export const ContactInformationSection = () => (
  <FormSection title="Contact Information">
    <FormEmailInput<CompanyGeneralInfo>
      label="Email"
      name="email"
      placeholder="Enter email"
      required
    />
    <FormPhoneInput<CompanyGeneralInfo>
      label="Phone Number"
      name="phoneNumber"
      placeholder="(000) 000-0000"
      required
    />
    <div className="sm:col-span-2">
      <FormTextInput<CompanyGeneralInfo>
        label="Website"
        name="website"
        placeholder="www.example.com"
      />
    </div>
  </FormSection>
);
