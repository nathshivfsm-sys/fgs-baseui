import { useMemo, useState } from 'react';
import type { QueryClient } from '@tanstack/react-query';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { ZoneSummaryDto } from '@cms/settings-contract';
import {
  patchZoneMutationOptions,
  zoneListQueryOptions,
} from '@cms/settings-data-access';
import {
  buildDataTableListRequest,
  createDataTableColumnHelper,
  DataTable,
  DataTableRowActions,
  resolveDataTableRows,
  type DataTableDataMode,
  type DataTableState,
} from '@cms/ui';
import {
  ADD_ZONE_LABEL,
  LOAD_ZONES_ERROR_TITLE,
  LOAD_ZONES_ERROR_TOAST_ID,
} from '../constant';
import { describeZoneError } from '../util';
import type { ZoneStatusFilter } from '../types';
import { CatalogStatusTabBar } from '../../../shared';
import { useCatalogLoadToast } from './use-catalog-load-toast';

const column = createDataTableColumnHelper<ZoneSummaryDto>();
const LIST_DATA_MODE: DataTableDataMode = 'client';

export interface ZoneTablePanelProps {
  activeCount: number;
  inactiveCount: number;
  onAdd: () => void;
  onEdit: (zone: ZoneSummaryDto) => void;
  queryClient: QueryClient;
}

export function ZoneTablePanel({
  activeCount,
  inactiveCount,
  onAdd,
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

  const listRequest = buildDataTableListRequest({
    mode: LIST_DATA_MODE,
    pagination,
    sorting,
    serverManual: { sorting: true },
  });

  const query = useQuery(
    zoneListQueryOptions({
      ...listRequest,
      isActive: status === 'active',
    }),
    queryClient,
  );
  const patchMutation = useMutation(
    patchZoneMutationOptions(queryClient),
    queryClient,
  );
  useCatalogLoadToast(
    query,
    LOAD_ZONES_ERROR_TITLE,
    describeZoneError,
    LOAD_ZONES_ERROR_TOAST_ID,
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

  function handleStatusChange(next: ZoneStatusFilter) {
    setStatus(next);
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <CatalogStatusTabBar
        activeCount={activeCount}
        addLabel={ADD_ZONE_LABEL}
        inactiveCount={inactiveCount}
        onAdd={onAdd}
        onStatusChange={handleStatusChange}
        status={status}
      />

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
          tableLabel="Zones"
        />
      </div>
    </div>
  );
}
