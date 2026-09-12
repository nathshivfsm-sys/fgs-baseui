import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { QueryClient } from '@tanstack/react-query';
import {
  companyGeneralInfoFormSchema,
  toCompanyPatch,
  type CompanyGeneralInfo,
  type CompanyPatchDto,
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

const COMPANY_FORM_ID = 'company-general-info';

export interface CompanySettingsFormProps {
  isPending: boolean;
  onCancel: () => void;
  onSubmit: (patch: CompanyPatchDto) => void;
  profile: CompanyProfile;
  queryClient: QueryClient;
}

export function CompanySettingsForm({
  isPending,
  onCancel,
  onSubmit,
  profile,
  queryClient,
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

  function handleFormSubmit(values: CompanyGeneralInfo) {
    onSubmit(toCompanyPatch(values, dirtyFields));
  }

  return (
    <FormProvider {...form}>
      <div
        className="flex min-h-0 flex-1 flex-col gap-6 overflow-hidden"
        data-testid="company-settings-form"
      >
        <SectionCard
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
          padding="none"
          radius="panel"
          tone="soft"
        >
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
              <form
                className="space-y-6 p-5 lg:border-r lg:border-border-subtle"
                id={COMPANY_FORM_ID}
                noValidate
                onSubmit={form.handleSubmit(handleFormSubmit)}
              >
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
              </form>
              <div className="min-w-0 border-t border-border-subtle p-5 lg:border-t-0">
                <NonWorkingDaysPanel queryClient={queryClient} />
              </div>
            </div>
          </div>
        </SectionCard>

        <div className="flex shrink-0 flex-col-reverse gap-3 bg-background sm:flex-row sm:justify-end">
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
            form={COMPANY_FORM_ID}
            loading={isPending}
            loadingText="Saving…"
            size="comfortable"
            type="submit"
            variant="action"
          >
            Save
          </Button>
        </div>
      </div>
    </FormProvider>
  );
}
