import { Tabs, TabsContent, TabsList, TabsTrigger } from '@cms/ui';
import { SETTING_TABS } from '../constant';
import type { SettingCategory, SettingsTabKey } from '../types';
import { filterSettings } from '../util';
import { SettingCategoryGrid } from './SettingCategoryGrid';
import { SettingsEmptyState } from './SettingsEmptyState';

export interface SetupTabsProps {
  activeTab: SettingsTabKey;
  allSettings: Record<SettingsTabKey, SettingCategory[]>;
  onCategorySelect?: (category: SettingCategory) => void;
  onTabChange: (tab: SettingsTabKey) => void;
  query: string;
}

export function SetupTabs({
  activeTab,
  allSettings,
  onCategorySelect,
  onTabChange,
  query,
}: SetupTabsProps) {
  return (
    <Tabs
      onValueChange={(value) => onTabChange(value as SettingsTabKey)}
      value={activeTab}
    >
      <TabsList aria-label="Setup categories" bordered>
        {SETTING_TABS.map((tab) => (
          <TabsTrigger key={tab.key} tone="action" value={tab.key}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {SETTING_TABS.map((tab) => {
        // Base UI unmounts every panel but the active one, so only the active
        // tab's categories are worth filtering on each render.
        if (tab.key !== activeTab) {
          return <TabsContent key={tab.key} value={tab.key} />;
        }
        const filteredCategories = filterSettings(
          allSettings[tab.key],
          query,
        );
        return (
          <TabsContent key={tab.key} value={tab.key}>
            {filteredCategories.length === 0 ? (
              <SettingsEmptyState query={query} />
            ) : (
              <SettingCategoryGrid
                categories={filteredCategories}
                onCategorySelect={onCategorySelect}
              />
            )}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
