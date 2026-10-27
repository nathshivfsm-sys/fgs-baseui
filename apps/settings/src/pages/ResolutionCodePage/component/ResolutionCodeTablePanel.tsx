import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { ResolutionCodeSummaryDto } from '@cms/settings-contract';
import { resolutionCodeListQueryOptions } from '@cms/settings-data-access';
import {
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
  LOAD_RESOLUTION_CODES_ERROR_TITLE,
  NO_RESOLUTION_CODES_FOUND,
  SEARCH_RESOLUTION_CODES_PLACEHOLDER,
  RESOLUTION_CODE_PAGE_SIZE,
} from '../constant';
import type {
  ResolutionCodeListFilters,
  ResolutionCodeStatusFilter,
  ResolutionCodeTablePanelProps,
} from '../types';
import { describeResolutionCodeError, findResolutionTypeLabel } from '../util';
import { ResolutionCodeListFilter } from './ResolutionCodeListFilter';

const column = createDataTableColumnHelper<ResolutionCodeSummaryDto>();
const LIST_DATA_MODE: DataTableDataMode = 'client';

export const ResolutionCodeTablePanel = ({
  activeCount,
  appliedFilters,
  inactiveCount,
  onDeactivate,
  onEdit,
  onFiltersApply,
  onFiltersClear,
  queryClient,
}: ResolutionCodeTablePanelProps) => {
  const [status, setStatus] = useState<ResolutionCodeStatusFilter>('active');
  const [pagination, setPagination] = useState<DataTableState['pagination']>({
    pageIndex: 0,
    pageSize: RESOLUTION_CODE_PAGE_SIZE,
  });
  const [globalFilter, setGlobalFilter] = useState('');
  const typeFilter = appliedFilters.typeId;

  const listRequest = buildDataTableListRequest({
    mode: LIST_DATA_MODE,
    pagination,
    globalFilter,
  });

  const query = useQuery(
    resolutionCodeListQueryOptions({
      ...listRequest,
      isActive: status === 'active',
    }),
    queryClient,
  );

  const columns = useMemo(
    () => [
      column.accessor('resolutionCode', {
        header: 'Code',
        enableSorting: false,
        meta: { label: 'Code' },
        cell: ({ getValue }) => (
          <span className="font-medium text-action">{getValue() ?? '—'}</span>
        ),
      }),
      column.accessor('resolutionName', {
        header: 'Name',
        enableSorting: false,
        meta: { label: 'Name' },
        cell: ({ getValue }) => getValue() ?? '—',
      }),
      column.accessor('gloResolutionTypeId', {
        header: 'Type',
        enableSorting: false,
        meta: { label: 'Type' },
        cell: ({ getValue }) => findResolutionTypeLabel(getValue()),
      }),
      column.accessor('isMobileVisible', {
        header: 'Mobile Visible',
        enableSorting: false,
        meta: { align: 'center', label: 'Mobile Visible' },
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
            record.resolutionName?.trim() ||
            record.resolutionCode?.trim() ||
            'resolution code';

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
    [onDeactivate, onEdit],
  );

  const { rows: items, manual } = resolveDataTableRows({
    mode: LIST_DATA_MODE,
    pagination,
    items: query.data?.items ?? [],
    totalCount: query.data?.totalCount ?? 0,
    filterItems: typeFilter
      ? (loaded) =>
          loaded.filter(
            (item) => String(item.gloResolutionTypeId) === typeFilter,
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
    ? describeResolutionCodeError(query.error)
    : LOAD_RESOLUTION_CODES_ERROR_TITLE;

  const handleStatusChange = (next: ResolutionCodeStatusFilter) => {
    setStatus(next);
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const handleSearchChange = (value: string) => {
    setGlobalFilter(value);
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const handleFiltersApply = (filters: ResolutionCodeListFilters) => {
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
          <ResolutionCodeListFilter
            appliedFilters={appliedFilters}
            onApply={handleFiltersApply}
            onClear={handleFiltersClear}
          />
        }
        inactiveCount={inactiveCount}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        searchPlaceholder={SEARCH_RESOLUTION_CODES_PLACEHOLDER}
        searchValue={globalFilter}
        status={status}
      />
      <div className="min-h-0 min-w-0 flex-1 px-2 pt-2 sm:px-4">
        <DataTable
          className="min-h-0 flex-1 rounded-none border-0"
          columns={columns}
          data={items}
          emptyState={NO_RESOLUTION_CODES_FOUND}
          enableRowSelection={false}
          enableSearch={false}
          errorState={query.isError ? loadErrorCopy : undefined}
          getRowId={(row) => String(row.id)}
          manual={manual}
          onGlobalFilterChange={setGlobalFilter}
          onPaginationChange={setPagination}
          formatPageSizeOption={formatPageSize}
          pageSizeLabel=""
          rowLabel="entries"
          showColumnVisibility={false}
          state={{ globalFilter, pagination }}
          status={tableStatus}
          tableLabel="Time slots"
        />
      </div>
    </div>
  );
};
