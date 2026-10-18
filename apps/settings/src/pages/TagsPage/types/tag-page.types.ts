import type { QueryClient } from '@tanstack/react-query';
import type { TagForm } from '@cms/settings-data-access';
import type { TagSummaryDto } from '@cms/settings-contract';
import type { CatalogStatusFilter } from '../../../shared';

export interface TagsPageProps {
  queryClient: QueryClient;
}

export type TagStatusFilter = CatalogStatusFilter;

export interface TagListFilters {
  entity: string;
}

export const emptyTagListFilters = (): TagListFilters => ({ entity: '' });

export const countTagListFilters = (filters: TagListFilters): number =>
  filters.entity.trim() === '' ? 0 : 1;

export interface TagTablePanelProps {
  activeCount: number;
  appliedFilters: TagListFilters;
  inactiveCount: number;
  onAdd: () => void;
  onDelete: (record: TagSummaryDto) => void;
  onEdit: (record: TagSummaryDto) => void;
  onFiltersApply: (filters: TagListFilters) => void;
  onFiltersClear: () => void;
  queryClient: QueryClient;
}

export interface TagListFilterProps {
  appliedFilters: TagListFilters;
  onApply: (filters: TagListFilters) => void;
  onClear: () => void;
}

export interface TagColorSwatchProps {
  color: string | null | undefined;
  fallback: string;
}

export interface TagFormDialogProps {
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: TagForm) => void;
  open: boolean;
  tag: TagSummaryDto | null;
}

export interface TagDeleteDialogProps {
  isPending: boolean;
  onConfirm: () => void;
  onDeactivate: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  tag: TagSummaryDto | null;
}

export interface TagEntityRemovalDialogProps {
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export interface TagDiscardDialogProps {
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}
