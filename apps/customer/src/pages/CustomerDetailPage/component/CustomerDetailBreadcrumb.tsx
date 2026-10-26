import { Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@cms/ui';
import { CUSTOMERS_BREADCRUMB_LABEL, CUSTOMERS_LIST_PATH } from '../constant';
import type { CustomerDetailBreadcrumbProps } from '../types';

const CRUMB_LINK_CLASS =
  'rounded-sm outline-none transition-colors hover:text-action focus-visible:ring-[3px] focus-visible:ring-ring/30';

export const CustomerDetailBreadcrumb = ({
  customerName,
  loading = false,
}: CustomerDetailBreadcrumbProps) => {
  const pageLabel =
    customerName?.trim() ||
    (loading ? 'Loading customer…' : 'Customer details');

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <Link className={CRUMB_LINK_CLASS} to={CUSTOMERS_LIST_PATH}>
            {CUSTOMERS_BREADCRUMB_LABEL}
          </Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          {loading && !customerName?.trim() ? (
            <>
              <span
                aria-hidden
                className="inline-block h-4 w-36 animate-pulse rounded-sm bg-secondary motion-reduce:animate-none"
              />
              <span className="sr-only">{pageLabel}</span>
            </>
          ) : (
            <BreadcrumbPage className="max-w-[min(100%,20rem)] truncate">
              {pageLabel}
            </BreadcrumbPage>
          )}
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
