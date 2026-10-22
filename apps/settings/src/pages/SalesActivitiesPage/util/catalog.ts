import type { SalesActivitiesCatalog } from '../types';

export const catalogFromSearch = (
  value: string | null,
): SalesActivitiesCatalog => (value === 'outcome' ? 'outcome' : 'activity');

export const countByActive = (
  items: readonly { isActive: boolean }[],
): { active: number; inactive: number } => {
  let active = 0;
  for (const item of items) {
    if (item.isActive) active += 1;
  }
  return { active, inactive: items.length - active };
};
