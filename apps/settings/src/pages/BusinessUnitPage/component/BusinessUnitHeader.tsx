import { BodySmall, Heading1 } from '@cms/ui';
import {
  SETUP_COMPANY_LABEL,
  SETUP_COMPANY_TAB,
  SetupBreadcrumb,
} from '../../../shared';
import { PAGE_DESCRIPTION, PAGE_TITLE } from '../constant';
import type { BusinessUnitHeaderProps } from '../types';

export const BusinessUnitHeader = ({ catalog }: BusinessUnitHeaderProps) => (
  <header className="flex flex-col gap-1 border-b border-border px-0 pb-4">
    <SetupBreadcrumb
      moduleKey={SETUP_COMPANY_TAB}
      moduleLabel={SETUP_COMPANY_LABEL}
      pageLabel={PAGE_TITLE}
    />
    <Heading1 className="mt-2">{PAGE_TITLE}</Heading1>
    <BodySmall color="foreground-subtle">{PAGE_DESCRIPTION}</BodySmall>
  </header>
);
