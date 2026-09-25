import type { SettingCategory, SettingsTabKey } from '../types';
import { filterSettings } from './filter-settings';

/** Match counts per Setup tab; empty when the search box is blank. */
export const countTabMatches = (
  allSettings: Record<SettingsTabKey, readonly SettingCategory[]>,
  query: string,
): Partial<Record<SettingsTabKey, number>> => {
  if (!query.trim()) return {};
  return Object.fromEntries(
    Object.entries(allSettings).map(([key, categories]) => [
      key,
      filterSettings(categories, query).length,
    ]),
  ) as Partial<Record<SettingsTabKey, number>>;
};
