import type { ReactNode } from 'react';

export type CatalogStatusFilter = 'active' | 'inactive';

export interface CatalogStatusTabBarProps {
  activeCount: number;
  addLabel: string;
  /** When set, replaces the default Filter button (e.g. popover trigger). */
  filter?: ReactNode;
  inactiveCount: number;
  onAdd: () => void;
  onFilterClick?: () => void;
  onSearchChange?: (value: string) => void;
  onStatusChange: (status: CatalogStatusFilter) => void;
  searchPlaceholder?: string;
  searchValue?: string;
  status: CatalogStatusFilter;
}
