import { BodySmall, Button } from '@cms/ui';
import type { SettingsEmptyStateProps, SettingsTabKey } from '../types';

export const SettingsEmptyState = ({
  activeTabLabel,
  otherTabMatches,
  query,
  onSelectTab,
}: SettingsEmptyStateProps) => {
  const handleSelectTab = (tabKey: SettingsTabKey) => {
    onSelectTab?.(tabKey);
  };

  if (otherTabMatches.length === 0) {
    return (
      <BodySmall color="foreground-subtle" role="status">
        No settings match &quot;{query}&quot;
      </BodySmall>
    );
  }

  return (
    <div className="flex flex-col gap-3" role="status">
      <BodySmall color="foreground-subtle">
        No settings match &quot;{query}&quot; in {activeTabLabel}. Try another
        tab:
      </BodySmall>
      <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
        {otherTabMatches.map((match) => (
          <li key={match.tabKey}>
            <Button
              onClick={() => handleSelectTab(match.tabKey)}
              size="sm"
              type="button"
              variant="outline"
            >
              {match.label} ({match.count})
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};
