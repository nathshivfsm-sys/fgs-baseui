export type StandardDescriptionListFilters = {
  descriptionTypeCode: string;
  tradeId: string;
};

export const emptyStandardDescriptionListFilters =
  (): StandardDescriptionListFilters => ({
    descriptionTypeCode: '',
    tradeId: '',
  });

export const countStandardDescriptionListFilters = (
  filters: StandardDescriptionListFilters,
): number => {
  let count = 0;
  if (filters.descriptionTypeCode) count += 1;
  if (filters.tradeId) count += 1;
  return count;
};
