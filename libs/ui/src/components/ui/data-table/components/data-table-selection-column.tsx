import type { RowData } from '@tanstack/react-table';
import { Checkbox } from '../../checkbox';
import type { DataTableColumnDef } from '../data-table-features';

export function createDataTableSelectionColumn<
  TData extends RowData,
>(): DataTableColumnDef<TData> {
  return {
    id: 'select',
    enableHiding: false,
    enableResizing: false,
    enableSorting: false,
    meta: {
      cellClassName: 'w-9 pr-0',
      headerClassName: 'w-9 pr-0',
      label: 'Selection',
    },
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all rows on this page"
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={
          !table.getIsAllPageRowsSelected() && table.getIsSomePageRowsSelected()
        }
        onCheckedChange={(checked) =>
          table.toggleAllPageRowsSelected(checked === true)
        }
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label={`Select row ${row.index + 1}`}
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onCheckedChange={(checked) => row.toggleSelected(checked === true)}
        onClick={(event) => event.stopPropagation()}
      />
    ),
  };
}
