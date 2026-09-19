import { BodySmall, Callout, Heading1 } from '@cms/ui';
import {
  SETUP_COMPANY_LABEL,
  SETUP_COMPANY_TAB,
  SetupBreadcrumb,
} from '../../shared';
import { CompanySettingsEditor } from './component';
import type { CompanySettingsPageProps } from './types';

export const CompanySettingsPage = ({
  companyId,
  queryClient,
}: CompanySettingsPageProps) => (
  <section
    className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden"
    data-testid="company-settings"
  >
    <SetupBreadcrumb
      moduleKey={SETUP_COMPANY_TAB}
      moduleLabel={SETUP_COMPANY_LABEL}
      pageLabel="General Info"
    />

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
