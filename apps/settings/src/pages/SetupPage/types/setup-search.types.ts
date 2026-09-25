import type { SettingsTabKey } from './setting-tab.types';

export interface SetupTabMatchHint {
  count: number;
  label: string;
  tabKey: SettingsTabKey;
}

export interface SettingsEmptyStateProps {
  activeTabLabel: string;
  otherTabMatches: readonly SetupTabMatchHint[];
  query: string;
  onSelectTab?: (tabKey: SettingsTabKey) => void;
}
