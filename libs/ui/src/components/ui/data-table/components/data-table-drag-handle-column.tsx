import type { RowData } from '@tanstack/react-table';
import type { DataTableColumnDef } from '../data-table-features';

/** Visual-only drag affordance; wire DnD in the feature layer. */
export function createDataTableDragHandleColumn<
  TData extends RowData,
>(): DataTableColumnDef<TData> {
  return {
    id: 'drag-handle',
    enableHiding: false,
    enableResizing: false,
    enableSorting: false,
    meta: {
      cellClassName: 'w-6 pr-0',
      headerClassName: 'w-6 pr-0',
      label: 'Reorder',
      pin: 'leading',
    },
    header: () => null,
    cell: () => (
      <span
        aria-hidden="true"
        className="inline-flex flex-col gap-0.5 opacity-30"
      >
        <span className="flex gap-0.5">
          <span className="size-[3px] rounded-full bg-foreground-muted" />
          <span className="size-[3px] rounded-full bg-foreground-muted" />
        </span>
        <span className="flex gap-0.5">
          <span className="size-[3px] rounded-full bg-foreground-muted" />
          <span className="size-[3px] rounded-full bg-foreground-muted" />
        </span>
      </span>
    ),
  };
}
