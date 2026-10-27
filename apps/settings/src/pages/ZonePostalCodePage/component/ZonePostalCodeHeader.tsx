import { BodySmall } from '@cms/ui';
import {
  SETUP_COMPANY_LABEL,
  SETUP_COMPANY_TAB,
  SettingsPageTitle,
  SetupBreadcrumb,
} from '../../../shared';
import { PAGE_DESCRIPTION, PAGE_TITLE } from '../constant';

export const ZonePostalCodeHeader = () => (
  <header className="border-b border-border px-0 pb-4">
    <SetupBreadcrumb
      moduleKey={SETUP_COMPANY_TAB}
      moduleLabel={SETUP_COMPANY_LABEL}
      pageLabel={PAGE_TITLE}
    />
    <SettingsPageTitle moduleKey={SETUP_COMPANY_TAB}>
      {PAGE_TITLE}
    </SettingsPageTitle>
    <BodySmall color="foreground-subtle">{PAGE_DESCRIPTION}</BodySmall>
  </header>
);
