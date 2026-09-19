import {
  BodySmall,
  Callout,
  OrganizationIcon,
  SettingsBusinessUnitIcon,
} from '@cms/ui';
import { CatalogNavCard } from '../../../shared/component';
import {
  BREAK_TWO_NAV_DESCRIPTION,
  BREAK_TWO_NAV_TITLE,
  BUSINESS_UNIT_NAV_DESCRIPTION,
  BUSINESS_UNIT_NAV_TITLE,
  RECOMMENDATIONS,
} from '../constant';
import type { BusinessUnitNavPanelProps } from '../types';

export const CatalogNavPanel = ({
  activeBreakTwoCount,
  activeBusinessUnitCount,
  catalog,
  onCatalogChange,
}: BusinessUnitNavPanelProps) => {
  const selectBusinessUnits = () => {
    onCatalogChange('business-units');
  };

  const selectBreakTwo = () => {
    onCatalogChange('break-2');
  };

  return (
    <aside className="flex w-full shrink-0 flex-col gap-3 border-b border-border bg-secondary/40 p-5 lg:w-[19.25rem] lg:border-r lg:border-b-0">
      <CatalogNavCard
        activeCount={activeBusinessUnitCount}
        description={BUSINESS_UNIT_NAV_DESCRIPTION}
        icon={<SettingsBusinessUnitIcon />}
        iconClassName="bg-action-subtle text-action"
        onSelect={selectBusinessUnits}
        selected={catalog === 'business-units'}
        title={BUSINESS_UNIT_NAV_TITLE}
      />
      <CatalogNavCard
        activeCount={activeBreakTwoCount}
        description={BREAK_TWO_NAV_DESCRIPTION}
        icon={<OrganizationIcon />}
        iconClassName="bg-data-4 text-data-4-foreground"
        onSelect={selectBreakTwo}
        selected={catalog === 'break-2'}
        title={BREAK_TWO_NAV_TITLE}
      />
      <Callout className="rounded-xl px-4 py-4" title="Recommendation" variant="info">
        <ul className="mt-2 list-disc space-y-1.5 pl-4">
          {RECOMMENDATIONS.map((item) => (
            <li key={item}>
              <BodySmall color="foreground">{item}</BodySmall>
            </li>
          ))}
        </ul>
      </Callout>
    </aside>
  );
};
