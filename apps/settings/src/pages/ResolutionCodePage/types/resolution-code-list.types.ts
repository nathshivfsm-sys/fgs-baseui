export interface ResolutionCodeListFilters {
  typeId: string;
}

export const emptyResolutionCodeListFilters =
  (): ResolutionCodeListFilters => ({
    typeId: '',
  });

export const countResolutionCodeListFilters = (
  filters: ResolutionCodeListFilters,
): number => (filters.typeId ? 1 : 0);
