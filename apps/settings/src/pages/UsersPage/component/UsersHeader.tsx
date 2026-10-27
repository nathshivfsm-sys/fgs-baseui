import { BodySmall } from '@cms/ui';
import {
  SETUP_USERS_PAYROLL_LABEL,
  SETUP_USERS_PAYROLL_TAB,
  SettingsPageTitle,
  SetupBreadcrumb,
} from '../../../shared';
import { PAGE_DESCRIPTION, PAGE_TITLE } from '../constant';

export const UsersHeader = () => (
  <header className="border-b border-border px-0 pb-4">
    <SetupBreadcrumb
      moduleKey={SETUP_USERS_PAYROLL_TAB}
      moduleLabel={SETUP_USERS_PAYROLL_LABEL}
      pageLabel={PAGE_TITLE}
    />
    <SettingsPageTitle moduleKey={SETUP_USERS_PAYROLL_TAB}>
      {PAGE_TITLE}
    </SettingsPageTitle>
    <BodySmall color="foreground-subtle">{PAGE_DESCRIPTION}</BodySmall>
  </header>
);
