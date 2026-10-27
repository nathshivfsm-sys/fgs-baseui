import { BodySmall } from '@cms/ui';
import {
  SETUP_OPERATIONS_LABEL,
  SETUP_OPERATIONS_TAB,
  SettingsPageTitle,
  SetupBreadcrumb,
} from '../../../shared';
import { PAGE_DESCRIPTION, PAGE_TITLE } from '../constant';

export const JobTypeHeader = () => (
  <header className="border-b border-border px-0 pb-4">
    <SetupBreadcrumb
      moduleKey={SETUP_OPERATIONS_TAB}
      moduleLabel={SETUP_OPERATIONS_LABEL}
      pageLabel={PAGE_TITLE}
    />
    <SettingsPageTitle moduleKey={SETUP_OPERATIONS_TAB}>
      {PAGE_TITLE}
    </SettingsPageTitle>
    <BodySmall color="foreground-subtle">{PAGE_DESCRIPTION}</BodySmall>
  </header>
);
