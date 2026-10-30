import type { QueryClient } from '@tanstack/react-query';
import type {
  JobTypeSummaryDto,
  PriceBookDetailDto,
  PriceBookItemSummaryDto,
  PriceBookSummaryDto,
} from '@cms/settings-contract';
import type {
  PriceBookForm,
  PriceBookItemForm,
  PriceBookLineKind,
} from '@cms/settings-data-access';
import type { DataTableStatus } from '@cms/ui';
import type { CatalogStatusFilter } from '../../../shared';

export interface PricebookPageProps {
  queryClient: QueryClient;
}

export interface PricebookListFilters {
  isTaxable: '' | 'true' | 'false';
  jobTypeId: string;
}

export interface PricebookHeaderProps {
  onAdd: () => void;
}

export interface PricebookRowActionsProps {
  onDeactivate: (record: PriceBookSummaryDto) => void;
  onEdit: (record: PriceBookSummaryDto) => void;
  row: PriceBookSummaryDto;
}

export interface PricebookTablePanelProps {
  activeCount: number;
  inactiveCount: number;
  jobTypes: readonly JobTypeSummaryDto[];
  onDeactivate: (record: PriceBookSummaryDto) => void;
  onEdit: (record: PriceBookSummaryDto) => void;
  rows: readonly PriceBookSummaryDto[];
  tableStatus: DataTableStatus;
  loadError?: string;
}

export interface PricebookListFilterProps {
  appliedFilters: PricebookListFilters;
  jobTypes: readonly JobTypeSummaryDto[];
  onApply: (filters: PricebookListFilters) => void;
  onClear: () => void;
}

export interface PricebookDeactivateDialogProps {
  isPending: boolean;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  priceBook: PriceBookSummaryDto | null;
}

export interface PricebookEditorHeaderProps {
  description: string;
  title: string;
}

export interface PricebookDiscardDialogProps {
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export interface PricebookServiceFieldsProps {
  jobTypes: readonly JobTypeSummaryDto[];
}

export interface PricebookPricingSectionProps {
  savedBasePrice?: number | null;
}

export type PricebookEditorTab = 'details' | 'material' | 'equipment' | 'other';

export interface PricebookLineItemsPanelProps {
  kind: PriceBookLineKind;
  priceBookId: number | null;
  queryClient: QueryClient;
}

export interface PricebookLineItemDialogProps {
  isPending: boolean;
  kind: PriceBookLineKind;
  line: PriceBookItemSummaryDto | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: PriceBookItemForm) => void;
  open: boolean;
}

export interface PricebookLineDeleteDialogProps {
  isPending: boolean;
  line: PriceBookItemSummaryDto | null;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export type { CatalogStatusFilter, PriceBookForm };
