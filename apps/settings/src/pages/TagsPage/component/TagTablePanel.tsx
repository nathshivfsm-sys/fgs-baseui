import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { TagSummaryDto } from '@cms/settings-contract';
import { tagListQueryOptions } from '@cms/settings-data-access';
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
  ADD_TAG_LABEL,
  LOAD_TAGS_ERROR_TITLE,
  NO_TAGS_FOUND,
  NO_TAGS_SEARCH_FOUND,
  SEARCH_TAGS_PLACEHOLDER,
  TAG_PAGE_SIZE,
} from '../constant';
import type { TagStatusFilter, TagTablePanelProps } from '../types';
import { describeTagError, formatTagEntityCell } from '../util';
import { TagColorSwatch } from './TagColorSwatch';
import { TagListFilter } from './TagListFilter';

const column = createDataTableColumnHelper<TagSummaryDto>();
const LIST_DATA_MODE: DataTableDataMode = 'client';

export const TagTablePanel = ({
  activeCount,
  appliedFilters,
  inactiveCount,
  onAdd,
  onDelete,
  onEdit,
  onFiltersApply,
  onFiltersClear,
  queryClient,
}: TagTablePanelProps) => {
  const [status, setStatus] = useState<TagStatusFilter>('active');
  const [pagination, setPagination] = useState<DataTableState['pagination']>({
    pageIndex: 0,
    pageSize: TAG_PAGE_SIZE,
  });
  const [sorting, setSorting] = useState<DataTableState['sorting']>([
    { id: 'name', desc: false },
  ]);
  const [globalFilter, setGlobalFilter] = useState('');
  const entityFilter = appliedFilters.entity;

  const listRequest = buildDataTableListRequest({
    mode: LIST_DATA_MODE,
    pagination,
    sorting,
    globalFilter,
    serverManual: { sorting: true },
  });

  const query = useQuery(
    tagListQueryOptions({
      ...listRequest,
      isActive: status === 'active',
    }),
    queryClient,
  );

  const columns = useMemo(
    () => [
      column.accessor('name', {
        header: 'Tag Name',
        enableSorting: true,
        meta: { label: 'Tag Name' },
        cell: ({ getValue }) => (
          <span className="font-medium text-action">{getValue() ?? '—'}</span>
        ),
      }),
      column.accessor('description', {
        header: 'Description',
        enableSorting: false,
        meta: { label: 'Description' },
        cell: ({ getValue }) => (
          <span className="line-clamp-2">{getValue()?.trim() || '—'}</span>
        ),
      }),
      column.accessor('entities', {
        header: 'Entity',
        enableSorting: false,
        meta: { label: 'Entity' },
        cell: ({ getValue }) => formatTagEntityCell(getValue()),
      }),
      column.accessor('textColor', {
        header: 'Text Color',
        enableSorting: false,
        meta: { label: 'Text Color', align: 'center' },
        cell: ({ getValue }) => (
          <TagColorSwatch color={getValue()} fallback="#374151" />
        ),
      }),
      column.accessor('backgroundColor', {
        header: 'Background Color',
        enableSorting: false,
        meta: { label: 'Background Color', align: 'center' },
        cell: ({ getValue }) => (
          <TagColorSwatch color={getValue()} fallback="#D9D9D9" />
        ),
      }),
      column.display({
        id: 'actions',
        header: 'Actions',
        enableHiding: false,
        enableSorting: false,
        meta: { align: 'center', label: 'Actions' },
        cell: function ActionsCell({ row }) {
          const record = row.original;
          const displayName = record.name?.trim() || 'tag';

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

  const { rows: items, manual } = resolveDataTableRows({
    mode: LIST_DATA_MODE,
    pagination,
    items: query.data?.items ?? [],
    totalCount: query.data?.totalCount ?? 0,
    serverManual: { sorting: true },
    filterItems: entityFilter
      ? (loaded) =>
          loaded.filter((item) => (item.entities ?? []).includes(entityFilter))
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
    ? describeTagError(query.error)
    : LOAD_TAGS_ERROR_TITLE;
  const emptyState = globalFilter.trim() ? NO_TAGS_SEARCH_FOUND : NO_TAGS_FOUND;

  const handleStatusChange = (next: TagStatusFilter) => {
    setStatus(next);
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const handleSearchChange = (value: string) => {
    setGlobalFilter(value);
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const handleFiltersApply = (filters: typeof appliedFilters) => {
    onFiltersApply(filters);
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const handleFiltersClear = () => {
    onFiltersClear();
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const formatPageSize = (size: number) => `${size} per page`;

  const handleAdd = () => {
    onAdd();
  };

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <CatalogStatusTabBar
        activeCount={activeCount}
        addLabel={ADD_TAG_LABEL}
        filter={
          <TagListFilter
            appliedFilters={appliedFilters}
            onApply={handleFiltersApply}
            onClear={handleFiltersClear}
          />
        }
        inactiveCount={inactiveCount}
        onAdd={handleAdd}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        searchPlaceholder={SEARCH_TAGS_PLACEHOLDER}
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
          tableLabel="Tags"
        />
      </div>
    </div>
  );
};
