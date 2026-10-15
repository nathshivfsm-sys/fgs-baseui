import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { SetupDescriptionSummaryDto } from '@cms/settings-contract';
import { setupDescriptionListQueryOptions } from '@cms/settings-data-access';
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
  ADD_STANDARD_DESCRIPTION_LABEL,
  LOAD_ERROR_TITLE,
  NO_RESULTS_FOUND,
  SEARCH_PLACEHOLDER,
  STANDARD_DESCRIPTION_PAGE_SIZE,
} from '../constant';
import type {
  StandardDescriptionListFilters,
  StandardDescriptionStatusFilter,
  StandardDescriptionTablePanelProps,
} from '../types';
import { describeStandardDescriptionError, findTradeLabel } from '../util';
import { StandardDescriptionListFilter } from './StandardDescriptionListFilter';

const column = createDataTableColumnHelper<SetupDescriptionSummaryDto>();
const LIST_DATA_MODE: DataTableDataMode = 'client';

export const StandardDescriptionTablePanel = ({
  activeCount,
  appliedFilters,
  descriptionTypeCode,
  inactiveCount,
  onAdd,
  onDeactivate,
  onEdit,
  onFiltersApply,
  onFiltersClear,
  onReactivate,
  queryClient,
  showTradeColumn,
  typeOptions,
  tradeOptions,
}: StandardDescriptionTablePanelProps) => {
  const [status, setStatus] =
    useState<StandardDescriptionStatusFilter>('active');
  const [pagination, setPagination] = useState<DataTableState['pagination']>({
    pageIndex: 0,
    pageSize: STANDARD_DESCRIPTION_PAGE_SIZE,
  });
  const [globalFilter, setGlobalFilter] = useState('');

  const effectiveTypeCode =
    appliedFilters.descriptionTypeCode || descriptionTypeCode;
  const tradeFilter = appliedFilters.tradeId;

  const listRequest = buildDataTableListRequest({
    mode: LIST_DATA_MODE,
    pagination,
    globalFilter,
  });

  const query = useQuery(
    setupDescriptionListQueryOptions({
      ...listRequest,
      isActive: status === 'active',
      descriptionTypeCode: effectiveTypeCode,
    }),
    queryClient,
  );

  const columns = useMemo(
    () => [
      column.accessor('shortNote', {
        header: 'Title',
        enableSorting: false,
        meta: { label: 'Title' },
        cell: ({ getValue }) => (
          <span className="font-medium text-action">{getValue() ?? '—'}</span>
        ),
      }),
      column.accessor('body', {
        header: 'Description',
        enableSorting: false,
        meta: { label: 'Description' },
        cell: ({ getValue }) => (
          <span className="line-clamp-2">{getValue() ?? '—'}</span>
        ),
      }),
      ...(showTradeColumn
        ? [
            column.accessor('fgsSetupTechTradeId', {
              header: 'Trade',
              enableSorting: false,
              meta: { label: 'Trade' },
              cell: ({ getValue }) => findTradeLabel(getValue(), tradeOptions),
            }),
          ]
        : []),
      column.display({
        id: 'createdOn',
        header: 'Created On',
        enableSorting: false,
        meta: { label: 'Created On' },
        cell: () => '—',
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
            record.shortNote?.trim() || 'standard description';

          const handleEdit = () => {
            onEdit(record);
          };

          const handleDeactivate = () => {
            onDeactivate(record);
          };

          const handleReactivate = () => {
            onReactivate(record);
          };

          if (!record.isActive) {
            return (
              <DataTableRowActions
                actions={[{ label: 'Reactivate', onSelect: handleReactivate }]}
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
    [onDeactivate, onEdit, onReactivate, showTradeColumn, tradeOptions],
  );

  const { rows: items, manual } = resolveDataTableRows({
    mode: LIST_DATA_MODE,
    pagination,
    items: query.data?.items ?? [],
    totalCount: query.data?.totalCount ?? 0,
    filterItems: tradeFilter
      ? (loaded) =>
          loaded.filter(
            (item) => String(item.fgsSetupTechTradeId ?? '') === tradeFilter,
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
    ? describeStandardDescriptionError(query.error)
    : LOAD_ERROR_TITLE;
  const emptyState =
    globalFilter.trim() || tradeFilter ? NO_RESULTS_FOUND : NO_RESULTS_FOUND;

  const handleStatusChange = (next: StandardDescriptionStatusFilter) => {
    setStatus(next);
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const handleSearchChange = (value: string) => {
    setGlobalFilter(value);
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const handleFiltersApply = (filters: StandardDescriptionListFilters) => {
    onFiltersApply(filters);
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const handleFiltersClear = () => {
    onFiltersClear();
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const handleAdd = () => {
    onAdd();
  };

  const formatPageSize = (size: number) => `${size} per page`;

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <CatalogStatusTabBar
        activeCount={activeCount}
        addLabel={ADD_STANDARD_DESCRIPTION_LABEL}
        filter={
          <StandardDescriptionListFilter
            appliedFilters={appliedFilters}
            onApply={handleFiltersApply}
            onClear={handleFiltersClear}
            showTradeFilter={showTradeColumn}
            tradeOptions={tradeOptions}
            typeOptions={typeOptions}
          />
        }
        inactiveCount={inactiveCount}
        onAdd={handleAdd}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        searchPlaceholder={SEARCH_PLACEHOLDER}
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
          tableLabel="Standard descriptions"
        />
      </div>
    </div>
  );
};
