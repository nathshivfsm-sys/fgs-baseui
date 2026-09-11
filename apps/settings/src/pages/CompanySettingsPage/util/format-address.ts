import type { CompanyAddress } from '@cms/settings-data-access';

function countryName(code: string): string {
  if (!code) return '';
  try {
    return new Intl.DisplayNames(['en'], { type: 'region' }).of(code) ?? code;
  } catch {
    // Not a valid region code — show whatever the API sent.
    return code;
  }
}

/**
 * Display lines for an address card, matching the Figma layout:
 * street lines, then "City, State PostalCode", then the country name.
 */
export function formatAddress(address: CompanyAddress): string[] {
  const cityState = [address.city, address.state].filter(Boolean).join(', ');
  const locality = [cityState, address.postalCode].filter(Boolean).join(' ');
  return [...address.lines, locality, countryName(address.country)].filter(
    Boolean,
  );
}
