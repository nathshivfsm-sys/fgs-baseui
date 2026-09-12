import { useId, useState } from 'react';
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
  BodySmall,
  Button,
  Callout,
  ChevronLeftIcon,
  ChevronRightIcon,
  EditIcon,
  IconButton,
  PlusIcon,
  SectionTitle,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TrashIcon,
} from '@cms/ui';
import { EMPTY_COPY, PAGE_SIZE } from '../../constant';
import {
  describeNonWorkingDateError,
  formatNonWorkingDate,
  weekdayName,
} from '../../util';
import { NonWorkingDayDeleteDialog } from './NonWorkingDayDeleteDialog';
import { NonWorkingDayFormDialog } from './NonWorkingDayFormDialog';

export interface NonWorkingDaysPanelProps {
  queryClient: QueryClient;
}

export function NonWorkingDaysPanel({ queryClient }: NonWorkingDaysPanelProps) {
  const titleId = useId();
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
    ? 'Non-working day deleted'
    : updateMutation.isSuccess
      ? 'Non-working day updated'
      : createMutation.isSuccess
        ? 'Non-working day added'
        : null;

  function openCreate() {
    setEditingRow(null);
    setFormOpen(true);
  }

  function handleFormOpenChange(open: boolean) {
    setFormOpen(open);
    if (!open) setEditingRow(null);
  }

  function closeFormDialog() {
    setFormOpen(false);
    setEditingRow(null);
  }

  function handleFormSubmit(body: NonWorkingDateCreateDto) {
    if (editingRow) {
      updateMutation.mutate(
        { id: editingRow.id, body },
        { onSuccess: closeFormDialog },
      );
      return;
    }
    createMutation.mutate(body, { onSuccess: closeFormDialog });
  }

  function handleDeleteOpenChange(open: boolean) {
    if (!open) setDeletingRow(null);
  }

  function closeDeleteDialog() {
    setDeletingRow(null);
  }

  function handleDeleteConfirm() {
    if (!deletingRow) return;
    deleteMutation.mutate(deletingRow.id, { onSuccess: closeDeleteDialog });
  }

  function handlePreviousPage() {
    setPage((current) => Math.max(1, current - 1));
  }

  function handleNextPage() {
    setPage((current) => Math.min(pageCount, current + 1));
  }

  function openEdit(row: NonWorkingDateSummaryDto) {
    setEditingRow(row);
    setFormOpen(true);
  }

  function renderTableBody() {
    if (query.isPending) {
      return Array.from({ length: 4 }, (_, index) => (
        <TableRow key={index}>
          <TableCell colSpan={4}>
            <Skeleton className="h-6" />
          </TableCell>
        </TableRow>
      ));
    }
    if (items.length === 0) {
      return (
        <TableRow>
          <TableCell className="text-foreground-subtle" colSpan={4}>
            {EMPTY_COPY}
          </TableCell>
        </TableRow>
      );
    }
    return items.map((row) => (
      <NonWorkingDayRow
        key={row.id}
        onDelete={setDeletingRow}
        onEdit={openEdit}
        row={row}
      />
    ));
  }

  return (
    <section aria-labelledby={titleId} className="min-w-0 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <SectionTitle id={titleId} size="sm">
            Non-Working Days
          </SectionTitle>
          <BodySmall color="foreground-subtle">
            Define company holidays and non working days.
          </BodySmall>
        </div>
        <Button
          className="shrink-0"
          onClick={openCreate}
          size="sm"
          type="button"
          variant="subtle"
        >
          <PlusIcon aria-hidden className="size-4" />
          Add Non-Working Day
        </Button>
      </div>

      {saveMessage ? (
        <Callout title="Saved" variant="success">
          {saveMessage}
        </Callout>
      ) : null}
      {writeError ? (
        <Callout title="Could not save" variant="error">
          {describeNonWorkingDateError(writeError)}
        </Callout>
      ) : null}
      {query.isError ? (
        <Callout title="Unable to load non-working days" variant="error">
          {describeNonWorkingDateError(query.error)}
        </Callout>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Day</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{renderTableBody()}</TableBody>
          </Table>

          <nav
            aria-label="Non-working days pages"
            className="flex items-center justify-end gap-1"
          >
            <IconButton
              disabled={page <= 1}
              icon={<ChevronLeftIcon className="size-4" />}
              label="Previous page"
              onClick={handlePreviousPage}
              size="xs"
              type="button"
              variant="surface"
            />
            <Button aria-current="page" size="iconXs" type="button">
              {page}
            </Button>
            <IconButton
              disabled={page >= pageCount}
              icon={<ChevronRightIcon className="size-4" />}
              label="Next page"
              onClick={handleNextPage}
              size="xs"
              type="button"
              variant="surface"
            />
          </nav>
        </>
      )}

      <NonWorkingDayFormDialog
        isPending={writePending}
        onOpenChange={handleFormOpenChange}
        onSubmit={handleFormSubmit}
        open={formOpen}
        row={editingRow}
      />
      <NonWorkingDayDeleteDialog
        isPending={deleteMutation.isPending}
        onConfirm={handleDeleteConfirm}
        onOpenChange={handleDeleteOpenChange}
        open={deletingRow != null}
        row={deletingRow}
      />
    </section>
  );
}

interface NonWorkingDayRowProps {
  onDelete: (row: NonWorkingDateSummaryDto) => void;
  onEdit: (row: NonWorkingDateSummaryDto) => void;
  row: NonWorkingDateSummaryDto;
}

function NonWorkingDayRow({ onDelete, onEdit, row }: NonWorkingDayRowProps) {
  const description = row.name?.trim() || '—';

  function handleEdit() {
    onEdit(row);
  }

  function handleDelete() {
    onDelete(row);
  }

  return (
    <TableRow>
      <TableCell className="whitespace-nowrap">
        {formatNonWorkingDate(row.nonWorkingDate)}
      </TableCell>
      <TableCell>{weekdayName(row.nonWorkingDate)}</TableCell>
      <TableCell>{description}</TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <IconButton
            className="text-action"
            icon={<EditIcon className="size-4" />}
            label={`Edit ${description}`}
            onClick={handleEdit}
            size="xs"
            type="button"
            variant="ghost"
          />
          <IconButton
            className="text-destructive"
            icon={<TrashIcon className="size-4" />}
            label={`Delete ${description}`}
            onClick={handleDelete}
            size="xs"
            type="button"
            variant="ghost"
          />
        </div>
      </TableCell>
    </TableRow>
  );
}
