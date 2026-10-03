import type { QueryClient } from '@tanstack/react-query';
import type { ResolutionCodeSummaryDto } from '@cms/settings-contract';
import type { ResolutionCodeForm } from '@cms/settings-data-access';
import type { ResolutionCodeListFilters } from './resolution-code-list.types';

export interface ResolutionCodePageProps {
  queryClient: QueryClient;
}

export type ResolutionCodeStatusFilter = 'active' | 'inactive';

export interface ResolutionCodeHeaderProps {
  onAdd: () => void;
}

export interface ResolutionCodeFormDialogProps {
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ResolutionCodeForm) => void;
  open: boolean;
  resolutionCode: ResolutionCodeSummaryDto | null;
}

export interface ResolutionCodeDeactivateDialogProps {
  isPending: boolean;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  resolutionCode: ResolutionCodeSummaryDto | null;
}

export interface ResolutionCodeDiscardDialogProps {
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export interface ResolutionCodeListFilterProps {
  appliedFilters: ResolutionCodeListFilters;
  onApply: (filters: ResolutionCodeListFilters) => void;
  onClear: () => void;
}

export interface ResolutionCodeTablePanelProps {
  activeCount: number;
  appliedFilters: ResolutionCodeListFilters;
  inactiveCount: number;
  onDeactivate: (record: ResolutionCodeSummaryDto) => void;
  onEdit: (record: ResolutionCodeSummaryDto) => void;
  onFiltersApply: (filters: ResolutionCodeListFilters) => void;
  onFiltersClear: () => void;
  queryClient: QueryClient;
}
