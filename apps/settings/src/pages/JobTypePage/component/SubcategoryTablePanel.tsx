import { useMemo, useState } from 'react';
import {
  Badge,
  createDataTableColumnHelper,
  DataTable,
  DataTableRowActions,
  type DataTableState,
} from '@cms/ui';
import { CatalogStatusTabBar } from '../../../shared';
import {
  ADD_SUBCATEGORY_LABEL,
  SEARCH_SUBCATEGORIES_PLACEHOLDER,
} from '../constant';
import type {
  CatalogStatusFilter,
  SubcategoryRow,
  SubcategoryTablePanelProps,
} from '../types';

const column = createDataTableColumnHelper<SubcategoryRow>();

export function SubcategoryTablePanel({
  activeCount,
  inactiveCount,
  onAdd,
  onEdit,
  rows,
}: SubcategoryTablePanelProps) {
  const [status, setStatus] = useState<CatalogStatusFilter>('active');
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState<DataTableState['pagination']>({
    pageIndex: 0,
    pageSize: 10,
  });

  const filteredRows = useMemo(() => {
    const normalized = globalFilter.trim().toLowerCase();
    return rows.filter((row) => {
      if (row.isActive !== (status === 'active')) {
        return false;
      }
      if (!normalized) {
        return true;
      }
      return (
        row.subcategory.toLowerCase().includes(normalized) ||
        row.trade.toLowerCase().includes(normalized) ||
        row.taskName.toLowerCase().includes(normalized)
      );
    });
  }, [globalFilter, rows, status]);

  const pageCount = Math.max(
    1,
    Math.ceil(filteredRows.length / pagination.pageSize),
  );
  const pageStart = pagination.pageIndex * pagination.pageSize;
  const pageRows = filteredRows.slice(
    pageStart,
    pageStart + pagination.pageSize,
  );

  const columns = useMemo(
    () => [
      column.accessor('subcategory', {
        header: 'Subcategory',
        cell: ({ getValue }) => (
          <span className="font-normal text-heading">{getValue()}</span>
        ),
      }),
      column.accessor('trade', {
        header: 'Trade',
        cell: ({ getValue }) => (
          <span className="text-foreground-muted">{getValue()}</span>
        ),
      }),
      column.accessor('estimatedTime', {
        header: 'Est. Time',
        cell: ({ getValue }) => (
          <span className="text-foreground-muted">{getValue()}</span>
        ),
      }),
      column.accessor('priority', {
        header: 'Priority',
        cell: ({ getValue }) => {
          const priority = getValue();
          if (priority === 'High') {
            return (
              <Badge
                className="rounded px-1.5 py-0.5 text-field font-semibold"
                size="sm"
                tone="destructive"
                variant="outline"
              >
                {priority}
              </Badge>
            );
          }
          return (
            <Badge className="rounded" size="sm" tone="neutral" variant="soft">
              {priority}
            </Badge>
          );
        },
      }),
      column.accessor('taskName', {
        header: 'Task Name',
        cell: ({ getValue }) => (
          <span className="text-foreground-muted">{getValue()}</span>
        ),
      }),
      column.display({
        id: 'actions',
        header: 'Action',
        cell: ({ row }) => {
          const editRow = () => {
            onEdit(row.original);
          };
          return (
            <DataTableRowActions
              actions={[]}
              editLabel={`Edit ${row.original.subcategory}`}
              onEdit={editRow}
            />
          );
        },
      }),
    ],
    [onEdit],
  );

  const handleStatusChange = (next: CatalogStatusFilter) => {
    setStatus(next);
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const handleSearchChange = (value: string) => {
    setGlobalFilter(value);
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const getRowId = (row: SubcategoryRow) => row.id;

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <CatalogStatusTabBar
        activeCount={activeCount}
        addLabel={ADD_SUBCATEGORY_LABEL}
        inactiveCount={inactiveCount}
        onAdd={onAdd}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        searchPlaceholder={SEARCH_SUBCATEGORIES_PLACEHOLDER}
        searchValue={globalFilter}
        status={status}
      />
      <div className="min-w-0 flex-1 px-2 pt-2 sm:px-4">
        <DataTable
          className="rounded-none border-0"
          columns={columns}
          data={pageRows}
          enableRowSelection={false}
          enableSearch={false}
          getRowId={getRowId}
          manual={{
            pagination: true,
            pageCount,
            rowCount: filteredRows.length,
          }}
          onPaginationChange={setPagination}
          rowLabel="entries"
          showColumnVisibility={false}
          state={{ globalFilter, pagination, sorting: [] }}
          status="idle"
          tableLabel="Subcategories"
        />
      </div>
    </div>
  );
}
