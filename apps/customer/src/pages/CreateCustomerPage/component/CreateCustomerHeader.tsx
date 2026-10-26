import { Link } from 'react-router-dom';
import { BodySmall, Button, Heading1 } from '@cms/ui';
import { BACK_LABEL } from '@cms/customer-ui';
import { CUSTOMERS_LIST_PATH } from '../constant';
import type { CreateCustomerHeaderProps } from '../types';

const titleForOption = (
  creationOption: CreateCustomerHeaderProps['creationOption'],
): string =>
  creationOption === 'billToAndServiceLocation'
    ? 'Create Service Location & AR Customer'
    : 'Create AR Customer';

export const CreateCustomerHeader = ({
  creationOption,
  onBack,
}: CreateCustomerHeaderProps) => (
  <header className="flex flex-col gap-3">
    <nav aria-label="Breadcrumb">
      <BodySmall color="foreground-subtle">
        <Link className="text-action hover:underline" to={CUSTOMERS_LIST_PATH}>
          Customers
        </Link>
        <span aria-hidden> / </span>
        <span>New customer</span>
      </BodySmall>
    </nav>
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="flex flex-col gap-1">
        <Heading1>{titleForOption(creationOption)}</Heading1>
        <BodySmall color="foreground-subtle">
          Choose what to create, then complete the required customer details.
        </BodySmall>
      </div>
      <Button onClick={onBack} type="button" variant="outline">
        {BACK_LABEL}
      </Button>
    </div>
  </header>
);
