import { Avatar, AvatarFallback, Button, EditIcon } from '@cms/ui';
import { EDIT_CUSTOMER_LABEL } from '../constant';
import type { CustomerDetailSummaryHeaderProps } from '../types';
import { formatCustomerSinceDate, getCustomerInitials } from '../util';
import { CustomerDetailMoreOptionsPopover } from './CustomerDetailMoreOptionsPopover';

export const CustomerDetailSummaryHeader = ({
  customer,
  loading = false,
  onCreateNewLocation,
  onDeactivateCustomer,
  onEditCustomer,
}: CustomerDetailSummaryHeaderProps) => {
  const displayName =
    customer?.displayName?.trim() || customer?.name?.trim() || 'Customer';
  const customerNumber = customer?.customerNumber?.trim() || '—';
  const sinceDate = formatCustomerSinceDate(customer?.createdOn);
  const initials = getCustomerInitials(displayName);

  const handleEditCustomer = () => {
    onEditCustomer();
  };

  return (
    <header className="flex min-h-[3.125rem] items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar
          className="size-[3.125rem] shadow-[4px_4px_64px_16px_rgba(0,0,0,0.02)] after:hidden"
          size="lg"
        >
          <AvatarFallback className="bg-[#f0f1f3] text-xl font-semibold text-[#9fa5b2]">
            {loading ? '…' : initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          {loading ? (
            <span className="block h-6 w-40 animate-pulse rounded-sm bg-secondary motion-reduce:animate-none" />
          ) : (
            <p className="truncate text-xl font-bold text-black">
              {displayName}
            </p>
          )}
          {!loading ? (
            <p className="mt-1.5 text-[10px] font-medium leading-normal">
              <span className="text-[#3538bf]">{customerNumber}</span>
              {sinceDate ? (
                <span className="text-[#222]">{`  |  Customer Since ${sinceDate}`}</span>
              ) : null}
            </p>
          ) : null}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3 sm:gap-8">
        <CustomerDetailMoreOptionsPopover
          onCreateNewLocation={onCreateNewLocation}
          onDeactivateCustomer={onDeactivateCustomer}
        />
        <Button
          className="h-9 gap-2 px-4"
          onClick={handleEditCustomer}
          type="button"
        >
          <EditIcon className="size-3" />
          {EDIT_CUSTOMER_LABEL}
        </Button>
      </div>
    </header>
  );
};
