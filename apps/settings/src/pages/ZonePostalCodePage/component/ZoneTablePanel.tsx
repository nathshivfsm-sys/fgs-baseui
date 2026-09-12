import { useMemo, useState } from 'react';
import type { QueryClient } from '@tanstack/react-query';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { ZoneSummaryDto } from '@cms/settings-contract';
import {
  patchZoneMutationOptions,
  zoneListQueryOptions,
  type ZoneListParams,
} from '@cms/settings-data-access';
import {
  Callout,
  createDataTableColumnHelper,
  DataTable,
  DataTableRowActions,
  type DataTableState,
  Tabs,
  TabsList,
  TabsTrigger,
} from '@cms/ui';
import { describeZoneError } from '../util';
import type { ZoneStatusFilter } from '../types';

const column = createDataTableColumnHelper<ZoneSummaryDto>();

export interface ZoneTablePanelProps {
  activeCount: number;
  inactiveCount: number;
  onEdit: (zone: ZoneSummaryDto) => void;
  queryClient: QueryClient;
}

export function ZoneTablePanel({
  activeCount,
  inactiveCount,
  onEdit,
  queryClient,
}: ZoneTablePanelProps) {
  const [status, setStatus] = useState<ZoneStatusFilter>('active');
  const [pagination, setPagination] = useState<DataTableState['pagination']>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<DataTableState['sorting']>([
    { id: 'code', desc: false },
  ]);

  const params: ZoneListParams = {
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    isActive: status === 'active',
    sortBy: sorting[0]?.id,
    sortDirection: sorting[0]?.desc ? 'desc' : 'asc',
  };

  const query = useQuery(zoneListQueryOptions(params), queryClient);
  const patchMutation = useMutation(
    patchZoneMutationOptions(queryClient),
    queryClient,
  );

  function getRowId(row: ZoneSummaryDto) {
    return String(row.id);
  }

  function handleToggleActive(zone: ZoneSummaryDto) {
    patchMutation.mutate({
      id: zone.id,
      body: { isActive: !zone.isActive },
    });
  }

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
        header: 'Zone Name',
        meta: { label: 'Zone Name' },
        cell: ({ getValue }) => getValue() ?? '—',
      }),
      column.accessor('description', {
        header: 'Description',
        enableSorting: false,
        meta: { label: 'Description' },
        cell: ({ getValue }) => getValue() ?? '—',
      }),
      column.display({
        id: 'actions',
        header: 'Actions',
        enableHiding: false,
        enableSorting: false,
        meta: { align: 'center', label: 'Actions' },
        cell: function ActionsCell({ row }) {
          function toggleActive() {
            handleToggleActive(row.original);
          }

          function editRow() {
            onEdit(row.original);
          }

          return (
            <DataTableRowActions
              actions={[
                {
                  label: row.original.isActive ? 'Deactivate' : 'Activate',
                  onSelect: toggleActive,
                },
              ]}
              editLabel={`Edit ${row.original.name ?? row.original.code ?? 'zone'}`}
              onEdit={editRow}
            />
          );
        },
      }),
    ],
    [onEdit, patchMutation],
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

  function handleStatusChange(next: string) {
    setStatus(next as ZoneStatusFilter);
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <Tabs onValueChange={handleStatusChange} value={status}>
        <TabsList bordered className="px-6">
          <TabsTrigger size="default" tone="action" value="active">
            Active ({activeCount})
          </TabsTrigger>
          <TabsTrigger size="default" tone="action" value="inactive">
            Inactive ({inactiveCount})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {query.isError ? (
        <div className="p-6">
          <Callout title="Unable to load zones" variant="error">
            {describeZoneError(query.error)}
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
            tableLabel="Zones"
          />
        </div>
      )}
    </div>
  );
}
