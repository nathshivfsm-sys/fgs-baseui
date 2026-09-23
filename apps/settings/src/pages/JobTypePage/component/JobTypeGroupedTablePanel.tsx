import { useMemo, useState } from 'react';
import {
  Badge,
  cn,
  createDataTableColumnHelper,
  createDataTableDragHandleColumn,
  DataTable,
  DataTableRowActions,
  type DataTableState,
} from '@cms/ui';
import { CatalogStatusTabBar } from '../../../shared';
import {
  ADD_JOB_TYPE_LABEL,
  SEARCH_JOB_TYPES_PLACEHOLDER,
} from '../constant';
import type {
  CatalogStatusFilter,
  JobTypeGroupRow,
  SubcategoryRow,
} from '../types';
import { PLACEHOLDER_JOB_TYPE_GROUPS } from '../util';

const jobTypeColumn = createDataTableColumnHelper<JobTypeGroupRow>();
const subcategoryColumn = createDataTableColumnHelper<SubcategoryRow>();

const jobTypeHeaderClassName =
  'h-[2.125rem] bg-surface-sunken py-0 text-[0.8125rem] font-medium uppercase tracking-[0.025em] text-foreground-muted';

const subcategoryHeaderClassName =
  'h-[2.125rem] bg-action-subtle py-0 text-[0.8125rem] font-medium uppercase tracking-[0.025em] text-foreground-muted';

/** Figma node 2139:841 — nested grid inset from the parent row. */
const expandedSubTableInsetClass = 'pl-14 pr-4';

const subcategoryCellClassName = 'py-[9px] text-field';

const nestedSubTableClassName =
  'rounded-none border-0 shadow-none [&_thead]:bg-transparent [&_tbody_tr]:bg-surface [&_td:first-child]:pl-0 [&_td:last-child]:pr-0 [&_th:first-child]:pl-0 [&_th:last-child]:pr-0';

const jobTypeCellClassName = 'py-3 text-field text-heading';

const handleSubcategoryEdit = () => {
  // Dialog wiring follows catalog API integration.
};

const handleSubcategoryDelete = () => {
  // Dialog wiring follows catalog API integration.
};

function JobTypeSubcategoryDetail({
  rows,
}: {
  rows: readonly SubcategoryRow[];
}) {
  const columns = useMemo(
    () => [
      subcategoryColumn.display({
        id: 'index',
        header: '#',
        meta: {
          headerClassName: subcategoryHeaderClassName,
          cellClassName: cn(subcategoryCellClassName, 'text-foreground-muted'),
        },
        cell: ({ row }) => row.index + 1,
      }),
      subcategoryColumn.accessor('subcategory', {
        header: 'Subcategory',
        meta: {
          headerClassName: subcategoryHeaderClassName,
          cellClassName: cn(subcategoryCellClassName, 'text-heading'),
        },
      }),
      subcategoryColumn.accessor('trade', {
        header: 'Trade',
        meta: {
          headerClassName: subcategoryHeaderClassName,
          cellClassName: cn(subcategoryCellClassName, 'text-foreground-muted'),
        },
      }),
      subcategoryColumn.accessor('estimatedTime', {
        header: 'Est. Time',
        meta: {
          headerClassName: subcategoryHeaderClassName,
          cellClassName: cn(subcategoryCellClassName, 'text-foreground-muted'),
        },
      }),
      subcategoryColumn.accessor('priority', {
        header: 'Priority',
        meta: {
          headerClassName: subcategoryHeaderClassName,
          cellClassName: subcategoryCellClassName,
        },
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
      subcategoryColumn.accessor('taskName', {
        header: 'Task Name',
        meta: {
          headerClassName: subcategoryHeaderClassName,
          cellClassName: cn(subcategoryCellClassName, 'text-foreground-muted'),
        },
      }),
      subcategoryColumn.display({
        id: 'actions',
        header: 'Action',
        meta: {
          align: 'center',
          headerClassName: subcategoryHeaderClassName,
          cellClassName: subcategoryCellClassName,
        },
        cell: ({ row }) => (
          <DataTableRowActions
            actions={[]}
            editLabel={`Edit ${row.original.subcategory}`}
            onDelete={handleSubcategoryDelete}
            onEdit={handleSubcategoryEdit}
          />
        ),
      }),
    ],
    [],
  );

  return (
    <div className={expandedSubTableInsetClass}>
      <DataTable
        className={nestedSubTableClassName}
        columns={columns}
        data={rows}
        enablePagination={false}
        enableRowSelection={false}
        enableSearch={false}
        getRowId={(row) => row.id}
        showColumnVisibility={false}
        showExpandColumn={false}
        tableLabel="Subcategories"
      />
    </div>
  );
}

const handleJobTypeEdit = () => {
  // Dialog wiring follows catalog API integration.
};

const handleJobTypeDelete = () => {
  // Dialog wiring follows catalog API integration.
};

const formatPageSizeOption = (pageSize: number) => `${pageSize} per page`;

export function JobTypeGroupedTablePanel() {
  const [status, setStatus] = useState<CatalogStatusFilter>('active');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<DataTableState['expanded']>({
    maintenance: true,
  });

  const filteredRows = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    return PLACEHOLDER_JOB_TYPE_GROUPS.filter((row) => {
      if (row.isActive !== (status === 'active')) {
        return false;
      }
      if (!normalized) {
        return true;
      }
      return (
        row.jobType.toLowerCase().includes(normalized) ||
        row.category.toLowerCase().includes(normalized) ||
        row.glAccount.toLowerCase().includes(normalized)
      );
    });
  }, [search, status]);

  const activeCount = PLACEHOLDER_JOB_TYPE_GROUPS.filter(
    (row) => row.isActive,
  ).length;
  const inactiveCount = PLACEHOLDER_JOB_TYPE_GROUPS.filter(
    (row) => !row.isActive,
  ).length;

  const columns = useMemo(
    () => [
      createDataTableDragHandleColumn<JobTypeGroupRow>(),
      jobTypeColumn.accessor('jobType', {
        header: 'Job Type',
        meta: {
          headerClassName: jobTypeHeaderClassName,
          cellClassName: jobTypeCellClassName,
        },
      }),
      jobTypeColumn.accessor('category', {
        header: 'Category',
        meta: {
          headerClassName: jobTypeHeaderClassName,
          cellClassName: jobTypeCellClassName,
        },
      }),
      jobTypeColumn.accessor('businessUnit', {
        header: 'Business Unit',
        meta: {
          headerClassName: jobTypeHeaderClassName,
          cellClassName: jobTypeCellClassName,
        },
      }),
      jobTypeColumn.accessor('glAccount', {
        header: 'GL Account',
        meta: {
          headerClassName: jobTypeHeaderClassName,
          cellClassName: jobTypeCellClassName,
        },
      }),
      jobTypeColumn.accessor('usedFor', {
        header: 'Used For',
        meta: {
          headerClassName: jobTypeHeaderClassName,
          cellClassName: jobTypeCellClassName,
        },
      }),
      jobTypeColumn.accessor('taskCount', {
        header: 'Tasks',
        meta: {
          align: 'center',
          headerClassName: jobTypeHeaderClassName,
          cellClassName: jobTypeCellClassName,
        },
        cell: ({ getValue }) => {
          const count = getValue();
          const label = count === 1 ? '1 task' : `${count} tasks`;
          return (
            <Badge
              className="rounded-full bg-secondary px-2 py-0.5 font-normal text-foreground-muted"
              size="sm"
              tone="neutral"
              variant="soft"
            >
              {label}
            </Badge>
          );
        },
      }),
      jobTypeColumn.display({
        id: 'actions',
        header: 'Action',
        meta: {
          align: 'center',
          headerClassName: jobTypeHeaderClassName,
          cellClassName: jobTypeCellClassName,
        },
        cell: ({ row }) => (
          <DataTableRowActions
            actions={[]}
            editLabel={`Edit ${row.original.jobType}`}
            onDelete={handleJobTypeDelete}
            onEdit={handleJobTypeEdit}
          />
        ),
      }),
    ],
    [],
  );

  const handleStatusChange = (next: CatalogStatusFilter) => {
    setStatus(next);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handleAdd = () => {
    // Dialog wiring follows catalog API integration.
  };

  const handleFilterClick = () => {
    // Filter panel follows catalog API integration.
  };

  const handleExpandedChange = (
    updater:
      | DataTableState['expanded']
      | ((prev: DataTableState['expanded']) => DataTableState['expanded']),
  ) => {
    setExpanded((current) =>
      typeof updater === 'function' ? updater(current) : updater,
    );
  };

  const renderExpandedRow = (row: JobTypeGroupRow) => (
    <div className="border-t border-action-subtle/50 bg-surface">
      <JobTypeSubcategoryDetail rows={row.subcategories} />
    </div>
  );

  const getRowExpandLabel = (row: JobTypeGroupRow, isExpanded: boolean) =>
    isExpanded
      ? `Collapse ${row.jobType} subcategories`
      : `Expand ${row.jobType} subcategories`;

  return (
    <div className="flex min-w-0 flex-1 flex-col bg-surface">
      <CatalogStatusTabBar
        activeCount={activeCount}
        addLabel={ADD_JOB_TYPE_LABEL}
        inactiveCount={inactiveCount}
        onAdd={handleAdd}
        onFilterClick={handleFilterClick}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        searchPlaceholder={SEARCH_JOB_TYPES_PLACEHOLDER}
        searchValue={search}
        status={status}
      />
      <DataTable
        className="rounded-none border-0 shadow-none"
        columns={columns}
        data={filteredRows}
        defaultPageSize={10}
        enableRowSelection={false}
        enableSearch={false}
        formatPageSizeOption={formatPageSizeOption}
        getRowExpandLabel={getRowExpandLabel}
        getRowId={(row) => row.id}
        onExpandedChange={handleExpandedChange}
        pageSizeLabel=""
        paginateExpandedRows={false}
        renderExpandedRow={renderExpandedRow}
        rowLabel="entries"
        state={{ expanded }}
        status="idle"
        tableLabel="Job types"
      />
    </div>
  );
}
