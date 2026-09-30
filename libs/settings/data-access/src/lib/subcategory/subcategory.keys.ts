import type { SubcategoryListParams } from '@cms/settings-contract';

export const subcategoryKeys = {
  all: ['subcategory'] as const,
  lists: () => [...subcategoryKeys.all, 'list'] as const,
  list: (params: SubcategoryListParams = {}) =>
    [...subcategoryKeys.lists(), params] as const,
  details: () => [...subcategoryKeys.all, 'detail'] as const,
  detail: (id: number) => [...subcategoryKeys.details(), id] as const,
  lookups: () => [...subcategoryKeys.all, 'lookup'] as const,
  lookup: (activeOnly: boolean) =>
    [...subcategoryKeys.lookups(), { activeOnly }] as const,
} as const;
