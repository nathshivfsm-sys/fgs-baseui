import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { PriceBookItemSummaryDto } from '@cms/settings-contract';
import {
  PRICE_BOOK_LINE_OTHER,
  createPriceBookItemMutationOptions,
  deletePriceBookItemMutationOptions,
  priceBookItemListQueryOptions,
  priceBookLineKind,
  toPriceBookItemCreateDto,
  toPriceBookItemUpdateDto,
  updatePriceBookItemMutationOptions,
  type PriceBookItemForm,
  type PriceBookLineKind,
} from '@cms/settings-data-access';
import {
  BodySmall,
  Button,
  Callout,
  DataTableSearch,
  PlusIcon,
  alert,
  createDataTableColumnHelper,
  DataTable,
  DataTableRowActions,
} from '@cms/ui';
import {
  ADD_ITEM_LABEL,
  LINE_COST_PRICE_MESSAGE,
  LINE_CREATED_MESSAGE,
  LINE_CREATED_TITLE,
  LINE_DELETE_ERROR_TITLE,
  LINE_DELETED_MESSAGE,
  LINE_DELETED_TITLE,
  LINE_SAVE_ERROR_TITLE,
  LINE_UPDATED_MESSAGE,
  LINE_UPDATED_TITLE,
  PRICEBOOK_LIST_PAGE_SIZE,
  SAVE_FIRST_MESSAGE,
} from '../constant';
import type { PricebookLineItemsPanelProps } from '../types';
import { describePricebookItemError, formatQuantity } from '../util';
import { PricebookLineDeleteDialog } from './PricebookLineDeleteDialog';
import { PricebookLineItemDialog } from './PricebookLineItemDialog';

const column = createDataTableColumnHelper<PriceBookItemSummaryDto>();

const LineRowActions = ({
  onDelete,
  onEdit,
  row,
}: {
  onDelete: (row: PriceBookItemSummaryDto) => void;
  onEdit: (row: PriceBookItemSummaryDto) => void;
  row: PriceBookItemSummaryDto;
}) => {
  const displayName = row.itemCode?.trim() || 'line';

  const handleEdit = () => {
    onEdit(row);
  };

  const handleDelete = () => {
    onDelete(row);
  };

  return (
    <DataTableRowActions
      deleteLabel={`Delete ${displayName}`}
      editLabel={`Edit ${displayName}`}
      onDelete={handleDelete}
      onEdit={handleEdit}
    />
  );
};

const tabCopy = (kind: PriceBookLineKind) => {
  if (kind === PRICE_BOOK_LINE_OTHER) {
    return {
      empty: 'No other lines found.',
      search: 'Search other',
      title: 'Other charges on this service.',
    };
  }
  if (kind === 'equipment') {
    return {
      empty: 'No equipment found.',
      search: 'Search equipment',
      title: 'Equipment on this service.',
    };
  }
  return {
    empty: 'No materials found.',
    search: 'Search material',
    title: 'Materials on this service.',
  };
};

export const PricebookLineItemsPanel = ({
  kind,
  priceBookId,
  queryClient,
}: PricebookLineItemsPanelProps) => {
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLine, setEditingLine] =
    useState<PriceBookItemSummaryDto | null>(null);
  const [deletingLine, setDeletingLine] =
    useState<PriceBookItemSummaryDto | null>(null);
  const copy = tabCopy(kind);
  const isOther = kind === PRICE_BOOK_LINE_OTHER;

  const listQuery = useQuery(
    {
      ...priceBookItemListQueryOptions({
        page: 1,
        pageSize: PRICEBOOK_LIST_PAGE_SIZE,
        priceBookId: priceBookId ?? undefined,
      }),
      enabled: priceBookId != null,
    },
    queryClient,
  );
  const createMutation = useMutation(
    createPriceBookItemMutationOptions(queryClient),
    queryClient,
  );
  const updateMutation = useMutation(
    updatePriceBookItemMutationOptions(queryClient),
    queryClient,
  );
  const deleteMutation = useMutation(
    deletePriceBookItemMutationOptions(queryClient),
    queryClient,
  );

  const lines = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return (listQuery.data?.items ?? []).filter((line) => {
      if (priceBookLineKind(line.notes) !== kind) return false;
      if (!needle) return true;
      const name = (line.itemCode ?? '').toLowerCase();
      const description = (line.itemDescription ?? '').toLowerCase();
      return name.includes(needle) || description.includes(needle);
    });
  }, [kind, listQuery.data?.items, search]);

  const handleEditLine = useCallback((record: PriceBookItemSummaryDto) => {
    setEditingLine(record);
    setDialogOpen(true);
  }, []);

  const handleDeleteLine = useCallback((record: PriceBookItemSummaryDto) => {
    setDeletingLine(record);
  }, []);

  const columns = useMemo(
    () => [
      column.accessor('itemCode', {
        header: isOther ? 'Type' : 'Name',
        meta: { label: isOther ? 'Type' : 'Name' },
        cell: ({ getValue }) => (
          <span className="font-medium text-action">{getValue() ?? '—'}</span>
        ),
      }),
      column.accessor('itemDescription', {
        header: 'Description',
        meta: { label: 'Description' },
        cell: ({ getValue }) => (
          <span className="line-clamp-2">{getValue()?.trim() || '—'}</span>
        ),
      }),
      column.accessor('quantity', {
        header: 'Quantity',
        meta: { align: 'right', label: 'Quantity' },
        cell: ({ getValue }) => formatQuantity(getValue()),
      }),
      column.display({
        id: 'cost',
        header: 'Cost',
        enableSorting: false,
        meta: { align: 'right', label: 'Cost' },
        cell: () => '—',
      }),
      column.display({
        id: 'price',
        header: 'Price',
        enableSorting: false,
        meta: { align: 'right', label: 'Price' },
        cell: () => '—',
      }),
      column.display({
        id: 'actions',
        header: 'Action',
        enableSorting: false,
        meta: { align: 'center', label: 'Action' },
        cell: ({ row }) => (
          <LineRowActions
            onDelete={handleDeleteLine}
            onEdit={handleEditLine}
            row={row.original}
          />
        ),
      }),
    ],
    [handleDeleteLine, handleEditLine, isOther],
  );

  const tableStatus = listQuery.isPending
    ? 'loading'
    : listQuery.isFetching
      ? 'refetching'
      : listQuery.isError
        ? 'error'
        : 'idle';

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handleAdd = () => {
    setEditingLine(null);
    setDialogOpen(true);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) setEditingLine(null);
  };

  const handleDeleteOpenChange = (open: boolean) => {
    if (!open) setDeletingLine(null);
  };

  const handleWriteError = (error: unknown) => {
    alert.error(LINE_SAVE_ERROR_TITLE, {
      description: describePricebookItemError(error),
    });
  };

  const handleSubmit = (values: PriceBookItemForm) => {
    if (
      priceBookId == null ||
      createMutation.isPending ||
      updateMutation.isPending
    ) {
      return;
    }
    if (editingLine) {
      updateMutation.mutate(
        {
          id: editingLine.id,
          body: toPriceBookItemUpdateDto(values, editingLine, kind),
        },
        {
          onError: handleWriteError,
          onSuccess: () => {
            alert.success(LINE_UPDATED_TITLE, {
              description: LINE_UPDATED_MESSAGE,
            });
            setDialogOpen(false);
            setEditingLine(null);
          },
        },
      );
      return;
    }
    const nextOrder =
      (listQuery.data?.items ?? []).reduce(
        (max, line) => Math.max(max, line.displayOrder),
        0,
      ) + 1;
    createMutation.mutate(
      toPriceBookItemCreateDto(values, priceBookId, kind, nextOrder),
      {
        onError: handleWriteError,
        onSuccess: () => {
          alert.success(LINE_CREATED_TITLE, {
            description: LINE_CREATED_MESSAGE,
          });
          setDialogOpen(false);
        },
      },
    );
  };

  const handleDeleteConfirm = () => {
    if (!deletingLine || deleteMutation.isPending) return;
    deleteMutation.mutate(deletingLine.id, {
      onError: (error) => {
        alert.error(LINE_DELETE_ERROR_TITLE, {
          description: describePricebookItemError(error),
        });
      },
      onSuccess: () => {
        alert.success(LINE_DELETED_TITLE, {
          description: LINE_DELETED_MESSAGE,
        });
        setDeletingLine(null);
      },
    });
  };

  if (priceBookId == null) {
    return <Callout>{SAVE_FIRST_MESSAGE}</Callout>;
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <BodySmall color="foreground-subtle">{copy.title}</BodySmall>
        <div className="flex min-w-0 items-center gap-2">
          <DataTableSearch
            className="w-44 sm:w-56"
            label={copy.search}
            onValueChange={handleSearchChange}
            placeholder={copy.search}
            value={search}
          />
          <Button className="shrink-0" onClick={handleAdd} type="button">
            <PlusIcon className="size-3.5" />
            {ADD_ITEM_LABEL}
          </Button>
        </div>
      </div>
      <Callout>{LINE_COST_PRICE_MESSAGE}</Callout>
      <DataTable
        className="min-h-0 flex-1"
        columns={columns}
        data={lines}
        emptyState={copy.empty}
        enableRowSelection={false}
        enableSearch={false}
        errorState={
          listQuery.isError
            ? describePricebookItemError(listQuery.error)
            : undefined
        }
        getRowId={(row) => String(row.id)}
        pageSizeLabel=""
        rowLabel="entries"
        showColumnVisibility={false}
        status={priceBookId == null ? 'idle' : tableStatus}
        tableLabel={copy.title}
      />
      <PricebookLineItemDialog
        isPending={createMutation.isPending || updateMutation.isPending}
        kind={kind}
        line={editingLine}
        onOpenChange={handleDialogOpenChange}
        onSubmit={handleSubmit}
        open={dialogOpen}
      />
      <PricebookLineDeleteDialog
        isPending={deleteMutation.isPending}
        line={deletingLine}
        onConfirm={handleDeleteConfirm}
        onOpenChange={handleDeleteOpenChange}
        open={deletingLine != null}
      />
    </div>
  );
};
