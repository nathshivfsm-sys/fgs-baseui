import { useMemo } from 'react';
import { Badge, Tabs, TabsContent, TabsList, TabsTrigger } from '@cms/ui';
import { SETTING_TABS } from '../constant';
import type { SettingCategory, SettingsTabKey } from '../types';
import { countTabMatches, filterSettings } from '../util';
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
  const handleValueChange = (value: string) => {
    onTabChange(value as SettingsTabKey);
  };

  const matchCounts = useMemo(
    () => countTabMatches(allSettings, query),
    [allSettings, query],
  );
  const hasSearch = Boolean(query.trim());
  const activeTabLabel =
    SETTING_TABS.find((tab) => tab.key === activeTab)?.label ?? activeTab;

  return (
    <Tabs onValueChange={handleValueChange} value={activeTab}>
      <TabsList aria-label="Setup categories" bordered>
        {SETTING_TABS.map((tab) => {
          const matchCount = matchCounts[tab.key] ?? 0;
          const matchSuffix =
            hasSearch && matchCount > 0
              ? `, ${matchCount} ${matchCount === 1 ? 'match' : 'matches'}`
              : undefined;
          return (
            <TabsTrigger
              aria-label={
                matchSuffix ? `${tab.label}${matchSuffix}` : undefined
              }
              key={tab.key}
              tone="action"
              value={tab.key}
            >
              <span className="inline-flex items-center gap-1.5">
                <span>{tab.label}</span>
                {hasSearch && matchCount > 0 ? (
                  <Badge
                    aria-hidden
                    size="sm"
                    tone="action"
                    variant="soft"
                  >
                    {matchCount}
                  </Badge>
                ) : null}
              </span>
            </TabsTrigger>
          );
        })}
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
        const otherTabMatches = SETTING_TABS.filter(
          (candidate) =>
            candidate.key !== activeTab && (matchCounts[candidate.key] ?? 0) > 0,
        ).map((candidate) => ({
          tabKey: candidate.key,
          label: candidate.label,
          count: matchCounts[candidate.key] ?? 0,
        }));

        return (
          <TabsContent key={tab.key} value={tab.key}>
            {filteredCategories.length === 0 ? (
              <SettingsEmptyState
                activeTabLabel={activeTabLabel}
                onSelectTab={onTabChange}
                otherTabMatches={otherTabMatches}
                query={query}
              />
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
