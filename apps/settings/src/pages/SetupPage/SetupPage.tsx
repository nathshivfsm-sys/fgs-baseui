import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SETUP_TAB_STATE_KEY, type SetupLocationState } from '../../shared';
import { SetupHeader, SetupTabs } from './component';
import { allSettings } from './constant';
import type { SettingCategory, SettingsTabKey } from './types';
import { tabFromValue } from './util';

const readSetupTab = (state: SetupLocationState | null | undefined) =>
  tabFromValue(state?.[SETUP_TAB_STATE_KEY]);

export function SetupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<SettingsTabKey>(() =>
    readSetupTab(location.state as SetupLocationState | null),
  );

  const handleCategorySelect = (category: SettingCategory) => {
    if (category.href) {
      navigate(category.href);
    }
  };

  const handleTabChange = (tab: SettingsTabKey) => {
    setActiveTab(tab);
  };

  return (
    <section className="space-y-6" data-testid="settings">
      <SetupHeader onQueryChange={setQuery} query={query} />
      <SetupTabs
        activeTab={activeTab}
        allSettings={allSettings}
        onCategorySelect={handleCategorySelect}
        onTabChange={handleTabChange}
        query={query}
      />
    </section>
  );
}
