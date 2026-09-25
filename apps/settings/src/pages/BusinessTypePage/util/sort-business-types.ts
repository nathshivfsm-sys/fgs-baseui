import type { BusinessTypeSummaryDto } from '@cms/settings-contract';

/** Stable catalog order: display order, then name. */
export const sortBusinessTypes = (
  items: readonly BusinessTypeSummaryDto[],
): BusinessTypeSummaryDto[] =>
  [...items].sort((left, right) => {
    const leftOrder = left.displayOrder ?? Number.MAX_SAFE_INTEGER;
    const rightOrder = right.displayOrder ?? Number.MAX_SAFE_INTEGER;
    if (leftOrder !== rightOrder) return leftOrder - rightOrder;
    return (left.name ?? '').localeCompare(right.name ?? '');
  });
