import { Link } from 'react-router-dom';
import {
  BodySmall,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Heading1,
} from '@cms/ui';
import {
  SETUP_PATH,
  SETUP_TAB_STATE_KEY,
  SETUP_USERS_PAYROLL_LABEL,
  SETUP_USERS_PAYROLL_TAB,
} from '../../../shared';
import {
  EMPLOYEES_LIST_LABEL,
  PAGE_DESCRIPTION,
  PAGE_TITLE,
} from '../constant';

const CRUMB_LINK_CLASS =
  'rounded-sm outline-none transition-colors hover:text-action focus-visible:ring-[3px] focus-visible:ring-ring/30';

export const AddEmployeeHeader = () => (
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
          <Link className={CRUMB_LINK_CLASS} to="..">
            {EMPLOYEES_LIST_LABEL}
          </Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{PAGE_TITLE}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
    <Heading1 className="mt-2">{PAGE_TITLE}</Heading1>
    <BodySmall color="foreground-subtle">{PAGE_DESCRIPTION}</BodySmall>
  </header>
);
