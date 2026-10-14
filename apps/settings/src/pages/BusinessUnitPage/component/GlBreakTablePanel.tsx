import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { GlBreakSummaryDto } from '@cms/settings-contract';
import {
  glBreakListQueryOptions,
  patchGlBreakMutationOptions,
} from '@cms/settings-data-access';
import {
  buildDataTableListRequest,
  Callout,
  createDataTableColumnHelper,
  DataTable,
  DataTableRowActions,
  DataTableStackedCell,
  resolveDataTableRows,
  type DataTableDataMode,
  type DataTableState,
} from '@cms/ui';
import { CatalogStatusTabBar } from '../../../shared';
import type { CatalogStatusFilter, GlBreakTablePanelProps } from '../types';
import { describeGlBreakError, formatGlBreakAddress } from '../util';

const column = createDataTableColumnHelper<GlBreakSummaryDto>();
const LIST_DATA_MODE: DataTableDataMode = 'client';

export const GlBreakTablePanel = ({
  activeCount,
  addLabel,
  breakLevel,
  inactiveCount,
  nameHeader,
  onAdd,
  onEdit,
  queryClient,
  tableLabel,
}: GlBreakTablePanelProps) => {
  const [status, setStatus] = useState<CatalogStatusFilter>('active');
  const [pagination, setPagination] = useState<DataTableState['pagination']>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<DataTableState['sorting']>([
    { id: 'code', desc: false },
  ]);

  const listRequest = buildDataTableListRequest({
    mode: LIST_DATA_MODE,
    pagination,
    sorting,
    serverManual: { sorting: true },
  });

  const query = useQuery(
    glBreakListQueryOptions({
      ...listRequest,
      isActive: status === 'active',
      breakLevel,
    }),
    queryClient,
  );
  const patchMutation = useMutation(
    patchGlBreakMutationOptions(queryClient),
    queryClient,
  );

  const getRowId = (row: GlBreakSummaryDto) => String(row.id);

  const handleStatusChange = (next: CatalogStatusFilter) => {
    setStatus(next);
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const columns = useMemo(
    () => [
      column.accessor('code', {
        header: 'Code',
        meta: { label: 'Code' },
        cell: ({ getValue }) => (
          <span className="font-medium text-action">{getValue() ?? '—'}</span>
        ),
      }),
      column.accessor('name', {
        header: nameHeader,
        meta: { label: nameHeader, wrap: true },
        cell: ({ getValue }) => getValue() ?? '—',
      }),
      column.accessor('address', {
        header: 'Address',
        enableSorting: false,
        meta: { label: 'Address', wrap: true },
        cell: ({ getValue }) => {
          const lines = formatGlBreakAddress(getValue());
          if (!lines) return '—';
          return (
            <DataTableStackedCell
              primary={lines.primary}
              secondary={lines.secondary}
              tone="muted"
            />
          );
        },
      }),
      column.accessor('breakLabel', {
        header: 'Invoice Template',
        enableSorting: false,
        meta: { label: 'Invoice Template' },
        cell: ({ getValue }) => getValue() ?? '—',
      }),
      column.display({
        id: 'actions',
        header: 'Actions',
        enableHiding: false,
        enableSorting: false,
        meta: { align: 'center', label: 'Actions' },
        cell: ({ row }) => {
          const handleEditRow = () => {
            onEdit(row.original);
          };
          const handleDeactivate = () => {
            patchMutation.mutate({
              id: row.original.id,
              body: { isActive: false },
            });
          };
          const handleActivate = () => {
            patchMutation.mutate({
              id: row.original.id,
              body: { isActive: true },
            });
          };
          const rowName = row.original.name ?? row.original.code ?? 'record';

          return (
            <DataTableRowActions
              actions={
                row.original.isActive
                  ? undefined
                  : [{ label: 'Activate', onSelect: handleActivate }]
              }
              deleteLabel={`Deactivate ${rowName}`}
              editLabel={`Edit ${rowName}`}
              onDelete={row.original.isActive ? handleDeactivate : undefined}
              onEdit={handleEditRow}
            />
          );
        },
      }),
    ],
    [nameHeader, onEdit, patchMutation],
  );

  const { rows: items, manual } = resolveDataTableRows({
    mode: LIST_DATA_MODE,
    pagination,
    items: query.data?.items ?? [],
    totalCount: query.data?.totalCount ?? 0,
    serverManual: { sorting: true },
  });

  const tableStatus = query.isPending
    ? 'loading'
    : query.isFetching
      ? 'refetching'
      : query.isError
        ? 'error'
        : 'idle';

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <CatalogStatusTabBar
        activeCount={activeCount}
        addLabel={addLabel}
        inactiveCount={inactiveCount}
        onAdd={onAdd}
        onStatusChange={handleStatusChange}
        status={status}
      />

      {query.isError ? (
        <div className="p-6">
          <Callout
            title={`Unable to load ${tableLabel.toLowerCase()}`}
            variant="error"
          >
            {describeGlBreakError(query.error)}
          </Callout>
        </div>
      ) : (
        <div className="min-w-0 flex-1 px-2 pt-2 sm:px-4">
          <DataTable
            className="rounded-none border-0"
            columns={columns}
            data={items}
            enableRowSelection={false}
            enableSearch={false}
            getRowId={getRowId}
            manual={manual}
            onPaginationChange={setPagination}
            onSortingChange={setSorting}
            rowLabel="entries"
            showColumnVisibility={false}
            state={{ pagination, sorting }}
            status={tableStatus}
            tableLabel={tableLabel}
          />
        </div>
      )}
    </div>
  );
};
