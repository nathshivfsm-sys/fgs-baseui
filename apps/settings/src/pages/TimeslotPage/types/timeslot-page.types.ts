import type { QueryClient } from '@tanstack/react-query';
import type { TimeslotSummaryDto } from '@cms/settings-contract';
import type { TimeslotForm } from '@cms/settings-data-access';
import type { SelectOption } from '@cms/ui';
import type { TimeslotListFilters } from './timeslot-list.types';

export interface TimeslotPageProps {
  queryClient: QueryClient;
}

export type TimeslotStatusFilter = 'active' | 'inactive';

export interface TimeslotHeaderProps {
  onAdd: () => void;
}

export interface TimeslotFormDialogProps {
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: TimeslotForm) => void;
  open: boolean;
  timeslot: TimeslotSummaryDto | null;
  zoneOptions: readonly SelectOption[];
}

export interface TimeslotDeactivateDialogProps {
  isPending: boolean;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  timeslot: TimeslotSummaryDto | null;
}

export interface TimeslotDiscardDialogProps {
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export interface TimeslotListFilterProps {
  appliedFilters: TimeslotListFilters;
  onApply: (filters: TimeslotListFilters) => void;
  onClear: () => void;
  zoneOptions: readonly SelectOption[];
}

export interface TimeslotTablePanelProps {
  activeCount: number;
  appliedFilters: TimeslotListFilters;
  inactiveCount: number;
  onDeactivate: (record: TimeslotSummaryDto) => void;
  onEdit: (record: TimeslotSummaryDto) => void;
  onFiltersApply: (filters: TimeslotListFilters) => void;
  onFiltersClear: () => void;
  queryClient: QueryClient;
  zoneOptions: readonly SelectOption[];
}
