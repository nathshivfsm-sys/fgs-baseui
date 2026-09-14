import { FormSection } from '../FormSection';
import { AddressCard } from './AddressCard';
import { AddressFormDialog } from './AddressFormDialog';
import { useAddressesSection } from './use-addresses-section';

export const AddressesSection = () => {
  const {
    billingAddress,
    editingKind,
    handleOpenChange,
    handleSubmit,
    openBilling,
    openPhysical,
    physicalAddress,
  } = useAddressesSection();

  const editingAddress =
    editingKind === 'billing' ? billingAddress : physicalAddress;

  return (
    <>
      <FormSection title="Addresses">
        <AddressCard
          address={physicalAddress}
          onEdit={openPhysical}
          title="Physical Address"
        />
        <AddressCard
          address={billingAddress}
          onEdit={openBilling}
          title="Billing Address"
        />
      </FormSection>
      <AddressFormDialog
        address={editingAddress}
        kind={editingKind ?? 'physical'}
        onOpenChange={handleOpenChange}
        onSubmit={handleSubmit}
        open={editingKind != null}
        physicalAddress={physicalAddress}
      />
    </>
  );
};
