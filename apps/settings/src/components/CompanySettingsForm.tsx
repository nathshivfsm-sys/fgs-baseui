import { FormProvider, useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  companyGeneralInfoSchema,
  toCompanyPatch,
  type CompanyGeneralInfo,
  type CompanyPatch,
  type CompanyProfile,
} from '@cms/settings-data-access';
import { Button, SectionCard } from '@cms/ui';
import { AddressesSection } from './general-info/AddressesSection';
import { BrandingSection } from './general-info/BrandingSection';
import { CompanyDefaultsSection } from './general-info/CompanyDefaultsSection';
import { CompanyInformationSection } from './general-info/CompanyInformationSection';
import { ContactInformationSection } from './general-info/ContactInformationSection';
import { NonWorkingDaysPanel } from './general-info/NonWorkingDaysPanel';

export interface CompanySettingsFormProps {
  isPending: boolean;
  onCancel: () => void;
  onSubmit: (patch: CompanyPatch) => void;
  profile: CompanyProfile;
}

export function CompanySettingsForm({
  isPending,
  onCancel,
  onSubmit,
  profile,
}: CompanySettingsFormProps) {
  const form = useForm<CompanyGeneralInfo>({
    mode: 'onBlur',
    resolver: zodResolver(
      companyGeneralInfoSchema,
    ) as Resolver<CompanyGeneralInfo>,
    // Re-seeds (and clears dirty state) whenever the detail query refetches after a save.
    values: profile.generalInfo,
  });
  // Read during render: RHF's formState proxy only tracks what a component subscribes to.
  const { dirtyFields, isDirty } = form.formState;

  return (
    <FormProvider {...form}>
      <form
        className="space-y-6"
        data-testid="company-settings-form"
        // Zod owns validation and its messages; native constraint bubbles would pre-empt it.
        noValidate
        onSubmit={form.handleSubmit((values) =>
          onSubmit(toCompanyPatch(values, dirtyFields)),
        )}
      >
        <SectionCard
          className="grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]"
          padding="none"
          radius="panel"
          tone="soft"
        >
          <div className="space-y-6 p-5 lg:border-r lg:border-border-subtle">
            <CompanyInformationSection
              code={profile.code}
              companyNumber={profile.companyNumber}
            />
            <ContactInformationSection />
            <AddressesSection
              billingAddress={profile.billingAddress}
              physicalAddress={profile.physicalAddress}
            />
            <BrandingSection />
            <CompanyDefaultsSection />
          </div>
          <div className="border-t border-border-subtle p-5 lg:border-t-0">
            <NonWorkingDaysPanel />
          </div>
        </SectionCard>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            disabled={isPending}
            onClick={onCancel}
            size="comfortable"
            type="button"
            variant="surface"
          >
            Cancel
          </Button>
          <Button
            disabled={isPending || !isDirty}
            loading={isPending}
            loadingText="Saving…"
            size="comfortable"
            type="submit"
            variant="action"
          >
            Save
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
