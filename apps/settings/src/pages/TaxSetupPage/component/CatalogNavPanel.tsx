import {
  BodySmall,
  Callout,
  SettingsBusinessUnitIcon,
  SettingsTaxStatesIcon,
} from '@cms/ui';
import { CatalogNavCard } from './CatalogNavCard';
import {
  AUTHORITY_NAV_DESCRIPTION,
  RECOMMENDATIONS,
  TAX_CODE_NAV_DESCRIPTION,
} from '../constant';
import type { TaxCatalog } from '../types';

export interface CatalogNavPanelProps {
  activeAuthorityCount: number | undefined;
  activeTaxCodeCount: number | undefined;
  catalog: TaxCatalog;
  onCatalogChange: (catalog: TaxCatalog) => void;
}

export function CatalogNavPanel({
  activeAuthorityCount,
  activeTaxCodeCount,
  catalog,
  onCatalogChange,
}: CatalogNavPanelProps) {
  function selectAuthorities() {
    onCatalogChange('authorities');
  }

  function selectTaxCode() {
    onCatalogChange('tax-code');
  }

  return (
    <aside className="flex w-full shrink-0 flex-col gap-3 border-b border-border bg-secondary/40 p-5 lg:w-[19.25rem] lg:border-r lg:border-b-0">
      <CatalogNavCard
        activeCount={activeAuthorityCount}
        description={AUTHORITY_NAV_DESCRIPTION}
        icon={<SettingsBusinessUnitIcon />}
        iconClassName="bg-data-4 text-data-4-foreground"
        onSelect={selectAuthorities}
        selected={catalog === 'authorities'}
        title="Taxing Authorities"
      />
      <CatalogNavCard
        activeCount={activeTaxCodeCount}
        description={TAX_CODE_NAV_DESCRIPTION}
        icon={<SettingsTaxStatesIcon />}
        iconClassName="bg-action-subtle text-action"
        onSelect={selectTaxCode}
        selected={catalog === 'tax-code'}
        title="Tax Code"
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
