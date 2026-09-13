import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import type {
  NonWorkingDateCreateDto,
  NonWorkingDateSummaryDto,
} from '@cms/settings-contract';
import {
  createNonWorkingDateMutationOptions,
  deleteNonWorkingDateMutationOptions,
  nonWorkingDateListQueryOptions,
  updateNonWorkingDateMutationOptions,
} from '@cms/settings-data-access';
import {
  ADDED_MESSAGE,
  DELETED_MESSAGE,
  PAGE_SIZE,
  UPDATED_MESSAGE,
} from '../../../constant';

export const useNonWorkingDaysPanel = (queryClient: QueryClient) => {
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<NonWorkingDateSummaryDto | null>(
    null,
  );
  const [deletingRow, setDeletingRow] =
    useState<NonWorkingDateSummaryDto | null>(null);

  const query = useQuery(
    {
      ...nonWorkingDateListQueryOptions({ page, pageSize: PAGE_SIZE }),
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    },
    queryClient,
  );
  const createMutation = useMutation(
    createNonWorkingDateMutationOptions(queryClient),
    queryClient,
  );
  const updateMutation = useMutation(
    updateNonWorkingDateMutationOptions(queryClient),
    queryClient,
  );
  const deleteMutation = useMutation(
    deleteNonWorkingDateMutationOptions(queryClient),
    queryClient,
  );

  const items = query.data?.items ?? [];
  const totalCount = query.data?.totalCount ?? 0;
  const pageCount = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const writePending = createMutation.isPending || updateMutation.isPending;
  const writeError =
    createMutation.error ?? updateMutation.error ?? deleteMutation.error;
  const saveMessage = deleteMutation.isSuccess
    ? DELETED_MESSAGE
    : updateMutation.isSuccess
      ? UPDATED_MESSAGE
      : createMutation.isSuccess
        ? ADDED_MESSAGE
        : null;

  const closeFormDialog = () => {
    setFormOpen(false);
    setEditingRow(null);
  };

  const closeDeleteDialog = () => {
    setDeletingRow(null);
  };

  const openCreate = () => {
    setEditingRow(null);
    setFormOpen(true);
  };

  const openEdit = (row: NonWorkingDateSummaryDto) => {
    setEditingRow(row);
    setFormOpen(true);
  };

  const handleFormOpenChange = (open: boolean) => {
    setFormOpen(open);
    if (!open) setEditingRow(null);
  };

  const handleFormSubmit = (body: NonWorkingDateCreateDto) => {
    if (editingRow) {
      updateMutation.mutate(
        { id: editingRow.id, body },
        { onSuccess: closeFormDialog },
      );
      return;
    }
    createMutation.mutate(body, { onSuccess: closeFormDialog });
  };

  const handleDeleteOpenChange = (open: boolean) => {
    if (!open) setDeletingRow(null);
  };

  const handleDeleteConfirm = () => {
    if (!deletingRow) return;
    deleteMutation.mutate(deletingRow.id, { onSuccess: closeDeleteDialog });
  };

  const handlePreviousPage = () => {
    setPage((current) => Math.max(1, current - 1));
  };

  const handleNextPage = () => {
    setPage((current) => Math.min(pageCount, current + 1));
  };

  return {
    deletingRow,
    editingRow,
    formOpen,
    handleDeleteConfirm,
    handleDeleteOpenChange,
    handleFormOpenChange,
    handleFormSubmit,
    handleNextPage,
    handlePreviousPage,
    isDeletePending: deleteMutation.isPending,
    items,
    openCreate,
    openEdit,
    page,
    pageCount,
    queryError: query.isError ? query.error : null,
    queryPending: query.isPending,
    saveMessage,
    setDeletingRow,
    writeError,
    writePending,
  };
};
