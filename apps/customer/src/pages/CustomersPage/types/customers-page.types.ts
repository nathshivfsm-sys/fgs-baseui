import type { QueryClient } from '@tanstack/react-query';
import type { UserDetails } from '@cms/platform-contract';
import type { CustomerListSummaryDto } from '@cms/customer-contract';
import type { CatalogStatusFilter } from '../../../shared';

export type CustomerStatusFilter = CatalogStatusFilter;

export type CustomerPreferredFilter = '' | 'true' | 'false';

export interface CustomerListFilters {
  isPreferred: CustomerPreferredFilter;
}

export interface CustomersPageProps {
  queryClient: QueryClient;
  currentUser: UserDetails;
  canEditCustomer?: boolean;
}

export interface CustomersSummaryCardsProps {
  loading?: boolean;
  summary: CustomerListSummaryDto | null | undefined;
}

export interface CustomerTablePanelProps {
  activeCount: number;
  appliedFilters: CustomerListFilters;
  canEditCustomer: boolean;
  inactiveCount: number;
  onEdit: (customerId: number) => void;
  onFiltersApply: (filters: CustomerListFilters) => void;
  onFiltersClear: () => void;
  onView: (customerId: number) => void;
  queryClient: QueryClient;
  userId: string;
}

export interface CustomerListFilterProps {
  appliedFilters: CustomerListFilters;
  onApply: (filters: CustomerListFilters) => void;
  onClear: () => void;
}

export interface CustomerListCriteriaBarProps {
  appliedFilters: CustomerListFilters;
  onClearAll: () => void;
  search: string;
}
