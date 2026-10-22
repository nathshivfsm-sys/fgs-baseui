import { useMemo, useState } from 'react';
import type { SalesActivityOutcomeSummaryDto } from '@cms/settings-contract';
import {
  createDataTableColumnHelper,
  DataTable,
  DataTableRowActions,
  resolveDataTableRows,
  type DataTableDataMode,
  type DataTableState,
} from '@cms/ui';
import { CatalogStatusTabBar } from '../../../shared';
import {
  APPLIES_TO_LEAD_COLUMN,
  APPLIES_TO_OPPORTUNITY_COLUMN,
  LOAD_OUTCOMES_ERROR_TITLE,
  MANUAL_SELECTION_LABEL,
  NO_OUTCOMES_FOUND,
  NO_OUTCOMES_SEARCH_FOUND,
  REQUIRED_COMMENT_LABEL,
  SALES_ACTIVITIES_PAGE_SIZE,
  SEARCH_OUTCOMES_PLACEHOLDER,
  TERMINAL_LABEL,
} from '../constant';
import type {
  SalesActivitiesStatusFilter,
  SalesActivityOutcomeTablePanelProps,
} from '../types';
import { describeSalesActivityOutcomeError } from '../util';
import { BooleanCell } from './BooleanCell';

const column = createDataTableColumnHelper<SalesActivityOutcomeSummaryDto>();
const LIST_DATA_MODE: DataTableDataMode = 'client';

export const SalesActivityOutcomeTablePanel = ({
  activeCount,
  error,
  inactiveCount,
  isError,
  isFetching,
  isPending,
  items,
  onDelete,
  onEdit,
  statusCodeById,
}: SalesActivityOutcomeTablePanelProps) => {
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
      column.accessor('outcomeCode', {
        header: 'Outcome Code',
        enableSorting: true,
        meta: { label: 'Outcome Code' },
        cell: ({ getValue }) => (
          <span className="font-medium text-action">{getValue() ?? '—'}</span>
        ),
      }),
      column.accessor('outcomeName', {
        header: 'Outcome Name',
        enableSorting: true,
        meta: { label: 'Outcome Name' },
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
        header: APPLIES_TO_LEAD_COLUMN,
        enableSorting: false,
        meta: { align: 'center', label: APPLIES_TO_LEAD_COLUMN },
        cell: ({ getValue }) => <BooleanCell value={getValue()} />,
      }),
      column.accessor('appliesToOpportunity', {
        header: APPLIES_TO_OPPORTUNITY_COLUMN,
        enableSorting: false,
        meta: { align: 'center', label: APPLIES_TO_OPPORTUNITY_COLUMN },
        cell: ({ getValue }) => <BooleanCell value={getValue()} />,
      }),
      column.accessor('allowManualSelection', {
        header: MANUAL_SELECTION_LABEL,
        enableSorting: false,
        meta: { align: 'center', label: MANUAL_SELECTION_LABEL },
        cell: ({ getValue }) => <BooleanCell value={getValue()} />,
      }),
      column.accessor('nextSalesPipelineStatusId', {
        header: 'Next Sales Status',
        enableSorting: false,
        meta: { align: 'center', label: 'Next Sales Status' },
        cell: ({ getValue }) => {
          const id = getValue();
          if (id == null) return '—';
          return statusCodeById.get(id) ?? '—';
        },
      }),
      column.accessor('isTerminal', {
        header: TERMINAL_LABEL,
        enableSorting: false,
        meta: { align: 'center', label: TERMINAL_LABEL },
        cell: ({ getValue }) => <BooleanCell value={getValue()} />,
      }),
      column.accessor('requireComment', {
        header: REQUIRED_COMMENT_LABEL,
        enableSorting: false,
        meta: { align: 'center', label: REQUIRED_COMMENT_LABEL },
        cell: ({ getValue }) => <BooleanCell value={getValue()} />,
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
            record.outcomeName?.trim() ||
            record.outcomeCode?.trim() ||
            'outcome';

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
    [onDelete, onEdit, statusCodeById],
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
    ? describeSalesActivityOutcomeError(error)
    : LOAD_OUTCOMES_ERROR_TITLE;
  const emptyState = globalFilter.trim()
    ? NO_OUTCOMES_SEARCH_FOUND
    : NO_OUTCOMES_FOUND;

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
        searchPlaceholder={SEARCH_OUTCOMES_PLACEHOLDER}
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
          tableLabel="Activity outcomes"
        />
      </div>
    </div>
  );
};
