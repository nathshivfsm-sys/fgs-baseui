import type { CompanyAddress } from '@cms/settings-data-access';
import { AddressCard } from './AddressCard';
import { FormSection } from './FormSection';

export interface AddressesSectionProps {
  billingAddress: CompanyAddress | null;
  physicalAddress: CompanyAddress | null;
}

export function AddressesSection({
  billingAddress,
  physicalAddress,
}: AddressesSectionProps) {
  return (
    <FormSection title="Addresses">
      <AddressCard address={physicalAddress} title="Physical Address" />
      <AddressCard address={billingAddress} title="Billing Address" />
    </FormSection>
  );
}
