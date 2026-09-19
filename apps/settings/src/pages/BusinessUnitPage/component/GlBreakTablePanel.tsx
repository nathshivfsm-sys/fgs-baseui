import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { GlBreakListParams, GlBreakSummaryDto } from '@cms/settings-contract';
import {
  glBreakListQueryOptions,
  patchGlBreakMutationOptions,
} from '@cms/settings-data-access';
import {
  Button,
  Callout,
  createDataTableColumnHelper,
  DataTable,
  DataTableRowActions,
  DataTableStackedCell,
  PlusIcon,
  Tabs,
  TabsList,
  TabsTrigger,
  type DataTableState,
} from '@cms/ui';
import type { CatalogStatusFilter, GlBreakTablePanelProps } from '../types';
import { describeGlBreakError, formatGlBreakAddress } from '../util';

const column = createDataTableColumnHelper<GlBreakSummaryDto>();

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

  const params: GlBreakListParams = {
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    isActive: status === 'active',
    breakLevel,
    sortBy: sorting[0]?.id,
    sortDirection: sorting[0]?.desc ? 'desc' : 'asc',
  };

  const query = useQuery(glBreakListQueryOptions(params), queryClient);
  const patchMutation = useMutation(
    patchGlBreakMutationOptions(queryClient),
    queryClient,
  );

  const getRowId = (row: GlBreakSummaryDto) => String(row.id);

  const handleStatusChange = (next: string) => {
    setStatus(next as CatalogStatusFilter);
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

  const items = query.data?.items ?? [];
  const totalCount = query.data?.totalCount ?? 0;
  const tableStatus = query.isPending
    ? 'loading'
    : query.isFetching
      ? 'refetching'
      : query.isError
        ? 'error'
        : 'idle';

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <div className="flex items-end justify-between gap-3 border-b border-border">
        <Tabs
          className="min-w-0 flex-1"
          onValueChange={handleStatusChange}
          value={status}
        >
          <TabsList bordered className="border-0 px-6">
            <TabsTrigger size="default" tone="action" value="active">
              Active ({activeCount})
            </TabsTrigger>
            <TabsTrigger size="default" tone="action" value="inactive">
              Inactive ({inactiveCount})
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Button className="my-2 mr-6 shrink-0" onClick={onAdd} type="button">
          <PlusIcon className="size-3.5" />
          {addLabel}
        </Button>
      </div>

      {query.isError ? (
        <div className="p-6">
          <Callout title={`Unable to load ${tableLabel.toLowerCase()}`} variant="error">
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
            manual={{
              pagination: true,
              sorting: true,
              pageCount: Math.max(
                1,
                Math.ceil(totalCount / pagination.pageSize),
              ),
              rowCount: totalCount,
            }}
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
