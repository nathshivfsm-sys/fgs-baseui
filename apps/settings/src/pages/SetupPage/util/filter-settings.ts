import type { SettingCategory } from '../types';

export function filterSettings(
  categories: readonly SettingCategory[],
  query: string,
): readonly SettingCategory[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return categories;
  return categories.filter(
    (category) =>
      category.title.toLowerCase().includes(normalized) ||
      category.description.toLowerCase().includes(normalized),
  );
}
