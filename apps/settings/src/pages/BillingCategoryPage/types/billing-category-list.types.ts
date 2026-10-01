export type BillingCategoryTriStateFilter = '' | 'true' | 'false';

export type BillingCategoryListFilters = {
  billingCategoryType: string;
  isSystemDefined: BillingCategoryTriStateFilter;
  showToFieldTech: BillingCategoryTriStateFilter;
  allowToPick: BillingCategoryTriStateFilter;
};

export const emptyBillingCategoryListFilters =
  (): BillingCategoryListFilters => ({
    billingCategoryType: '',
    isSystemDefined: '',
    showToFieldTech: '',
    allowToPick: '',
  });

export const countBillingCategoryListFilters = (
  filters: BillingCategoryListFilters,
): number => {
  let count = 0;
  if (filters.billingCategoryType) count += 1;
  if (filters.isSystemDefined) count += 1;
  if (filters.showToFieldTech) count += 1;
  if (filters.allowToPick) count += 1;
  return count;
};

export const toBillingCategoryListQueryFilters = (
  filters: BillingCategoryListFilters,
): {
  billingCategoryType?: string;
  isSystemDefined?: boolean;
  showToFieldTech?: boolean;
  allowToPick?: boolean;
} => ({
  billingCategoryType: filters.billingCategoryType || undefined,
  isSystemDefined:
    filters.isSystemDefined === ''
      ? undefined
      : filters.isSystemDefined === 'true',
  showToFieldTech:
    filters.showToFieldTech === ''
      ? undefined
      : filters.showToFieldTech === 'true',
  allowToPick:
    filters.allowToPick === '' ? undefined : filters.allowToPick === 'true',
});
