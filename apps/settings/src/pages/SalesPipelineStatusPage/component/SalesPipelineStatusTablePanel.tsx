import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { SalesPipelineStatusSummaryDto } from '@cms/settings-contract';
import { salesPipelineStatusListQueryOptions } from '@cms/settings-data-access';
import {
  buildDataTableListRequest,
  createDataTableColumnHelper,
  DataTable,
  DataTableRowActions,
  resolveDataTableRows,
  type DataTableDataMode,
  type DataTableState,
} from '@cms/ui';
import { CatalogStatusTabBar } from '../../../shared';
import {
  LOAD_STATUSES_ERROR_TITLE,
  NO_STATUSES_FOUND,
  NO_STATUSES_SEARCH_FOUND,
  SALES_PIPELINE_STATUS_PAGE_SIZE,
  SEARCH_STATUSES_PLACEHOLDER,
} from '../constant';
import type {
  SalesPipelineStatusFilter,
  SalesPipelineStatusTablePanelProps,
} from '../types';
import { describeSalesPipelineStatusError } from '../util';
import { PipelineBooleanCell } from './PipelineBooleanCell';

const column = createDataTableColumnHelper<SalesPipelineStatusSummaryDto>();
const LIST_DATA_MODE: DataTableDataMode = 'client';

export const SalesPipelineStatusTablePanel = ({
  activeCount,
  inactiveCount,
  onDeactivate,
  onEdit,
  queryClient,
}: SalesPipelineStatusTablePanelProps) => {
  const [status, setStatus] = useState<SalesPipelineStatusFilter>('active');
  const [pagination, setPagination] = useState<DataTableState['pagination']>({
    pageIndex: 0,
    pageSize: SALES_PIPELINE_STATUS_PAGE_SIZE,
  });
  const [sorting, setSorting] = useState<DataTableState['sorting']>([
    { id: 'displayOrder', desc: false },
  ]);
  const [globalFilter, setGlobalFilter] = useState('');

  const listRequest = buildDataTableListRequest({
    mode: LIST_DATA_MODE,
    pagination,
    sorting,
    globalFilter,
    serverManual: { sorting: true },
  });

  const query = useQuery(
    salesPipelineStatusListQueryOptions({
      ...listRequest,
      isActive: status === 'active',
    }),
    queryClient,
  );

  const columns = useMemo(
    () => [
      column.accessor('statusCode', {
        header: 'Status Code',
        enableSorting: true,
        meta: { label: 'Status Code' },
        cell: ({ getValue }) => (
          <span className="font-medium text-action">{getValue() ?? '—'}</span>
        ),
      }),
      column.accessor('statusName', {
        header: 'Status Name',
        enableSorting: true,
        meta: { label: 'Status Name' },
        cell: ({ getValue }) => getValue() ?? '—',
      }),
      column.accessor('description', {
        header: 'Description',
        enableSorting: false,
        meta: { label: 'Description' },
        cell: ({ getValue }) => (
          <span className="line-clamp-2 text-foreground-subtle">
            {getValue()?.trim() || '—'}
          </span>
        ),
      }),
      column.accessor('appliesToLead', {
        header: 'Applies To Lead',
        enableSorting: false,
        meta: { align: 'center', label: 'Applies To Lead' },
        cell: ({ getValue }) => <PipelineBooleanCell value={getValue()} />,
      }),
      column.accessor('appliesToOpportunity', {
        header: 'Applies To Opportunity',
        enableSorting: false,
        meta: { align: 'center', label: 'Applies To Opportunity' },
        cell: ({ getValue }) => <PipelineBooleanCell value={getValue()} />,
      }),
      column.accessor('isTerminal', {
        header: 'Is Terminal',
        enableSorting: false,
        meta: { align: 'center', label: 'Is Terminal' },
        cell: ({ getValue }) => <PipelineBooleanCell value={getValue()} />,
      }),
      column.accessor('allowManualSelection', {
        header: 'Allow Manual Selection',
        enableSorting: false,
        meta: { align: 'center', label: 'Allow Manual Selection' },
        cell: ({ getValue }) => <PipelineBooleanCell value={getValue()} />,
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
            record.statusName?.trim() ||
            record.statusCode?.trim() ||
            'pipeline status';

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
    serverManual: { sorting: true },
  });
  const tableStatus = query.isPending
    ? 'loading'
    : query.isFetching
      ? 'refetching'
      : query.isError
        ? 'error'
        : 'idle';
  const loadErrorCopy = query.isError
    ? describeSalesPipelineStatusError(query.error)
    : LOAD_STATUSES_ERROR_TITLE;
  const emptyState = globalFilter.trim()
    ? NO_STATUSES_SEARCH_FOUND
    : NO_STATUSES_FOUND;

  const handleStatusChange = (next: SalesPipelineStatusFilter) => {
    setStatus(next);
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const handleSearchChange = (value: string) => {
    setGlobalFilter(value);
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const formatPageSize = (size: number) => `${size} per page`;

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <CatalogStatusTabBar
        activeCount={activeCount}
        inactiveCount={inactiveCount}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        searchPlaceholder={SEARCH_STATUSES_PLACEHOLDER}
        searchValue={globalFilter}
        status={status}
      />
      <div className="min-h-0 min-w-0 flex-1 px-2 pt-2 sm:px-4">
        <DataTable
          className="min-h-0 flex-1 rounded-none border-0"
          columns={columns}
          data={items}
          emptyState={emptyState}
          enableRowSelection={false}
          enableSearch={false}
          errorState={query.isError ? loadErrorCopy : undefined}
          formatPageSizeOption={formatPageSize}
          getRowId={(row) => String(row.id)}
          manual={manual}
          onGlobalFilterChange={setGlobalFilter}
          onPaginationChange={setPagination}
          onSortingChange={setSorting}
          pageSizeLabel=""
          rowLabel="entries"
          showColumnVisibility={false}
          state={{ globalFilter, pagination, sorting }}
          status={tableStatus}
          tableLabel="Sales pipeline statuses"
        />
      </div>
    </div>
  );
};
