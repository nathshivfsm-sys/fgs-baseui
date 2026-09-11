import { useMutation, useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import type { QueryClient } from '@tanstack/react-query';
import {
  companySettingsKeys,
  companySettingsQueryOptions,
  loadCompanySettings as defaultLoad,
  saveCompanySettings as defaultSave,
  type CompanyPatch,
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
import { useEffect, useRef, useState } from 'react';
import { CompanySettingsForm } from '../components/CompanySettingsForm';
import { GeneralInfoSkeleton } from '../components/general-info/GeneralInfoSkeleton';
import { describeCompanyError } from '../lib/describe-company-error';

/**
 * Route-relative, not URL-relative: `company/general-info` is a single route, so one
 * `..` reaches the Setup index. `../..` would climb out of `/settings/*` to the root.
 */
const SETUP_PATH = '..';

export interface CompanySettingsPageProps {
  /** From the login response; absent for sessions stored before it was captured. */
  companyId: string | undefined;
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
  const feedbackRef = useRef<HTMLDivElement>(null);

  // Save sits at the bottom of a long form; bring the result above it into view.
  useEffect(() => {
    if (saveMessage != null || saveError != null) {
      feedbackRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [saveMessage, saveError]);

  const query = useQuery(
    {
      ...companySettingsQueryOptions(companyId ?? '', loadCompanySettings),
      enabled: Boolean(companyId),
    },
    queryClient,
  );
  const mutation = useMutation(
    {
      mutationFn: (patch: CompanyPatch) =>
        saveCompanySettings(companyId ?? '', patch),
      meta: { feature: 'company-settings', operation: 'update' },
      onSuccess: async () => {
        setSaveError(null);
        setSaveMessage('Company details updated');
        await queryClient.invalidateQueries({
          queryKey: companySettingsKeys.detail(companyId ?? ''),
        });
      },
      onError: (error: unknown) => {
        setSaveMessage(null);
        setSaveError(describeCompanyError(error));
      },
    },
    queryClient,
  );

  function renderBody() {
    if (!companyId) {
      return (
        <Callout title="No company on this session" variant="error">
          Your session isn't linked to a company. Sign out and sign in again.
        </Callout>
      );
    }
    if (query.isPending) return <GeneralInfoSkeleton />;
    if (query.isError) {
      return (
        <Callout title="Unable to load company details" variant="error">
          {describeCompanyError(query.error)}
        </Callout>
      );
    }
    return (
      <CompanySettingsForm
        isPending={mutation.isPending}
        onCancel={() => {
          navigate(SETUP_PATH);
        }}
        onSubmit={(patch) => {
          setSaveMessage(null);
          setSaveError(null);
          mutation.mutate(patch);
        }}
        profile={query.data}
      />
    );
  }

  return (
    <section className="space-y-6" data-testid="company-settings">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link
              className="rounded-sm outline-none transition-colors hover:text-action focus-visible:ring-[3px] focus-visible:ring-ring/30"
              to={SETUP_PATH}
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
          Manage your company details, address, logo and non working days.
        </BodySmall>
      </header>

      <div className="scroll-mt-4 empty:hidden" ref={feedbackRef}>
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
      </div>

      {renderBody()}
    </section>
  );
}
