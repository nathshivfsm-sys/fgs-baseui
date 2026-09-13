import { Link } from 'react-router-dom';
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
import { CompanySettingsEditor } from './component';
import type { CompanySettingsPageProps } from './types';

/**
 * Route-relative, not URL-relative: `company/general-info` is a single route, so one
 * `..` reaches the Setup index. `../..` would climb out of `/settings/*` to the root.
 */
const SETUP_PATH = '..';

export const CompanySettingsPage = ({
  companyId,
  queryClient,
}: CompanySettingsPageProps) => (
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
      <CompanySettingsEditor companyId={companyId} queryClient={queryClient} />
    ) : (
      <Callout title="No company on this session" variant="error">
        Your session isn't linked to a company. Sign out and sign in again.
      </Callout>
    )}
  </section>
);
