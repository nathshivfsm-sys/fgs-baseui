import { useState } from 'react';
import type { CustomerAddressForm } from '@cms/customer-data-access';
import {
  BodySmall,
  Button,
  EditIcon,
  LocationPinIcon,
  SectionSubheading,
  TrashIcon,
} from '@cms/ui';
import type { AddressSectionProps } from '../types';
import { formatCustomerAddressLines } from '../util';
import { AddressFormDialog } from './AddressFormDialog';

export const CustomerAddressSection = ({
  address,
  disabled,
  onAddressChange,
  queryClient,
  title,
}: AddressSectionProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const lines = formatCustomerAddressLines(address);
  const hasAddress = lines.length > 0;

  const handleAddAddress = () => {
    setDialogOpen(true);
  };

  const handleEditAddress = () => {
    setDialogOpen(true);
  };

  const handleRemoveAddress = () => {
    onAddressChange(null);
  };

  const handleAddressSubmit = (next: CustomerAddressForm) => {
    onAddressChange(next);
    setDialogOpen(false);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
  };

  return (
    <div className="flex flex-col gap-3">
      <SectionSubheading>{title}</SectionSubheading>
      {hasAddress ? (
        <div className="rounded-lg border border-border-subtle p-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <LocationPinIcon aria-hidden className="size-4 text-icon-muted" />
              <BodySmall className="font-medium">{title}</BodySmall>
            </div>
            <div className="flex items-center gap-1">
              <Button
                aria-label={`Edit ${title}`}
                disabled={disabled}
                onClick={handleEditAddress}
                size="sm"
                type="button"
                variant="ghost"
              >
                <EditIcon aria-hidden className="size-4" />
              </Button>
              <Button
                aria-label={`Remove ${title}`}
                disabled={disabled}
                onClick={handleRemoveAddress}
                size="sm"
                type="button"
                variant="ghost"
              >
                <TrashIcon aria-hidden className="size-4" />
              </Button>
            </div>
          </div>
          <address className="not-italic">
            {lines.map((line) => (
              <BodySmall color="foreground-subtle" key={line}>
                {line}
              </BodySmall>
            ))}
          </address>
        </div>
      ) : (
        <Button
          disabled={disabled}
          onClick={handleAddAddress}
          type="button"
          variant="outline"
        >
          + Address
        </Button>
      )}
      <AddressFormDialog
        address={address}
        onOpenChange={handleDialogOpenChange}
        onSubmit={handleAddressSubmit}
        open={dialogOpen}
        queryClient={queryClient}
        title={title}
      />
    </div>
  );
};
