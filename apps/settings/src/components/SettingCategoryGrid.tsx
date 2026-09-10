import { SettingCard, SettingCardGrid } from '@cms/ui';
import {
  resolveSettingIcon,
  resolveSettingTone,
} from '../lib/resolve-setting-icon';
import type { SettingCategory } from '../types';

export interface SettingCategoryGridProps {
  categories: readonly SettingCategory[];
}

export function SettingCategoryGrid({ categories }: SettingCategoryGridProps) {
  return (
    <SettingCardGrid>
      {categories.map((category, index) => {
        const Icon = resolveSettingIcon(category.icon);
        return (
          <SettingCard
            description={category.description}
            footerText={`${category.totalSettings.count.toLocaleString()} ${category.totalSettings.label}`}
            icon={<Icon />}
            key={category.title}
            title={category.title}
            tone={resolveSettingTone(category.icon, index)}
          />
        );
      })}
    </SettingCardGrid>
  );
}
