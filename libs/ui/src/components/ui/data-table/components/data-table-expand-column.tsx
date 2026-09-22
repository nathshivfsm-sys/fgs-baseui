import type { RowData } from '@tanstack/react-table';
import { ChevronDownIcon, ChevronRightIcon } from '../../../../icons';
import { cn } from '../../../../lib/cn';
import { IconButton } from '../../icon-button';
import type { DataTableColumnDef } from '../data-table-features';

export interface CreateDataTableExpandColumnOptions<TData extends RowData> {
  getRowCanExpand?: (row: TData) => boolean;
  getRowExpandLabel?: (row: TData, expanded: boolean) => string;
}

export function createDataTableExpandColumn<TData extends RowData>({
  getRowCanExpand,
  getRowExpandLabel,
}: CreateDataTableExpandColumnOptions<TData> = {}): DataTableColumnDef<TData> {
  return {
    id: 'expand',
    enableHiding: false,
    enableResizing: false,
    enableSorting: false,
    meta: {
      cellClassName: 'w-9 pr-0',
      headerClassName: 'w-9 pr-0',
      label: 'Expand row',
    },
    header: () => null,
    cell: ({ row }) => {
      const canExpand =
        row.getCanExpand() &&
        (getRowCanExpand?.(row.original) ?? row.getCanExpand());

      if (!canExpand) {
        return <span aria-hidden="true" className="inline-block size-7" />;
      }

      const expanded = row.getIsExpanded();
      const label =
        getRowExpandLabel?.(row.original, expanded) ??
        (expanded ? 'Collapse row' : 'Expand row');

      const handleToggle = () => {
        row.toggleExpanded();
      };

      return (
        <IconButton
          aria-expanded={expanded}
          className={cn('size-7 border-transparent bg-transparent p-0')}
          icon={
            expanded ? (
              <ChevronDownIcon className="size-3 text-action" />
            ) : (
              <ChevronRightIcon className="size-3 text-foreground-muted" />
            )
          }
          label={label}
          onClick={(event) => {
            event.stopPropagation();
            handleToggle();
          }}
          size="xs"
          variant="ghost"
        />
      );
    },
  };
}
