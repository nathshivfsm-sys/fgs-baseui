import {
  SettingsBillingCategoryIcon,
  SettingsJobTypeIcon,
} from '@cms/ui';
import { CatalogNavCard } from '../../../shared';
import {
  CATEGORY_NAV_DESCRIPTION,
  JOB_TYPE_NAV_DESCRIPTION,
  NAV_CATEGORY_ACTIVE,
  NAV_CATEGORY_INACTIVE,
  NAV_JOB_TYPE_ACTIVE,
  NAV_JOB_TYPE_INACTIVE,
} from '../constant';
import type { JobTypeCatalog } from '../types';

export interface JobTypeCatalogNavPanelProps {
  catalog: JobTypeCatalog;
  onCatalogChange: (catalog: JobTypeCatalog) => void;
}

export function JobTypeCatalogNavPanel({
  catalog,
  onCatalogChange,
}: JobTypeCatalogNavPanelProps) {
  const handleSelectJobType = () => {
    onCatalogChange('job-type');
  };

  const handleSelectCategory = () => {
    onCatalogChange('category');
  };

  return (
    <aside className="flex w-full shrink-0 flex-col gap-3 border-b border-border bg-secondary/40 p-5 lg:w-[16.25rem] lg:border-r lg:border-b-0">
      <CatalogNavCard
        activeCount={NAV_JOB_TYPE_ACTIVE}
        description={JOB_TYPE_NAV_DESCRIPTION}
        icon={<SettingsJobTypeIcon className="size-4" />}
        iconClassName="bg-action-subtle text-action"
        inactiveCount={NAV_JOB_TYPE_INACTIVE}
        onSelect={handleSelectJobType}
        selected={catalog === 'job-type'}
        title="Job Type"
      />
      <CatalogNavCard
        activeCount={NAV_CATEGORY_ACTIVE}
        description={CATEGORY_NAV_DESCRIPTION}
        icon={<SettingsBillingCategoryIcon className="size-4" />}
        iconClassName="bg-data-4 text-data-4-foreground"
        inactiveCount={NAV_CATEGORY_INACTIVE}
        onSelect={handleSelectCategory}
        selected={catalog === 'category'}
        title="Category"
      />
    </aside>
  );
}
