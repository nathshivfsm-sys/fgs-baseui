import { Link } from 'react-router-dom';
import {
  BodySmall,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  ChevronLeftIcon,
  Heading1,
  PlusIcon,
} from '@cms/ui';
import { PAGE_DESCRIPTION, PAGE_TITLE, SETUP_PATH } from '../constant';
import type { TaxCatalog } from '../types';

export interface TaxSetupHeaderProps {
  catalog: TaxCatalog;
  onAdd: () => void;
}

export function TaxSetupHeader({ catalog, onAdd }: TaxSetupHeaderProps) {
  const addLabel =
    catalog === 'tax-code' ? 'Add Tax Code' : 'Assign Authority';

  return (
    <header className="flex flex-col gap-4 border-b border-border px-0 pb-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link
                className="inline-flex items-center gap-1.5 rounded-sm text-caption font-medium text-action outline-none transition-colors hover:text-action-hover focus-visible:ring-[3px] focus-visible:ring-ring/30"
                to={SETUP_PATH}
              >
                <ChevronLeftIcon className="size-3.5" />
                Setup &gt; Company &gt; Tax
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="sr-only" />
            <BreadcrumbItem className="sr-only">
              <BreadcrumbPage>{PAGE_TITLE}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Heading1 className="mt-2">{PAGE_TITLE}</Heading1>
        <BodySmall color="foreground-subtle">{PAGE_DESCRIPTION}</BodySmall>
      </div>
      <Button onClick={onAdd} type="button">
        <PlusIcon className="size-3.5" />
        {addLabel}
      </Button>
    </header>
  );
}
