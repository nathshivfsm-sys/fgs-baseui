import { useMemo, useState } from 'react';
import type { SalesActivityTypeSummaryDto } from '@cms/settings-contract';
import {
  createDataTableColumnHelper,
  DataTable,
  DataTableBooleanCell,
  DataTableRowActions,
  resolveDataTableRows,
  type DataTableDataMode,
  type DataTableState,
} from '@cms/ui';
import { CatalogStatusTabBar } from '../../../shared';
import {
  APPLIES_TO_LEAD_COLUMN,
  APPLIES_TO_OPPORTUNITY_COLUMN,
  LOAD_ACTIVITIES_ERROR_TITLE,
  MANUAL_SELECTION_LABEL,
  NO_ACTIVITIES_FOUND,
  NO_ACTIVITIES_SEARCH_FOUND,
  SALES_ACTIVITIES_PAGE_SIZE,
  SEARCH_ACTIVITIES_PLACEHOLDER,
} from '../constant';
import type {
  SalesActivitiesStatusFilter,
  SalesActivityTablePanelProps,
} from '../types';
import { describeSalesActivityError } from '../util';

const column = createDataTableColumnHelper<SalesActivityTypeSummaryDto>();
const LIST_DATA_MODE: DataTableDataMode = 'client';

export const SalesActivityTablePanel = ({
  activeCount,
  error,
  inactiveCount,
  isError,
  isFetching,
  isPending,
  items,
  onDelete,
  onEdit,
}: SalesActivityTablePanelProps) => {
  const [status, setStatus] = useState<SalesActivitiesStatusFilter>('active');
  const [pagination, setPagination] = useState<DataTableState['pagination']>({
    pageIndex: 0,
    pageSize: SALES_ACTIVITIES_PAGE_SIZE,
  });
  const [sorting, setSorting] = useState<DataTableState['sorting']>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const statusItems = useMemo(
    () => items.filter((item) => item.isActive === (status === 'active')),
    [items, status],
  );

  const columns = useMemo(
    () => [
      column.accessor('activityTypeCode', {
        header: 'Activity Code',
        enableSorting: true,
        meta: { label: 'Activity Code' },
        cell: ({ getValue }) => (
          <span className="font-medium text-action">{getValue() ?? '—'}</span>
        ),
      }),
      column.accessor('activityTypeName', {
        header: 'Activity Name',
        enableSorting: true,
        meta: { label: 'Activity Name' },
        cell: ({ getValue }) => getValue() ?? '—',
      }),
      column.accessor('description', {
        header: 'Description',
        enableSorting: false,
        meta: { label: 'Description' },
        cell: ({ getValue }) => (
          <span className="line-clamp-2">{getValue()?.trim() || '—'}</span>
        ),
      }),
      column.accessor('appliesToLead', {
        header: APPLIES_TO_LEAD_COLUMN,
        enableSorting: false,
        meta: { align: 'center', label: APPLIES_TO_LEAD_COLUMN },
        cell: ({ getValue }) => <DataTableBooleanCell value={getValue()} />,
      }),
      column.accessor('appliesToOpportunity', {
        header: APPLIES_TO_OPPORTUNITY_COLUMN,
        enableSorting: false,
        meta: { align: 'center', label: APPLIES_TO_OPPORTUNITY_COLUMN },
        cell: ({ getValue }) => <DataTableBooleanCell value={getValue()} />,
      }),
      column.accessor('allowManualSelection', {
        header: MANUAL_SELECTION_LABEL,
        enableSorting: false,
        meta: { align: 'center', label: MANUAL_SELECTION_LABEL },
        cell: ({ getValue }) => <DataTableBooleanCell value={getValue()} />,
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
            record.activityTypeName?.trim() ||
            record.activityTypeCode?.trim() ||
            'activity';

          const handleEdit = () => {
            onEdit(record);
          };

          const handleDelete = () => {
            onDelete(record);
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
              deleteLabel={`Delete ${displayName}`}
              editLabel={`Edit ${displayName}`}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          );
        },
      }),
    ],
    [onDelete, onEdit],
  );

  const { rows, manual } = resolveDataTableRows({
    mode: LIST_DATA_MODE,
    pagination,
    items: statusItems,
    totalCount: statusItems.length,
  });
  const tableStatus = isPending
    ? 'loading'
    : isFetching
      ? 'refetching'
      : isError
        ? 'error'
        : 'idle';
  const loadErrorCopy = isError
    ? describeSalesActivityError(error)
    : LOAD_ACTIVITIES_ERROR_TITLE;
  const emptyState = globalFilter.trim()
    ? NO_ACTIVITIES_SEARCH_FOUND
    : NO_ACTIVITIES_FOUND;

  const handleStatusChange = (next: SalesActivitiesStatusFilter) => {
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
        searchPlaceholder={SEARCH_ACTIVITIES_PLACEHOLDER}
        searchValue={globalFilter}
        status={status}
      />
      <div className="min-h-0 min-w-0 flex-1 px-2 pt-2 sm:px-4">
        <DataTable
          className="min-h-0 flex-1 rounded-none border-0"
          columns={columns}
          data={rows}
          emptyState={emptyState}
          enableRowSelection={false}
          enableSearch={false}
          errorState={isError ? loadErrorCopy : undefined}
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
          tableLabel="Sales activities"
        />
      </div>
    </div>
  );
};
