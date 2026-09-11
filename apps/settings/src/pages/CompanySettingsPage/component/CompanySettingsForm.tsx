import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  companyGeneralInfoFormSchema,
  toCompanyPatch,
  type CompanyPatch,
  type CompanyProfile,
} from '@cms/settings-data-access';
import { Button, SectionCard } from '@cms/ui';
import {
  AddressesSection,
  BrandingSection,
  CompanyDefaultsSection,
  CompanyInformationSection,
  ContactInformationSection,
  NonWorkingDaysPanel,
} from './general-info';

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
  const form = useForm({
    mode: 'onBlur',
    resolver: zodResolver(companyGeneralInfoFormSchema),
    // Re-seeds (and clears dirty state) whenever the detail query refetches after a save.
    values: profile.generalInfo,
    // A background refetch must not overwrite what the user is part-way through typing.
    resetOptions: { keepDirtyValues: true },
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
