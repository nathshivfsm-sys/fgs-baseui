import type { CustomerAddressForm } from '@cms/customer-data-access';

export const formatCustomerAddressLines = (
  address: CustomerAddressForm | null,
): string[] => {
  if (!address) return [];
  const line1 = address.addressLine1.trim();
  const line2 = address.addressLine2.trim();
  const cityState = [address.city.trim(), address.state.trim()]
    .filter(Boolean)
    .join(', ');
  const cityStateZip = [cityState, address.postalCode.trim()]
    .filter(Boolean)
    .join(' ');
  return [line1, line2, cityStateZip, address.country.trim()].filter(Boolean);
};
