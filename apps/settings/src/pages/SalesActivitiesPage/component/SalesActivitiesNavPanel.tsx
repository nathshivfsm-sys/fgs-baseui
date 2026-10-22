import { CheckIcon, SettingsSalesActivitiesIcon } from '@cms/ui';
import { CatalogNavCard } from '../../../shared';
import {
  ACTIVITY_NAV_DESCRIPTION,
  ACTIVITY_NAV_TITLE,
  OUTCOME_NAV_DESCRIPTION,
  OUTCOME_NAV_TITLE,
} from '../constant';
import type { SalesActivitiesNavPanelProps } from '../types';

export const SalesActivitiesNavPanel = ({
  activityActiveCount,
  activityInactiveCount,
  catalog,
  onCatalogChange,
  outcomeActiveCount,
  outcomeInactiveCount,
}: SalesActivitiesNavPanelProps) => {
  const handleSelectActivity = () => {
    onCatalogChange('activity');
  };

  const handleSelectOutcome = () => {
    onCatalogChange('outcome');
  };

  return (
    <aside className="flex w-full shrink-0 flex-col gap-3 border-b border-border bg-secondary/40 p-5 lg:w-60 lg:border-r lg:border-b-0">
      <CatalogNavCard
        activeCount={activityActiveCount}
        description={ACTIVITY_NAV_DESCRIPTION}
        icon={<SettingsSalesActivitiesIcon className="size-4" />}
        iconClassName="bg-action-subtle text-action"
        inactiveCount={activityInactiveCount}
        onSelect={handleSelectActivity}
        selected={catalog === 'activity'}
        title={ACTIVITY_NAV_TITLE}
      />
      <CatalogNavCard
        activeCount={outcomeActiveCount}
        description={OUTCOME_NAV_DESCRIPTION}
        icon={<CheckIcon className="size-4" />}
        iconClassName="bg-data-4 text-data-4-foreground"
        inactiveCount={outcomeInactiveCount}
        onSelect={handleSelectOutcome}
        selected={catalog === 'outcome'}
        title={OUTCOME_NAV_TITLE}
      />
    </aside>
  );
};
