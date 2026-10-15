import { useMemo, useState } from 'react';
import type { QueryClient } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import type { GloBillingCategoryTypeLookupDto } from '@cms/shared-contract';
import type { BillingCategorySummaryDto } from '@cms/settings-contract';
import { billingCategoryListQueryOptions } from '@cms/settings-data-access';
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
  ADD_BILLING_CATEGORY_LABEL,
  LOAD_BILLING_CATEGORIES_ERROR_TITLE,
  NO_BILLING_CATEGORIES_FOUND,
  SEARCH_BILLING_CATEGORIES_PLACEHOLDER,
} from '../constant';
import type {
  BillingCategoryListFilters,
  BillingCategoryStatusFilter,
} from '../types';
import {
  countBillingCategoryListFilters,
  toBillingCategoryListQueryFilters,
} from '../types';
import {
  describeBillingCategoryError,
  formatBillingCategoryTypeLabel,
} from '../util';
import { BillingCategoryListFilter } from './BillingCategoryListFilter';

const column = createDataTableColumnHelper<BillingCategorySummaryDto>();
const LIST_DATA_MODE: DataTableDataMode = 'client';

const matchesBillingCategoryFilters = (
  record: BillingCategorySummaryDto,
  filters: BillingCategoryListFilters,
) => {
  const queryFilters = toBillingCategoryListQueryFilters(filters);
  if (
    queryFilters.billingCategoryType &&
    record.billingCategoryType !== queryFilters.billingCategoryType
  ) {
    return false;
  }
  if (
    queryFilters.isSystemDefined !== undefined &&
    record.isSystemDefined !== queryFilters.isSystemDefined
  ) {
    return false;
  }
  if (
    queryFilters.showToFieldTech !== undefined &&
    record.showToFieldTech !== queryFilters.showToFieldTech
  ) {
    return false;
  }
  if (
    queryFilters.allowToPick !== undefined &&
    record.allowToPick !== queryFilters.allowToPick
  ) {
    return false;
  }
  return true;
};

const formatYesNo = (value: boolean | null | undefined) =>
  value ? 'Yes' : 'No';

export interface BillingCategoryTablePanelProps {
  activeCount: number;
  appliedFilters: BillingCategoryListFilters;
  inactiveCount: number;
  onAdd: () => void;
  onDeactivate: (record: BillingCategorySummaryDto) => void;
  onEdit: (record: BillingCategorySummaryDto) => void;
  onFiltersApply: (filters: BillingCategoryListFilters) => void;
  onFiltersClear: () => void;
  queryClient: QueryClient;
  typeOptions: readonly GloBillingCategoryTypeLookupDto[] | undefined;
}

export const BillingCategoryTablePanel = ({
  activeCount,
  appliedFilters,
  inactiveCount,
  onAdd,
  onDeactivate,
  onEdit,
  onFiltersApply,
  onFiltersClear,
  queryClient,
  typeOptions,
}: BillingCategoryTablePanelProps) => {
  const [status, setStatus] = useState<BillingCategoryStatusFilter>('active');
  const [pagination, setPagination] = useState<DataTableState['pagination']>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<DataTableState['sorting']>([
    { id: 'billingCategoryName', desc: false },
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
    billingCategoryListQueryOptions({
      ...listRequest,
      isActive: status === 'active',
    }),
    queryClient,
  );

  const columns = useMemo(
    () => [
      column.accessor('billingCategoryType', {
        header: 'Type',
        meta: { label: 'Type' },
        cell: ({ getValue }) =>
          formatBillingCategoryTypeLabel(getValue(), typeOptions),
      }),
      column.accessor('billingCategoryName', {
        header: 'Billing Category Name',
        meta: { label: 'Billing Category Name' },
        cell: ({ getValue }) => (
          <span className="truncate font-semibold text-action">
            {getValue() ?? '—'}
          </span>
        ),
      }),
      column.accessor('description', {
        header: 'Description',
        meta: { label: 'Description' },
        cell: ({ getValue }) => (
          <span className="line-clamp-2">{getValue()?.trim() || '—'}</span>
        ),
      }),
      column.accessor('isSystemDefined', {
        header: 'System Defined',
        meta: { label: 'System Defined' },
        cell: ({ getValue }) => formatYesNo(getValue()),
      }),
      column.accessor('showToFieldTech', {
        header: 'Show To Field Tech',
        meta: { label: 'Show To Field Tech' },
        cell: ({ getValue }) => formatYesNo(getValue()),
      }),
      column.accessor('allowToPick', {
        header: 'Allow To Pick',
        meta: { label: 'Allow To Pick' },
        cell: ({ getValue }) => formatYesNo(getValue()),
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
            record.billingCategoryName?.trim() || 'billing category';

          const handleEdit = () => {
            onEdit(record);
          };

          const handleDeactivate = () => {
            onDeactivate(record);
          };

          if (record.isSystemDefined) {
            return (
              <span className="text-caption text-foreground-subtle">—</span>
            );
          }

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
    [onDeactivate, onEdit, typeOptions],
  );

  const hasPopoverFilters = countBillingCategoryListFilters(appliedFilters) > 0;

  const { rows: items, manual } = resolveDataTableRows({
    mode: LIST_DATA_MODE,
    pagination,
    items: query.data?.items ?? [],
    totalCount: query.data?.totalCount ?? 0,
    serverManual: { sorting: true },
    filterItems: hasPopoverFilters
      ? (loaded) =>
          loaded.filter((record) =>
            matchesBillingCategoryFilters(record, appliedFilters),
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
    ? describeBillingCategoryError(query.error)
    : LOAD_BILLING_CATEGORIES_ERROR_TITLE;

  const handleStatusChange = (next: BillingCategoryStatusFilter) => {
    setStatus(next);
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const handleSearchChange = (value: string) => {
    setGlobalFilter(value);
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const handleFiltersApply = (filters: BillingCategoryListFilters) => {
    onFiltersApply(filters);
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const handleFiltersClear = () => {
    onFiltersClear();
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <CatalogStatusTabBar
        activeCount={activeCount}
        addLabel={ADD_BILLING_CATEGORY_LABEL}
        filter={
          <BillingCategoryListFilter
            appliedFilters={appliedFilters}
            onApply={handleFiltersApply}
            onClear={handleFiltersClear}
            typeOptions={typeOptions}
          />
        }
        inactiveCount={inactiveCount}
        onAdd={onAdd}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        searchPlaceholder={SEARCH_BILLING_CATEGORIES_PLACEHOLDER}
        searchValue={globalFilter}
        status={status}
      />
      <div className="min-h-0 min-w-0 flex-1 px-2 pt-2 sm:px-4">
        <DataTable
          className="min-h-0 flex-1 rounded-none border-0"
          columns={columns}
          data={items}
          emptyState={NO_BILLING_CATEGORIES_FOUND}
          enableRowSelection={false}
          enableSearch={false}
          errorState={query.isError ? loadErrorCopy : undefined}
          getRowId={(row) => String(row.id)}
          manual={manual}
          onGlobalFilterChange={setGlobalFilter}
          onPaginationChange={setPagination}
          onSortingChange={setSorting}
          rowLabel="billing categories"
          showColumnVisibility={false}
          state={{ globalFilter, pagination, sorting }}
          status={tableStatus}
          tableLabel="Billing categories"
        />
      </div>
    </div>
  );
};
