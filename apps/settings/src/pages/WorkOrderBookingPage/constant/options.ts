import type { SelectOption } from '@cms/ui';

export const AVAILABILITY_UNIT_OPTIONS: readonly SelectOption[] = [
  { value: 'Hours', label: 'Hours' },
  { value: 'Days', label: 'Days' },
];

export const yearModeOptions = (): readonly SelectOption[] => {
  const year = new Date().getFullYear();
  return [
    { value: 'CurrentYear', label: String(year) },
    { value: 'Blank', label: 'Blank' },
  ];
};

export const YEAR_MODE_OPTIONS = yearModeOptions();
