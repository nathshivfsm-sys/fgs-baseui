import { useState } from 'react';
import { SetupHeader } from '../components/SetupHeader';
import { SetupTabs } from '../components/SetupTabs';
import { allSettings } from '../constants/settings';
import type { SettingsTabKey } from '../types';

export function SetupPage() {
  const [activeTab, setActiveTab] = useState<SettingsTabKey>('company');
  const [query, setQuery] = useState('');

  return (
    <section className="space-y-6" data-testid="settings">
      <SetupHeader onQueryChange={setQuery} query={query} />
      <SetupTabs
        activeTab={activeTab}
        allSettings={allSettings}
        onTabChange={setActiveTab}
        query={query}
      />
    </section>
  );
}
