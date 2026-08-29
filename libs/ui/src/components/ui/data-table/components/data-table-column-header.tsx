import type { RowData } from '@tanstack/react-table';
import { ChevronDownIcon, SortIcon } from '../../../../icons';
import { cn } from '../../../../lib/cn';
import type { DataTableColumnHeaderProps } from '../types';

/**
 * Header label that becomes a sort toggle when the column allows sorting.
 * Non-sortable columns render as plain text, as in the design.
 */
export function DataTableColumnHeader<TData extends RowData>({
  className,
  children,
  column,
}: DataTableColumnHeaderProps<TData>) {
  if (!column.getCanSort()) {
    return <span className={cn('truncate', className)}>{children}</span>;
  }

  const sorted = column.getIsSorted();
  const nextAction =
    sorted === 'asc'
      ? 'Sort descending'
      : sorted === 'desc'
        ? 'Clear sorting'
        : 'Sort ascending';

  return (
    <button
      className={cn(
        '-mx-1 inline-flex max-w-full items-center gap-1.5 rounded-sm px-1 py-0.5 font-semibold text-heading outline-none transition-colors hover:text-brand focus-visible:ring-[3px] focus-visible:ring-ring/30',
        className,
      )}
      onClick={column.getToggleSortingHandler()}
      title={nextAction}
      type="button"
    >
      <span className="truncate">{children}</span>
      {sorted === false ? (
        <SortIcon className="size-3 shrink-0 text-icon-muted" />
      ) : (
        <ChevronDownIcon
          className={cn(
            'size-3 shrink-0 text-brand',
            sorted === 'asc' && 'rotate-180',
          )}
        />
      )}
    </button>
  );
}
