import { Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@cms/ui';
import { SETUP_PATH, SETUP_TAB_STATE_KEY } from '../constant';
import type { SetupBreadcrumbProps } from '../types';

const CRUMB_LINK_CLASS =
  'rounded-sm outline-none transition-colors hover:text-action focus-visible:ring-[3px] focus-visible:ring-ring/30';

export const SetupBreadcrumb = ({
  moduleKey,
  moduleLabel,
  pageLabel,
}: SetupBreadcrumbProps) => (
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
          state={{ [SETUP_TAB_STATE_KEY]: moduleKey }}
          to={SETUP_PATH}
        >
          {moduleLabel}
        </Link>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>{pageLabel}</BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
);
