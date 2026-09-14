import type { SelectOption } from '@cms/ui';

export const COUNTRY_OPTIONS: readonly SelectOption[] = [
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'MX', label: 'Mexico' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'AU', label: 'Australia' },
  { value: 'IN', label: 'India' },
];

export const EDIT_PHYSICAL_TITLE = 'Edit Physical Address';
export const EDIT_BILLING_TITLE = 'Edit Billing Address';
export const EDIT_ADDRESS_DESCRIPTION =
  'Update this company address.';
export const SAME_AS_PHYSICAL_LABEL = 'Same as physical address';
export const SAVE_ADDRESS_LABEL = 'Save';
