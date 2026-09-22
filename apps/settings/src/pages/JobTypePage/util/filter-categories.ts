import type { CategoryListEntry } from '../types';

export function filterCategories(
  categories: readonly CategoryListEntry[],
  query: string,
): readonly CategoryListEntry[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return categories;
  }
  return categories.filter(
    (category) =>
      category.name.toLowerCase().includes(normalized) ||
      category.code?.toLowerCase().includes(normalized),
  );
}
