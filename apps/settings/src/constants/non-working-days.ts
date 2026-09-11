import type { NonWorkingDay } from '../types';

/**
 * Static preview rows for the UI-only Non-Working Days panel, copied from the Figma
 * frame. Replace with a `data-access` query when the panel gets real behaviour.
 */
export const NON_WORKING_DAYS_PREVIEW: readonly NonWorkingDay[] = [
  { date: '01/01/2025', day: 'Wednesday', description: "New Year's Day" },
  { date: '05/26/2025', day: 'Monday', description: 'Memorial Day' },
  { date: '07/04/2025', day: 'Friday', description: 'Independence Day' },
  { date: '09/01/2025', day: 'Monday', description: 'Labor Day' },
  { date: '11/27/2025', day: 'Thursday', description: 'Thanksgiving Day' },
  { date: '12/25/2025', day: 'Thursday', description: 'Christmas Day' },
];
