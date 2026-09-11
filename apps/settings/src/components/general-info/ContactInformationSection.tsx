import { useFormContext } from 'react-hook-form';
import type { CompanyGeneralInfo } from '@cms/settings-data-access';
import { TextInput } from '@cms/ui';
import { FormSection } from './FormSection';

export function ContactInformationSection() {
  const {
    formState: { errors },
    register,
  } = useFormContext<CompanyGeneralInfo>();

  return (
    <FormSection title="Contact Information">
      <TextInput
        autoComplete="email"
        error={errors.email?.message}
        label="Email"
        placeholder="Enter email"
        required
        type="email"
        variant="soft"
        {...register('email')}
      />
      <TextInput
        autoComplete="tel"
        error={errors.phoneNumber?.message}
        inputMode="tel"
        label="Phone Number"
        placeholder="(000) 000-0000"
        required
        type="tel"
        variant="soft"
        {...register('phoneNumber')}
      />
      <div className="sm:col-span-2">
        <TextInput
          error={errors.website?.message}
          label="Website"
          placeholder="www.example.com"
          variant="soft"
          {...register('website')}
        />
      </div>
    </FormSection>
  );
}
