import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SetupHeader, SetupTabs } from './component';
import { allSettings } from './constant';
import type { SettingCategory, SettingsTabKey } from './types';

export function SetupPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<SettingsTabKey>('company');
  const [query, setQuery] = useState('');

  const handleCategorySelect = (category: SettingCategory) => {
    if (category.href) {
      navigate(category.href);
    }
  };

  return (
    <section className="space-y-6" data-testid="settings">
      <SetupHeader onQueryChange={setQuery} query={query} />
      <SetupTabs
        activeTab={activeTab}
        allSettings={allSettings}
        onCategorySelect={handleCategorySelect}
        onTabChange={setActiveTab}
        query={query}
      />
    </section>
  );
}
