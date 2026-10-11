import type { QueryClient } from '@tanstack/react-query';
import type { GloSetupDescriptionTypeLookupDto } from '@cms/shared-contract';
import type { SetupDescriptionSummaryDto } from '@cms/settings-contract';
import type { SetupDescriptionForm } from '@cms/settings-data-access';
import type { StandardDescriptionListFilters } from './standard-description-list.types';

export interface StandardDescriptionPageProps {
  queryClient: QueryClient;
}

export type StandardDescriptionStatusFilter = 'active' | 'inactive';

export interface StandardDescriptionTablePanelProps {
  activeCount: number;
  appliedFilters: StandardDescriptionListFilters;
  descriptionTypeCode: string;
  inactiveCount: number;
  onAdd: () => void;
  onDeactivate: (record: SetupDescriptionSummaryDto) => void;
  onEdit: (record: SetupDescriptionSummaryDto) => void;
  onFiltersApply: (filters: StandardDescriptionListFilters) => void;
  onFiltersClear: () => void;
  onReactivate: (record: SetupDescriptionSummaryDto) => void;
  queryClient: QueryClient;
  showTradeColumn: boolean;
  tradeOptions: readonly { id: number; label: string }[];
  typeOptions: readonly GloSetupDescriptionTypeLookupDto[] | undefined;
}

export interface StandardDescriptionFormDialogProps {
  descriptionTypeCode: string;
  descriptionTypeLabel: string;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: SetupDescriptionForm) => void;
  open: boolean;
  record: SetupDescriptionSummaryDto | null;
  showTradeField: boolean;
  tradeOptions: readonly { id: number; label: string }[];
}

export interface StandardDescriptionDeactivateDialogProps {
  isPending: boolean;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  record: SetupDescriptionSummaryDto | null;
}

export interface StandardDescriptionDiscardDialogProps {
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export interface StandardDescriptionListFilterProps {
  appliedFilters: StandardDescriptionListFilters;
  onApply: (filters: StandardDescriptionListFilters) => void;
  onClear: () => void;
  showTradeFilter: boolean;
  tradeOptions: readonly { id: number; label: string }[];
  typeOptions: readonly GloSetupDescriptionTypeLookupDto[] | undefined;
}

export interface StandardDescriptionTypeNavPanelProps {
  activeCountsByType: Readonly<Record<string, number | undefined>>;
  inactiveCountsByType: Readonly<Record<string, number | undefined>>;
  onTypeChange: (code: string) => void;
  selectedTypeCode: string;
  typeOptions: readonly GloSetupDescriptionTypeLookupDto[] | undefined;
}
