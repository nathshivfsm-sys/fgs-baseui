import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { PaymentMethodSummaryDto } from '@cms/settings-contract';
import { paymentMethodListQueryOptions } from '@cms/settings-data-access';
import {
  buildDataTableListRequest,
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
  LOAD_PAYMENT_METHODS_ERROR_TITLE,
  NO_PAYMENT_METHODS_FOUND,
  PAYMENT_METHOD_PAGE_SIZE,
  SEARCH_PAYMENT_METHODS_PLACEHOLDER,
} from '../constant';
import type {
  PaymentMethodStatusFilter,
  PaymentMethodTablePanelProps,
} from '../types';
import { describePaymentMethodError } from '../util';

const column = createDataTableColumnHelper<PaymentMethodSummaryDto>();
const LIST_DATA_MODE: DataTableDataMode = 'client';

export const PaymentMethodTablePanel = ({
  activeCount,
  inactiveCount,
  onDeactivate,
  onEdit,
  queryClient,
}: PaymentMethodTablePanelProps) => {
  const [status, setStatus] = useState<PaymentMethodStatusFilter>('active');
  const [pagination, setPagination] = useState<DataTableState['pagination']>({
    pageIndex: 0,
    pageSize: PAYMENT_METHOD_PAGE_SIZE,
  });
  const [sorting, setSorting] = useState<DataTableState['sorting']>([
    { id: 'displayName', desc: false },
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
    paymentMethodListQueryOptions({
      ...listRequest,
      isActive: status === 'active',
    }),
    queryClient,
  );

  const columns = useMemo(
    () => [
      column.accessor('displayName', {
        header: 'Name',
        enableSorting: true,
        meta: { label: 'Name' },
        cell: ({ getValue }) => (
          <span className="font-medium text-action">{getValue() ?? '—'}</span>
        ),
      }),
      column.accessor('isMobileVisible', {
        header: 'Available To Field Tech',
        enableSorting: false,
        meta: { align: 'center', label: 'Available To Field Tech' },
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
          const displayName = record.displayName?.trim() || 'payment method';

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
    ? describePaymentMethodError(query.error)
    : LOAD_PAYMENT_METHODS_ERROR_TITLE;

  const handleStatusChange = (next: PaymentMethodStatusFilter) => {
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
        searchPlaceholder={SEARCH_PAYMENT_METHODS_PLACEHOLDER}
        searchValue={globalFilter}
        status={status}
      />
      <div className="min-h-0 min-w-0 flex-1 px-2 pt-2 sm:px-4">
        <DataTable
          className="min-h-0 flex-1 rounded-none border-0"
          columns={columns}
          data={items}
          emptyState={NO_PAYMENT_METHODS_FOUND}
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
          tableLabel="Payment methods"
        />
      </div>
    </div>
  );
};
