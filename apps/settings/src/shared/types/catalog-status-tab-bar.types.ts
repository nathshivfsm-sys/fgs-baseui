export type CatalogStatusFilter = 'active' | 'inactive';

export interface CatalogStatusTabBarProps {
  activeCount: number;
  addLabel: string;
  inactiveCount: number;
  onAdd: () => void;
  onSearchChange?: (value: string) => void;
  onStatusChange: (status: CatalogStatusFilter) => void;
  searchPlaceholder?: string;
  searchValue?: string;
  status: CatalogStatusFilter;
}
