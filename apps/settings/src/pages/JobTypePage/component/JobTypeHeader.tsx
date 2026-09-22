import { BodySmall, Heading1 } from '@cms/ui';
import {
  SETUP_OPERATIONS_LABEL,
  SETUP_OPERATIONS_TAB,
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
    <Heading1 className="mt-2">{PAGE_TITLE}</Heading1>
    <BodySmall color="foreground-subtle">{PAGE_DESCRIPTION}</BodySmall>
  </header>
);
