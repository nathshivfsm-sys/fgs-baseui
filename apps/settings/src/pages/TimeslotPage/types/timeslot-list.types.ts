export interface TimeslotListFilters {
  zoneId: string;
}

export const emptyTimeslotListFilters = (): TimeslotListFilters => ({
  zoneId: '',
});

export const countTimeslotListFilters = (
  filters: TimeslotListFilters,
): number => (filters.zoneId ? 1 : 0);
