import type { JobCategorySummaryDto } from '@cms/settings-contract';
import type { CategoryListEntry } from '../types';

export const toCategoryListEntry = (
  category: JobCategorySummaryDto,
): CategoryListEntry => ({
  id: String(category.id),
  name: category.name?.trim() || 'Untitled category',
  code: category.categoryCode ?? undefined,
  iconTone: 'blue',
  inactive: !category.isActive,
  backgroundColor: category.backgroundColor,
  textColor: category.textColor,
});
