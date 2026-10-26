import type { RefObject, ReactNode } from 'react';
import type { QueryClient } from '@tanstack/react-query';
import type { CustomerDetailDto } from '@cms/customer-contract';
import type { CustomerTagBadgeTone } from '../../../shared';
import type { CustomerDetailSectionId } from '../constant';

export interface CustomerDetailTagBadge {
  label: string;
  tone: CustomerTagBadgeTone;
}

export interface CustomerDetailPageProps {
  queryClient: QueryClient;
}

export interface CustomerDetailBreadcrumbProps {
  customerName?: string | null;
  loading?: boolean;
}

export interface CustomerDetailFinancialSnapshot {
  activeCards: number | null;
  arBalance: number | null;
  scheduledPayments: number | null;
  totalSales: number | null;
}

export interface CustomerDetailMetricTileProps {
  caption: string;
  captionAlign?: 'center' | 'start';
  icon: ReactNode;
  label: string;
  loading?: boolean;
  tone: 'blue' | 'purple';
  value: ReactNode;
}

export interface CustomerDetailBasicDetailsCardProps {
  className?: string;
  customer?: CustomerDetailDto;
  loading?: boolean;
  paymentTermLabel: string | null;
}

export interface CustomerDetailMoreOptionsPopoverProps {
  onCreateNewLocation?: () => void;
  onDeactivateCustomer?: () => void;
}

export interface CustomerDetailSummaryHeaderProps {
  customer: CustomerDetailDto | undefined;
  loading?: boolean;
  onCreateNewLocation?: () => void;
  onDeactivateCustomer?: () => void;
  onEditCustomer: () => void;
}

export interface CustomerDetailOverviewProps {
  customer: CustomerDetailDto | undefined;
  detailsLoading?: boolean;
  financials: CustomerDetailFinancialSnapshot;
  metricsLoading?: boolean;
  paymentTermLabel: string | null;
}

export interface CustomerDetailSectionNavProps {
  activeSectionId: CustomerDetailSectionId;
  onSectionSelect: (sectionId: CustomerDetailSectionId) => void;
}

export interface CustomerDetailScrollSectionsProps {
  customerId: number;
  onAddLocation: () => void;
  onEditLocation: (locationId: number) => void;
  onViewLocation: (locationId: number) => void;
  queryClient: QueryClient;
  stickyOffsetPx: number;
}

export interface CustomerDetailServiceLocationsSectionProps {
  customerId: number;
  onAddLocation: () => void;
  onEditLocation: (locationId: number) => void;
  onViewLocation: (locationId: number) => void;
  queryClient: QueryClient;
}

export interface CustomerDetailServiceLocationEmptyStateProps {
  onAddLocation: () => void;
}

export interface CustomerDetailServiceLocationTablePanelProps {
  customerId: number;
  onAddLocation: () => void;
  onEditLocation: (locationId: number) => void;
  onViewLocation: (locationId: number) => void;
  queryClient: QueryClient;
}

export interface ServiceLocationListFilters {
  customerType:
    | ''
    | 'residential'
    | 'commercial'
    | 'propertyManagement'
    | 'builder'
    | 'hoa'
    | 'other';
}

export interface CustomerDetailServiceLocationFilterProps {
  appliedFilters: ServiceLocationListFilters;
  onApply: (filters: ServiceLocationListFilters) => void;
  onClear: () => void;
}

export interface CustomerDetailServiceLocationCriteriaBarProps {
  appliedFilters: ServiceLocationListFilters;
  onClearAll: () => void;
  search: string;
}

export interface CustomerDetailStickyOverviewProps {
  activeSectionId: CustomerDetailSectionId;
  customer: CustomerDetailDto | undefined;
  detailsLoading?: boolean;
  financials: CustomerDetailFinancialSnapshot;
  metricsLoading?: boolean;
  onCreateNewLocation?: () => void;
  onDeactivateCustomer?: () => void;
  onEditCustomer: () => void;
  onSectionSelect: (sectionId: CustomerDetailSectionId) => void;
  sectionNavRef: RefObject<HTMLDivElement | null>;
  paymentTermLabel: string | null;
  tagBadges?: readonly CustomerDetailTagBadge[];
}
