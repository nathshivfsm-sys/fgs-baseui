import { useMutation, useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import type { QueryClient } from '@tanstack/react-query';
import {
  patchCompanyMutationOptions,
  companyDetailQueryOptions,
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
import { useEffect, useRef } from 'react';
import { CompanySettingsForm, GeneralInfoSkeleton } from './component';
import { describeCompanyError } from './util';

/**
 * Route-relative, not URL-relative: `company/general-info` is a single route, so one
 * `..` reaches the Setup index. `../..` would climb out of `/settings/*` to the root.
 */
const SETUP_PATH = '..';

export interface CompanySettingsPageProps {
  /** From the login response; absent for sessions stored before it was captured. */
  companyId: string | undefined;
  queryClient: QueryClient;
}

export function CompanySettingsPage({
  companyId,
  queryClient,
}: CompanySettingsPageProps) {
  return (
    <section
      className="flex min-h-0 flex-1 flex-col gap-6 overflow-hidden"
      data-testid="company-settings"
    >
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

      {companyId ? (
        <CompanySettingsEditor
          companyId={companyId}
          queryClient={queryClient}
        />
      ) : (
        <Callout title="No company on this session" variant="error">
          Your session isn't linked to a company. Sign out and sign in again.
        </Callout>
      )}
    </section>
  );
}

interface CompanySettingsEditorProps {
  companyId: string;
  queryClient: QueryClient;
}

/**
 * The data-bound half, mounted only once there is a `companyId` — so the query, the
 * mutation and the form never have to stand in a fallback for a missing one.
 *
 * Save feedback is read off the mutation rather than mirrored into local state:
 * `mutate` clears the previous result on its own, so there is one source of truth.
 */
function CompanySettingsEditor({
  companyId,
  queryClient,
}: CompanySettingsEditorProps) {
  const navigate = useNavigate();
  const feedbackRef = useRef<HTMLDivElement>(null);
  const query = useQuery(companyDetailQueryOptions(companyId), queryClient);
  const mutation = useMutation(
    patchCompanyMutationOptions(companyId, queryClient),
    queryClient,
  );

  // Save sits at the bottom of a long form; bring the result above it into view.
  useEffect(() => {
    if (mutation.isSuccess || mutation.isError) {
      feedbackRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [mutation.isError, mutation.isSuccess, mutation.submittedAt]);

  function handleCancel() {
    navigate(SETUP_PATH);
  }

  function renderBody() {
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
        onCancel={handleCancel}
        onSubmit={mutation.mutate}
        profile={query.data}
        queryClient={queryClient}
      />
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-hidden">
      <div className="scroll-mt-4 empty:hidden" ref={feedbackRef}>
        {mutation.isSuccess && (
          <Callout title="Saved" variant="success">
            Company details updated
          </Callout>
        )}
        {mutation.isError && (
          <Callout title="Could not save" variant="error">
            {describeCompanyError(mutation.error)}
          </Callout>
        )}
      </div>

      {renderBody()}
    </div>
  );
}
