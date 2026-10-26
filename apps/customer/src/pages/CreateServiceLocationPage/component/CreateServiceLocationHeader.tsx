import { Link } from 'react-router-dom';
import { BodySmall, Button, Heading1 } from '@cms/ui';
import { BACK_LABEL } from '@cms/customer-ui';
import {
  CUSTOMERS_LIST_PATH,
  customerDetailPath,
  PAGE_SUBTITLE,
} from '../constant';
import type { CreateServiceLocationHeaderProps } from '../types';

export const CreateServiceLocationHeader = ({
  customerId,
  customerName,
  loading = false,
  onBack,
}: CreateServiceLocationHeaderProps) => {
  const customerLabel = loading ? '…' : customerName?.trim() || 'Customer';

  return (
    <header className="flex flex-col gap-3">
      <nav aria-label="Breadcrumb">
        <BodySmall color="foreground-subtle">
          <Link
            className="text-action hover:underline"
            to={CUSTOMERS_LIST_PATH}
          >
            Customers
          </Link>
          <span aria-hidden> / </span>
          {loading ? (
            <span>{customerLabel}</span>
          ) : (
            <Link
              className="text-action hover:underline"
              to={customerDetailPath(customerId)}
            >
              {customerLabel}
            </Link>
          )}
          <span aria-hidden> / </span>
          <span>Create Service Location</span>
        </BodySmall>
      </nav>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <Heading1>Create Service Location</Heading1>
          <BodySmall color="foreground-subtle">{PAGE_SUBTITLE}</BodySmall>
        </div>
        <Button onClick={onBack} type="button" variant="outline">
          {BACK_LABEL}
        </Button>
      </div>
    </header>
  );
};
