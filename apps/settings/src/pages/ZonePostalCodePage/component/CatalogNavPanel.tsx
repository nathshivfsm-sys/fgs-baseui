import {
  BodySmall,
  Callout,
  SettingsPostalCodesIcon,
  SettingsZoneIcon,
} from '@cms/ui';
import { CatalogNavCard } from './CatalogNavCard';
import {
  POSTAL_NAV_DESCRIPTION,
  RECOMMENDATIONS,
  ZONE_NAV_DESCRIPTION,
} from '../constant';
import type { ZoneCatalog } from '../types';

export interface CatalogNavPanelProps {
  activeZoneCount: number | undefined;
  catalog: ZoneCatalog;
  onCatalogChange: (catalog: ZoneCatalog) => void;
}

export function CatalogNavPanel({
  activeZoneCount,
  catalog,
  onCatalogChange,
}: CatalogNavPanelProps) {
  function selectZones() {
    onCatalogChange('zones');
  }

  function selectPostal() {
    onCatalogChange('postal');
  }

  return (
    <aside className="flex w-full shrink-0 flex-col gap-3 border-b border-border bg-secondary/40 p-5 lg:w-[19.25rem] lg:border-r lg:border-b-0">
      <CatalogNavCard
        activeCount={activeZoneCount}
        description={ZONE_NAV_DESCRIPTION}
        icon={<SettingsZoneIcon />}
        iconClassName="bg-action-subtle text-action"
        onSelect={selectZones}
        selected={catalog === 'zones'}
        title="Zones"
      />
      <CatalogNavCard
        description={POSTAL_NAV_DESCRIPTION}
        icon={<SettingsPostalCodesIcon />}
        iconClassName="bg-data-4 text-data-4-foreground"
        onSelect={selectPostal}
        selected={catalog === 'postal'}
        title="Postal Code"
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
}
