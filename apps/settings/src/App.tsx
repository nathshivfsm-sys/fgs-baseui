import { useMemo, useState } from 'react';
import {
  BodySmall,
  Heading1,
  SearchIcon,
  SettingCard,
  SettingCardGrid,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  TextInput,
} from '@cms/ui';
import { allSettings } from './constants/settings';
import {
  resolveSettingIcon,
  resolveSettingTone,
} from './constants/setting-icons';
import { SETTING_TABS } from './constants/setting-tabs';
import type { SettingsTabKey } from './constants/types';
import { RemoteErrorBoundary } from './error-boundary';
import './styles.css';

export function App() {
  const [activeTab, setActiveTab] = useState<SettingsTabKey>('company');
  const [query, setQuery] = useState('');

  const categories = allSettings[activeTab];
  const filteredCategories = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return categories;
    return categories.filter(
      (category) =>
        category.title.toLowerCase().includes(normalized) ||
        category.description.toLowerCase().includes(normalized),
    );
  }, [categories, query]);

  return (
    <RemoteErrorBoundary>
      <section className="space-y-6" data-testid="settings">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="pb-3">
            <Heading1>Setup</Heading1>
            <BodySmall color="foreground-subtle">
              Configure your FSM environment
            </BodySmall>
          </div>
          <TextInput
            aria-label="Search settings"
            className="sm:w-[200px]"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search settings"
            startAdornment={<SearchIcon />}
            value={query}
          />
        </div>

        <Tabs
          onValueChange={(value) => setActiveTab(value as SettingsTabKey)}
          value={activeTab}
        >
          <TabsList aria-label="Setup categories" bordered>
            {SETTING_TABS.map((tab) => (
              <TabsTrigger key={tab.key} tone="action" value={tab.key} className='cursor-pointer'>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab}>
            {filteredCategories.length === 0 ? (
              <BodySmall color="foreground-subtle" role="status">
                No settings match "{query}"
              </BodySmall>
            ) : (
              <SettingCardGrid>
                {filteredCategories.map((category, index) => {
                  const Icon = resolveSettingIcon(category.icon);
                  return (
                    <SettingCard
                      description={category.description}
                      footerText={`${category.totalSettings.count.toLocaleString()} ${category.totalSettings.label}`}
                      icon={<Icon />}
                      key={category.title}
                      title={category.title}
                      tone={resolveSettingTone(category.icon, index)}
                    />
                  );
                })}
              </SettingCardGrid>
            )}
          </TabsContent>
        </Tabs>
      </section>
    </RemoteErrorBoundary>
  );
}

export default App;
