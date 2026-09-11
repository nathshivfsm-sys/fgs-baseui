import type { SelectOption } from '@cms/ui';

/** Values match the API's `companySize` format (`"11-50"`). */
export const COMPANY_SIZE_OPTIONS: readonly SelectOption[] = [
  { value: '1-10', label: '1 – 10 Employees' },
  { value: '11-50', label: '11 – 50 Employees' },
  { value: '51-200', label: '51 – 200 Employees' },
  { value: '201-500', label: '201 – 500 Employees' },
  { value: '501-1000', label: '501 – 1000 Employees' },
  { value: '1000+', label: '1000+ Employees' },
];

/** Values are IANA zone ids, as the API stores them. */
export const TIME_ZONE_OPTIONS: readonly SelectOption[] = [
  { value: 'America/New_York', label: '(ET) Eastern Time (America/New_York)' },
  { value: 'America/Chicago', label: '(CT) Central Time (America/Chicago)' },
  { value: 'America/Denver', label: '(MT) Mountain Time (America/Denver)' },
  { value: 'America/Phoenix', label: '(MST) Arizona Time (America/Phoenix)' },
  {
    value: 'America/Los_Angeles',
    label: '(PT) Pacific Time (America/Los_Angeles)',
  },
  {
    value: 'America/Anchorage',
    label: '(AKT) Alaska Time (America/Anchorage)',
  },
  { value: 'Pacific/Honolulu', label: '(HT) Hawaii Time (Pacific/Honolulu)' },
];
