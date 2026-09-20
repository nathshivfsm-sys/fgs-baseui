import {
  BodySmall,
  Callout,
  MapPinIcon,
  SettingsJobTypeIcon,
  SettingsTradeSkillsIcon,
} from '@cms/ui';
import { CatalogNavCard } from '../../../shared/component';
import {
  RECOMMENDATIONS,
  SKILLS_NAV_DESCRIPTION,
  TRADE_NAV_DESCRIPTION,
} from '../constant';
import type { TradeCatalog } from '../types';

export interface CatalogNavPanelProps {
  activeSkillCount: number | undefined;
  activeTradeCount: number | undefined;
  catalog: TradeCatalog;
  onCatalogChange: (catalog: TradeCatalog) => void;
}

export const CatalogNavPanel = ({
  activeSkillCount,
  activeTradeCount,
  catalog,
  onCatalogChange,
}: CatalogNavPanelProps) => {
  const selectTrade = () => {
    onCatalogChange('trade');
  };

  const selectSkills = () => {
    onCatalogChange('skills');
  };

  return (
    <aside className="flex w-full shrink-0 flex-col gap-3 border-b border-border bg-secondary/40 p-5 lg:w-[19.25rem] lg:border-r lg:border-b-0">
      <CatalogNavCard
        activeCount={activeTradeCount}
        description={TRADE_NAV_DESCRIPTION}
        icon={<SettingsTradeSkillsIcon />}
        iconClassName="bg-action-subtle text-action"
        onSelect={selectTrade}
        selected={catalog === 'trade'}
        title="Trade"
      />
      <CatalogNavCard
        activeCount={activeSkillCount}
        description={SKILLS_NAV_DESCRIPTION}
        icon={<SettingsJobTypeIcon />}
        iconClassName="bg-data-4 text-data-4-foreground"
        onSelect={selectSkills}
        selected={catalog === 'skills'}
        title="Skills"
      />
      <Callout
        className="rounded-xl px-4 py-4"
        icon={<MapPinIcon className="size-[15.984px]" />}
        title="Recommendation"
        variant="info"
      >
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
