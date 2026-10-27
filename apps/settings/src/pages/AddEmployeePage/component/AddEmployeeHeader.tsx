import { Link } from 'react-router-dom';
import {
  BodySmall,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@cms/ui';
import {
  SETUP_PATH,
  SETUP_TAB_STATE_KEY,
  SETUP_USERS_PAYROLL_LABEL,
  SETUP_USERS_PAYROLL_TAB,
  SettingsPageTitle,
} from '../../../shared';
import { EMPLOYEES_LIST_LABEL } from '../constant';
import type { AddEmployeeHeaderProps } from '../types';

const CRUMB_LINK_CLASS =
  'rounded-sm outline-none transition-colors hover:text-action focus-visible:ring-[3px] focus-visible:ring-ring/30';

export const AddEmployeeHeader = ({
  description,
  title,
}: AddEmployeeHeaderProps) => (
  <header className="border-b border-border px-0 pb-4">
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <Link className={CRUMB_LINK_CLASS} to={SETUP_PATH}>
            Setup
          </Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <Link
            className={CRUMB_LINK_CLASS}
            state={{ [SETUP_TAB_STATE_KEY]: SETUP_USERS_PAYROLL_TAB }}
            to={SETUP_PATH}
          >
            {SETUP_USERS_PAYROLL_LABEL}
          </Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <Link className={CRUMB_LINK_CLASS} relative="path" to="..">
            {EMPLOYEES_LIST_LABEL}
          </Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{title}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
    <SettingsPageTitle to=".." urlRelative>
      {title}
    </SettingsPageTitle>
    <BodySmall color="foreground-subtle">{description}</BodySmall>
  </header>
);
