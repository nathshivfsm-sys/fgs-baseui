import type { RowData } from '@tanstack/react-table';
import { cn } from '../../../../lib/cn';
import { TableHead, TableHeader, TableRow } from '../../table';
import type { DataTableHeaderProps } from '../types';
import { getDataTableAlignClass } from '../utils';
import { DataTableColumnHeader } from './data-table-column-header';

/** Header groups, sort controls, and optional resize handles. */
export function DataTableHeader<TData extends RowData>({
  enableColumnResizing,
  headerGroups,
  table,
}: DataTableHeaderProps<TData>) {
  return (
    <TableHeader>
      {headerGroups.map((headerGroup) => (
        <TableRow className="hover:bg-transparent" key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            const meta = header.column.columnDef.meta;
            const sorted = header.column.getIsSorted();
            const definition = header.column.columnDef.header;
            const content = header.isPlaceholder ? null : typeof definition ===
                'string' || definition == null ? (
              <DataTableColumnHeader column={header.column}>
                {definition ?? meta?.label ?? header.column.id}
              </DataTableColumnHeader>
            ) : (
              <table.FlexRender header={header} />
            );

            return (
              <TableHead
                aria-sort={
                  header.column.getCanSort()
                    ? sorted === 'asc'
                      ? 'ascending'
                      : sorted === 'desc'
                        ? 'descending'
                        : 'none'
                    : undefined
                }
                className={cn(
                  getDataTableAlignClass(meta?.align),
                  meta?.headerClassName,
                )}
                colSpan={header.colSpan}
                key={header.id}
                style={
                  enableColumnResizing ? { width: header.getSize() } : undefined
                }
              >
                {content}
                {enableColumnResizing && header.column.getCanResize() ? (
                  <span
                    className="absolute top-0 right-0 h-full w-1 cursor-col-resize touch-none select-none bg-transparent hover:bg-brand/40 data-[resizing=true]:bg-brand"
                    data-resizing={header.column.getIsResizing()}
                    onDoubleClick={() => header.column.resetSize()}
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                    role="presentation"
                  />
                ) : null}
              </TableHead>
            );
          })}
        </TableRow>
      ))}
    </TableHeader>
  );
}
