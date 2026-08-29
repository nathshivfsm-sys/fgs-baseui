import type { RowData } from '@tanstack/react-table';
import { useId } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '../../../../icons';
import { cn } from '../../../../lib/cn';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../select';
import type { DataTablePaginationProps } from '../types';
import { buildPageItems } from '../utils';

const pageControlClass =
  'inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-input bg-card text-caption font-medium text-control-foreground outline-none transition-colors hover:bg-secondary/60 focus-visible:ring-[3px] focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-40';

/** Range summary, rows-per-page control, and numbered pager. */
export function DataTablePagination<TData extends RowData>({
  className,
  rowLabel = 'rows',
  pageSizeOptions = [10, 25, 50, 100],
  siblingCount = 1,
  table,
}: DataTablePaginationProps<TData>) {
  const pageSizeLabelId = useId();
  const { pageIndex, pageSize } = table.state.pagination ?? {
    pageIndex: 0,
    pageSize: 10,
  };
  const totalRows = table.getRowCount();
  const pageCount = table.getPageCount();
  const firstRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const lastRow = Math.min(totalRows, (pageIndex + 1) * pageSize);

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-4 border-t border-divider px-4 py-3',
        className,
      )}
    >
      <p className="text-input text-muted-foreground">
        {totalRows === 0
          ? `No ${rowLabel} found`
          : `Showing ${firstRow} to ${lastRow} of ${totalRows} ${rowLabel}`}
      </p>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span
            className="text-input text-muted-foreground"
            id={pageSizeLabelId}
          >
            Rows per page:
          </span>
          <Select
            onValueChange={(value) => table.setPageSize(Number(value))}
            value={String(pageSize)}
          >
            <SelectTrigger
              aria-labelledby={pageSizeLabelId}
              className="w-[4.25rem] border-input bg-card"
              size="sm"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((option) => (
                <SelectItem key={option} value={String(option)}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <nav aria-label="Pagination" className="flex items-center gap-1.5">
          <button
            aria-label="Go to previous page"
            className={pageControlClass}
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
            type="button"
          >
            <ChevronLeftIcon className="size-3.5" />
          </button>

          {buildPageItems(pageCount, pageIndex, siblingCount).map((item) =>
            typeof item === 'number' ? (
              <button
                aria-current={item === pageIndex ? 'page' : undefined}
                aria-label={`Go to page ${item + 1}`}
                className={cn(
                  pageControlClass,
                  item === pageIndex &&
                    'border-brand bg-brand text-brand-foreground hover:bg-brand/90',
                )}
                key={item}
                onClick={() => table.setPageIndex(item)}
                type="button"
              >
                {item + 1}
              </button>
            ) : (
              <span
                aria-hidden="true"
                className="inline-flex size-8 items-center justify-center text-caption text-muted-foreground"
                key={item}
              >
                &hellip;
              </span>
            ),
          )}

          <button
            aria-label="Go to next page"
            className={pageControlClass}
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
            type="button"
          >
            <ChevronRightIcon className="size-3.5" />
          </button>
        </nav>
      </div>
    </div>
  );
}
