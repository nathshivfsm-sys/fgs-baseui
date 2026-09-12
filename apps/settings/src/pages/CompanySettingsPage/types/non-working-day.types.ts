import type { QueryClient } from '@tanstack/react-query';
import type {
  NonWorkingDateCreateDto,
  NonWorkingDateSummaryDto,
} from '@cms/settings-contract';

export interface NonWorkingDaysPanelProps {
  queryClient: QueryClient;
}

export interface NonWorkingDaysHeaderProps {
  onAdd: () => void;
  titleId: string;
}

export interface NonWorkingDaysStatusProps {
  queryError: unknown;
  saveMessage: string | null;
  writeError: unknown;
}

export interface NonWorkingDaysTableProps {
  isPending: boolean;
  items: NonWorkingDateSummaryDto[];
  onDelete: (row: NonWorkingDateSummaryDto) => void;
  onEdit: (row: NonWorkingDateSummaryDto) => void;
}

export interface NonWorkingDayRowProps {
  onDelete: (row: NonWorkingDateSummaryDto) => void;
  onEdit: (row: NonWorkingDateSummaryDto) => void;
  row: NonWorkingDateSummaryDto;
}

export interface NonWorkingDaysPagerProps {
  onNextPage: () => void;
  onPreviousPage: () => void;
  page: number;
  pageCount: number;
}

export interface NonWorkingDayFormDialogProps {
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (body: NonWorkingDateCreateDto) => void;
  open: boolean;
  row: NonWorkingDateSummaryDto | null;
}

export interface NonWorkingDayDeleteDialogProps {
  isPending: boolean;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  row: NonWorkingDateSummaryDto | null;
}

export interface DialogFooterActionsProps {
  cancelDisabled?: boolean;
  onCancel: () => void;
  onPrimary?: () => void;
  primaryLabel: string;
  primaryLoading: boolean;
  primaryType?: 'button' | 'submit';
  primaryVariant?: 'action' | 'destructive';
}
