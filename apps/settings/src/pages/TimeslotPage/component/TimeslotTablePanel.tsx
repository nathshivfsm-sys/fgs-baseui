import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { TimeslotSummaryDto } from '@cms/settings-contract';
import { timeslotListQueryOptions } from '@cms/settings-data-access';
import {
  Badge,
  buildDataTableListRequest,
  createDataTableColumnHelper,
  DataTable,
  DataTableRowActions,
  DataTableYesNoCell,
  resolveDataTableRows,
  type DataTableDataMode,
  type DataTableState,
} from '@cms/ui';
import { CatalogStatusTabBar } from '../../../shared';
import {
  LOAD_TIMESLOTS_ERROR_TITLE,
  NO_TIMESLOTS_FOUND,
  SEARCH_TIMESLOTS_PLACEHOLDER,
  TIMESLOT_PAGE_SIZE,
} from '../constant';
import type {
  TimeslotListFilters,
  TimeslotStatusFilter,
  TimeslotTablePanelProps,
} from '../types';
import {
  describeTimeslotError,
  formatClockLabel,
  formatDurationLabel,
} from '../util';
import { TimeslotListFilter } from './TimeslotListFilter';

const column = createDataTableColumnHelper<TimeslotSummaryDto>();
const LIST_DATA_MODE: DataTableDataMode = 'client';

const yesNoBadge = (value: boolean) => (
  <Badge size="sm" tone={value ? 'success' : 'neutral'} variant="soft">
    {value ? 'Yes' : 'No'}
  </Badge>
);

export const TimeslotTablePanel = ({
  activeCount,
  appliedFilters,
  inactiveCount,
  onDeactivate,
  onEdit,
  onFiltersApply,
  onFiltersClear,
  queryClient,
  zoneOptions,
}: TimeslotTablePanelProps) => {
  const [status, setStatus] = useState<TimeslotStatusFilter>('active');
  const [pagination, setPagination] = useState<DataTableState['pagination']>({
    pageIndex: 0,
    pageSize: TIMESLOT_PAGE_SIZE,
  });
  const [sorting, setSorting] = useState<DataTableState['sorting']>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const zoneFilter = appliedFilters.zoneId;
  const zoneNames = useMemo(
    () => new Map(zoneOptions.map((option) => [option.value, option.label])),
    [zoneOptions],
  );

  const listRequest = buildDataTableListRequest({
    mode: LIST_DATA_MODE,
    pagination,
    sorting,
    globalFilter,
  });

  const query = useQuery(
    timeslotListQueryOptions({
      ...listRequest,
      isActive: status === 'active',
    }),
    queryClient,
  );

  const columns = useMemo(
    () => [
      column.accessor('code', {
        header: 'Code',
        enableSorting: false,
        meta: { label: 'Code' },
        cell: ({ getValue }) => (
          <span className="font-medium text-action">{getValue() ?? '—'}</span>
        ),
      }),
      column.accessor('name', {
        header: 'Name',
        enableSorting: false,
        meta: { label: 'Name' },
        cell: ({ getValue }) => getValue() ?? '—',
      }),
      column.accessor('fgsSetupZoneId', {
        header: 'Zone',
        enableSorting: false,
        meta: { label: 'Zone' },
        cell: ({ getValue }) => {
          const zoneId = getValue();
          if (zoneId == null) return '—';
          return zoneNames.get(String(zoneId)) ?? '—';
        },
      }),
      column.accessor('beginTime', {
        header: 'Begin Time',
        meta: { label: 'Begin Time' },
        cell: ({ getValue }) => formatClockLabel(getValue()),
      }),
      column.accessor('endTime', {
        header: 'End Time',
        enableSorting: false,
        meta: { label: 'End Time' },
        cell: ({ getValue }) => formatClockLabel(getValue()),
      }),
      column.accessor('markTechArrivedLateAfter', {
        header: 'Late After',
        enableSorting: false,
        meta: { label: 'Late After' },
        cell: ({ getValue }) => formatDurationLabel(getValue()),
      }),
      column.accessor('markWorkOrderDelayedCompletionAfter', {
        header: 'Delayed After',
        enableSorting: false,
        meta: { label: 'Delayed After' },
        cell: ({ getValue }) => formatDurationLabel(getValue()),
      }),
      column.accessor('isMobileVisible', {
        header: 'Mobile Visible',
        enableSorting: false,
        meta: { align: 'center', label: 'Mobile Visible' },
        cell: ({ getValue }) => (
          <span className="flex w-full justify-center">
            {yesNoBadge(getValue())}
          </span>
        ),
      }),
      column.accessor('isCustomerPortalVisible', {
        header: 'Customer Portal',
        enableSorting: false,
        meta: { align: 'center', label: 'Customer Portal' },
        cell: ({ getValue }) => <DataTableYesNoCell value={getValue()} />,
      }),
      column.display({
        id: 'actions',
        header: 'Actions',
        enableHiding: false,
        enableSorting: false,
        meta: { align: 'center', label: 'Actions' },
        cell: function ActionsCell({ row }) {
          const record = row.original;
          const displayName =
            record.name?.trim() || record.code?.trim() || 'time slot';

          const handleEdit = () => {
            onEdit(record);
          };

          const handleDeactivate = () => {
            onDeactivate(record);
          };

          if (!record.isActive) {
            return (
              <DataTableRowActions
                editLabel={`Edit ${displayName}`}
                onEdit={handleEdit}
              />
            );
          }

          return (
            <DataTableRowActions
              deleteLabel={`Deactivate ${displayName}`}
              editLabel={`Edit ${displayName}`}
              onDelete={handleDeactivate}
              onEdit={handleEdit}
            />
          );
        },
      }),
    ],
    [onDeactivate, onEdit, zoneNames],
  );

  const { rows: items, manual } = resolveDataTableRows({
    mode: LIST_DATA_MODE,
    pagination,
    items: query.data?.items ?? [],
    totalCount: query.data?.totalCount ?? 0,
    filterItems: zoneFilter
      ? (loaded) =>
          loaded.filter(
            (item) => String(item.fgsSetupZoneId ?? '') === zoneFilter,
          )
      : undefined,
  });
  const tableStatus = query.isPending
    ? 'loading'
    : query.isFetching
      ? 'refetching'
      : query.isError
        ? 'error'
        : 'idle';
  const loadErrorCopy = query.isError
    ? describeTimeslotError(query.error)
    : LOAD_TIMESLOTS_ERROR_TITLE;

  const handleStatusChange = (next: TimeslotStatusFilter) => {
    setStatus(next);
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const handleSearchChange = (value: string) => {
    setGlobalFilter(value);
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const handleFiltersApply = (filters: TimeslotListFilters) => {
    onFiltersApply(filters);
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const handleFiltersClear = () => {
    onFiltersClear();
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const formatPageSize = (size: number) => `${size} per page`;

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <CatalogStatusTabBar
        activeCount={activeCount}
        filter={
          <TimeslotListFilter
            appliedFilters={appliedFilters}
            onApply={handleFiltersApply}
            onClear={handleFiltersClear}
            zoneOptions={zoneOptions}
          />
        }
        inactiveCount={inactiveCount}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        searchPlaceholder={SEARCH_TIMESLOTS_PLACEHOLDER}
        searchValue={globalFilter}
        status={status}
      />
      <div className="min-h-0 min-w-0 flex-1 px-2 pt-2 sm:px-4">
        <DataTable
          className="min-h-0 flex-1 rounded-none border-0"
          columns={columns}
          data={items}
          emptyState={NO_TIMESLOTS_FOUND}
          enableRowSelection={false}
          enableSearch={false}
          errorState={query.isError ? loadErrorCopy : undefined}
          getRowId={(row) => String(row.id)}
          manual={manual}
          onGlobalFilterChange={setGlobalFilter}
          onPaginationChange={setPagination}
          onSortingChange={setSorting}
          formatPageSizeOption={formatPageSize}
          pageSizeLabel=""
          rowLabel="entries"
          showColumnVisibility={false}
          state={{ globalFilter, pagination, sorting }}
          status={tableStatus}
          tableLabel="Time slots"
        />
      </div>
    </div>
  );
};
