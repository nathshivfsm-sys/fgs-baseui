import type { GlBreakAddressDetailDto } from '@cms/settings-contract';

export interface GlBreakAddressLines {
  primary: string;
  secondary?: string;
}

export const formatGlBreakAddress = (
  address: GlBreakAddressDetailDto | null | undefined,
): GlBreakAddressLines | null => {
  if (!address) return null;
  const street = [address.addressLine1, address.addressLine2]
    .filter(Boolean)
    .join(', ');
  const locality = [
    address.city,
    [address.state, address.postalCode].filter(Boolean).join(' '),
  ]
    .filter(Boolean)
    .join(', ');
  if (street && locality) {
    return { primary: street, secondary: locality };
  }
  if (street) return { primary: street };
  if (locality) return { primary: locality };
  if (address.formattedAddress) {
    return { primary: address.formattedAddress };
  }
  return null;
};
