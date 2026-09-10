import { SettingCard, SettingCardGrid } from '@cms/ui';
import {
  resolveSettingIcon,
  resolveSettingTone,
} from '../lib/resolve-setting-icon';
import type { SettingCategory } from '../types';

export interface SettingCategoryGridProps {
  categories: readonly SettingCategory[];
  onCategorySelect?: (category: SettingCategory) => void;
}

export function SettingCategoryGrid({
  categories,
  onCategorySelect,
}: SettingCategoryGridProps) {
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
            onClick={() => onCategorySelect?.(category)}
            title={category.title}
            tone={resolveSettingTone(category.icon, index)}
          />
        );
      })}
    </SettingCardGrid>
  );
}
