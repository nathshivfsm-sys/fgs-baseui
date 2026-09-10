import { FormProvider, useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  companySettingsSchema,
  type CompanySettings,
} from '@cms/settings-data-access';
import {
  Button,
  PhoneInput,
  SectionCard,
  SectionContent,
  SectionHeader,
  SectionTitle,
  Textarea,
  TextInput,
} from '@cms/ui';
import { BusinessUnitsFieldArray } from './sections/BusinessUnitsFieldArray';
import { PtosFieldArray } from './sections/PtosFieldArray';
import { TaxCodesFieldArray } from './sections/TaxCodesFieldArray';

export interface CompanySettingsFormProps {
  isPending: boolean;
  onCancel: () => void;
  onSubmit: (data: CompanySettings) => void;
  settings: CompanySettings;
}

export function CompanySettingsForm({
  isPending,
  onCancel,
  onSubmit,
  settings,
}: CompanySettingsFormProps) {
  const form = useForm<CompanySettings>({
    mode: 'onBlur',
    resolver: zodResolver(
      companySettingsSchema,
    ) as Resolver<CompanySettings>,
    values: settings,
  });

  return (
    <FormProvider {...form}>
      <form
        className="space-y-6"
        data-testid="company-settings-form"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <SectionCard padding="comfortable" radius="panel" tone="soft">
          <SectionHeader bordered>
            <SectionTitle size="sm">Company information</SectionTitle>
          </SectionHeader>
          <SectionContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextInput
              error={form.formState.errors.companyName?.message}
              label="Company name"
              placeholder="Enter company name"
              required
              variant="soft"
              {...form.register('companyName')}
            />
            <TextInput
              error={form.formState.errors.contactEmail?.message}
              label="Contact email"
              placeholder="Enter contact email"
              required
              type="email"
              variant="soft"
              {...form.register('contactEmail')}
            />
            <PhoneInput
              error={form.formState.errors.phone?.message}
              label="Phone"
              variant="soft"
              {...form.register('phone')}
            />
            <Textarea
              className="sm:col-span-2"
              error={form.formState.errors.address?.message}
              label="Address"
              placeholder="Enter address"
              variant="soft"
              {...form.register('address')}
            />
          </SectionContent>
        </SectionCard>

        <SectionCard padding="comfortable" radius="panel" tone="soft">
          <SectionHeader bordered>
            <SectionTitle size="sm">PTO types</SectionTitle>
          </SectionHeader>
          <SectionContent>
            <PtosFieldArray />
          </SectionContent>
        </SectionCard>

        <SectionCard padding="comfortable" radius="panel" tone="soft">
          <SectionHeader bordered>
            <SectionTitle size="sm">Tax codes</SectionTitle>
          </SectionHeader>
          <SectionContent>
            <TaxCodesFieldArray />
          </SectionContent>
        </SectionCard>

        <SectionCard padding="comfortable" radius="panel" tone="soft">
          <SectionHeader bordered>
            <SectionTitle size="sm">Business units</SectionTitle>
          </SectionHeader>
          <SectionContent>
            <BusinessUnitsFieldArray />
          </SectionContent>
        </SectionCard>

        <div className="flex flex-col-reverse gap-3 border-t border-border-subtle pt-4 sm:flex-row sm:justify-end">
          <Button
            disabled={isPending}
            onClick={onCancel}
            type="button"
            variant="surface"
          >
            Cancel
          </Button>
          <Button
            disabled={isPending}
            loading={isPending}
            loadingText="Saving…"
            type="submit"
          >
            Save settings
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
