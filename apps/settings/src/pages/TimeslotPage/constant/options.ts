import type { SelectOption } from '@cms/ui';

export const TIMESLOT_PAGE_SIZE = 10;

export const DURATION_OPTIONS: readonly SelectOption[] = [
  { value: '00:10:00', label: '10 min' },
  { value: '00:15:00', label: '15 min' },
  { value: '00:20:00', label: '20 min' },
  { value: '00:30:00', label: '30 min' },
  { value: '00:45:00', label: '45 min' },
  { value: '01:00:00', label: '60 min' },
];
