import type { RowData } from '@tanstack/react-table';
import { Fragment } from 'react';
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
  renderExpandedRow,
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
            className="h-32 text-center text-foreground-muted"
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
      {rows.map((row) => {
        const depth = row.depth;
        const expandedContent =
          renderExpandedRow && row.getIsExpanded()
            ? renderExpandedRow(row.original)
            : null;
        const detailRow =
          expandedContent != null ? (
            <TableRow
              className="hover:bg-transparent"
              data-slot="data-table-expanded-row"
              key={`${row.id}-expanded`}
            >
              <TableCell className="p-0" colSpan={columnCount}>
                {expandedContent}
              </TableCell>
            </TableRow>
          ) : null;

        return (
          <Fragment key={row.id}>
            <TableRow
              aria-label={
                rowActivation
                  ? (getRowLabel?.(row.original) ??
                    `Activate row ${row.index + 1}`)
                  : undefined
              }
              aria-selected={
                enableRowSelection ? row.getIsSelected() : undefined
              }
              data-state={row.getIsSelected() ? 'selected' : undefined}
              interactive={Boolean(rowActivation) && depth === 0}
              onClick={
                rowActivation && depth === 0
                  ? (event) =>
                      activateDataTableRow(
                        event,
                        row.original,
                        rowActivation,
                      )
                  : undefined
              }
              onKeyDown={
                rowActivation && depth === 0
                  ? (event) =>
                      activateDataTableRow(
                        event,
                        row.original,
                        rowActivation,
                      )
                  : undefined
              }
              tabIndex={rowActivation && depth === 0 ? 0 : undefined}
            >
              {row.getVisibleCells().map((cell) => {
                const meta = cell.column.columnDef.meta;
                return (
                  <TableCell
                    className={cn(
                      meta?.wrap ? 'whitespace-normal' : 'whitespace-nowrap',
                      getDataTableAlignClass(meta?.align),
                      meta?.cellClassName,
                      depth > 0 && cell.column.id === 'expand' && 'pl-6',
                      depth > 0 &&
                        cell.column.id !== 'expand' &&
                        cell.column.id !== 'select' &&
                        'bg-surface-sunken/40',
                    )}
                    key={cell.id}
                    style={
                      depth > 0 && cell.column.getIndex() === 0
                        ? { paddingLeft: `${depth * 1.25 + 1}rem` }
                        : undefined
                    }
                  >
                    <table.FlexRender cell={cell} />
                  </TableCell>
                );
              })}
            </TableRow>
            {detailRow}
          </Fragment>
        );
      })}
    </TableBody>
  );
}
