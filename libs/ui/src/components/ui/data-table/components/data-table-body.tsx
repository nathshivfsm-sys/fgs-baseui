import type { RowData } from '@tanstack/react-table';
import { cn } from '../../../../lib/cn';
import { TableBody, TableCell, TableRow } from '../../table';
import type { DataTableBodyProps } from '../types';
import { activateDataTableRow, getDataTableAlignClass } from '../utils';

/** Loading, error, empty, and populated table body states. */
export function DataTableBody<TData extends RowData>({
  columnCount,
  currentPageSize,
  emptyState,
  enableRowSelection,
  errorState,
  getRowLabel,
  rowActivation,
  rowLabel,
  status,
  table,
}: DataTableBodyProps<TData>) {
  const rows = table.getRowModel().rows;

  if (status === 'error') {
    return (
      <TableBody>
        <TableRow className="hover:bg-transparent">
          <TableCell
            className="h-32 text-center text-destructive"
            colSpan={columnCount}
          >
            {errorState ?? `Unable to load ${rowLabel}.`}
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  if (status === 'loading') {
    return (
      <TableBody>
        {Array.from({ length: Math.min(currentPageSize, 8) }, (_, rowIndex) => (
          <TableRow className="hover:bg-transparent" key={rowIndex}>
            {Array.from({ length: columnCount }, (_, cellIndex) => (
              <TableCell key={cellIndex}>
                <span className="block h-4 w-full animate-pulse rounded-sm bg-secondary motion-reduce:animate-none" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    );
  }

  if (rows.length === 0) {
    return (
      <TableBody>
        <TableRow className="hover:bg-transparent">
          <TableCell
            className="h-32 text-center text-muted-foreground"
            colSpan={columnCount}
          >
            {emptyState}
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {rows.map((row) => (
        <TableRow
          aria-label={
            rowActivation
              ? (getRowLabel?.(row.original) ?? `Activate row ${row.index + 1}`)
              : undefined
          }
          aria-selected={enableRowSelection ? row.getIsSelected() : undefined}
          data-state={row.getIsSelected() ? 'selected' : undefined}
          interactive={Boolean(rowActivation)}
          key={row.id}
          onClick={
            rowActivation
              ? (event) =>
                  activateDataTableRow(event, row.original, rowActivation)
              : undefined
          }
          onKeyDown={
            rowActivation
              ? (event) =>
                  activateDataTableRow(event, row.original, rowActivation)
              : undefined
          }
          tabIndex={rowActivation ? 0 : undefined}
        >
          {row.getVisibleCells().map((cell) => {
            const meta = cell.column.columnDef.meta;
            return (
              <TableCell
                className={cn(
                  meta?.wrap ? 'whitespace-normal' : 'whitespace-nowrap',
                  getDataTableAlignClass(meta?.align),
                  meta?.cellClassName,
                )}
                key={cell.id}
              >
                <table.FlexRender cell={cell} />
              </TableCell>
            );
          })}
        </TableRow>
      ))}
    </TableBody>
  );
}
