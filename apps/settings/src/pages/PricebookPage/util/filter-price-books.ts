import type { PriceBookSummaryDto } from '@cms/settings-contract';
import type { CatalogStatusFilter } from '../../../shared';
import type { PricebookListFilters } from '../types';

export const countPricebookFilters = (filters: PricebookListFilters) => {
  let count = 0;
  if (filters.jobTypeId) count += 1;
  if (filters.isTaxable) count += 1;
  return count;
};

export const filterPriceBooks = (
  records: readonly PriceBookSummaryDto[],
  status: CatalogStatusFilter,
  search: string,
  filters: PricebookListFilters,
) => {
  const needle = search.trim().toLowerCase();
  const active = status === 'active';
  return records.filter((record) => {
    if (record.isActive !== active) return false;
    if (filters.jobTypeId && String(record.jobTypeId) !== filters.jobTypeId) {
      return false;
    }
    if (filters.isTaxable === 'true' && !record.isTaxable) return false;
    if (filters.isTaxable === 'false' && record.isTaxable) return false;
    if (!needle) return true;
    const code = (record.priceBookCode ?? '').toLowerCase();
    const name = (record.priceBookName ?? '').toLowerCase();
    return code.includes(needle) || name.includes(needle);
  });
};
