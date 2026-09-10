import { useMutation, useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import type { QueryClient } from '@tanstack/react-query';
import { ApiError } from '@cms/shared-api';
import {
  companySettingsKeys,
  companySettingsQueryOptions,
  loadCompanySettings as defaultLoad,
  saveCompanySettings as defaultSave,
  type CompanySettings,
  type LoadCompanySettings,
  type SaveCompanySettings,
} from '@cms/settings-data-access';
import {
  BodySmall,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Callout,
  Heading1,
} from '@cms/ui';
import { useState } from 'react';
import { CompanySettingsForm } from '../components/CompanySettingsForm';

export interface CompanySettingsPageProps {
  companyId: string;
  loadCompanySettings?: LoadCompanySettings;
  queryClient: QueryClient;
  saveCompanySettings?: SaveCompanySettings;
}

export function CompanySettingsPage({
  companyId,
  loadCompanySettings = defaultLoad,
  queryClient,
  saveCompanySettings = defaultSave,
}: CompanySettingsPageProps) {
  const navigate = useNavigate();
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const query = useQuery(
    companySettingsQueryOptions(companyId, loadCompanySettings),
    queryClient,
  );
  const mutation = useMutation(
    {
      mutationFn: (settings: CompanySettings) =>
        saveCompanySettings(companyId, settings),
      meta: { feature: 'company-settings', operation: 'update' },
      onSuccess: (data) => {
        queryClient.setQueryData(companySettingsKeys.detail(companyId), data);
        setSaveError(null);
        setSaveMessage('Settings updated successfully');
      },
      onError: (error: unknown) => {
        setSaveMessage(null);
        if (error instanceof ApiError && error.status === 409) {
          setSaveError('Settings already updated by another user');
          return;
        }
        setSaveError(
          error instanceof Error ? error.message : 'Failed to update settings',
        );
      },
    },
    queryClient,
  );

  return (
    <section className="space-y-6" data-testid="company-settings">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link
              className="rounded-sm outline-none transition-colors hover:text-action focus-visible:ring-[3px] focus-visible:ring-ring/30"
              to="../.."
            >
              Setup
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <span>Company</span>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>General Info</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header>
        <Heading1>General Info</Heading1>
        <BodySmall color="foreground-subtle">
          Configure company details, contact information, PTO types, tax codes,
          and business units.
        </BodySmall>
      </header>

      {saveMessage != null && (
        <Callout title="Saved" variant="success">
          {saveMessage}
        </Callout>
      )}
      {saveError != null && (
        <Callout title="Could not save" variant="error">
          {saveError}
        </Callout>
      )}

      {query.isPending ? (
        <BodySmall role="status">Loading company settings…</BodySmall>
      ) : query.isError ? (
        <Callout title="Unable to load settings" variant="error">
          {query.error.message}
        </Callout>
      ) : (
        <CompanySettingsForm
          isPending={mutation.isPending}
          onCancel={() => {
            navigate('../..');
          }}
          onSubmit={(data) => {
            setSaveMessage(null);
            setSaveError(null);
            mutation.mutate(data);
          }}
          settings={query.data}
        />
      )}
    </section>
  );
}
