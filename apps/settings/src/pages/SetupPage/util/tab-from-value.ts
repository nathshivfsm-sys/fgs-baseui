import { SETTING_TABS } from '../constant';
import type { SettingsTabKey } from '../types';

const TAB_KEYS = new Set<string>(SETTING_TABS.map((tab) => tab.key));

export const DEFAULT_SETTINGS_TAB: SettingsTabKey = 'company';

export const tabFromValue = (value: string | null | undefined): SettingsTabKey => {
  if (value && TAB_KEYS.has(value)) {
    return value as SettingsTabKey;
  }
  return DEFAULT_SETTINGS_TAB;
};
