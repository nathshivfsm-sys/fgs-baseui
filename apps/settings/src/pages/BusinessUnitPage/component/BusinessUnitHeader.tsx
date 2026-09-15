import { Link } from 'react-router-dom';
import {
  BodySmall,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  ChevronLeftIcon,
  Heading1,
} from '@cms/ui';
import {
  BREADCRUMB_LABEL,
  PAGE_DESCRIPTION,
  PAGE_TITLE,
  SETUP_PATH,
} from '../constant';
import type { BusinessUnitHeaderProps } from '../types';

export const BusinessUnitHeader = ({ catalog }: BusinessUnitHeaderProps) => (
  <header className="flex flex-col gap-1 border-b border-border px-0 pb-4">
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <Link
            className="inline-flex items-center gap-1.5 rounded-sm text-caption font-medium text-action outline-none transition-colors hover:text-action-hover focus-visible:ring-[3px] focus-visible:ring-ring/30"
            to={SETUP_PATH}
          >
            <ChevronLeftIcon className="size-3.5" />
            {BREADCRUMB_LABEL}
          </Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="sr-only" />
        <BreadcrumbItem className="sr-only">
          <BreadcrumbPage>
            {catalog === 'break-2' ? 'Break 2' : PAGE_TITLE}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
    <Heading1 className="mt-2">{PAGE_TITLE}</Heading1>
    <BodySmall color="foreground-subtle">{PAGE_DESCRIPTION}</BodySmall>
  </header>
);
