import { Fragment } from 'react';
import { EditIcon, MoreVerticalIcon } from '../../../../icons';
import { cn } from '../../../../lib/cn';
import { Button } from '../../button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../dropdown-menu';
import type {
  DataTableIconCellProps,
  DataTableLinkCellProps,
  DataTableRowActionsProps,
  DataTableStackedCellProps,
} from '../types';

/** Blue identifier link used by the ID column. */
export function DataTableLinkCell({
  className,
  children,
  ...props
}: DataTableLinkCellProps) {
  return (
    <a
      className={cn(
        'rounded-sm font-medium text-link underline-offset-2 outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/30',
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}

/** Two-line cell used by the Location Name and Address columns. */
export function DataTableStackedCell({
  className,
  primary,
  secondary,
  tone = 'strong',
}: DataTableStackedCellProps) {
  return (
    <div className={cn('flex min-w-0 flex-col gap-0.5', className)}>
      <span
        className={cn(
          'truncate',
          tone === 'strong'
            ? 'font-semibold text-card-foreground'
            : 'text-table-foreground',
        )}
      >
        {primary}
      </span>
      {secondary == null ? null : (
        <span
          className={cn(
            'truncate',
            tone === 'strong'
              ? 'text-caption text-muted-foreground'
              : 'text-table-foreground',
          )}
        >
          {secondary}
        </span>
      )}
    </div>
  );
}

/** Leading-icon cell used by the Phone column. */
export function DataTableIconCell({
  className,
  children,
  icon,
}: DataTableIconCellProps) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <span aria-hidden="true" className="shrink-0 text-icon-muted">
        {icon}
      </span>
      <span className="truncate">{children}</span>
    </span>
  );
}

/** Trailing pencil button plus overflow menu, matching the Actions column. */
export function DataTableRowActions({
  actions,
  className,
  editLabel = 'Edit row',
  menuLabel = 'More actions',
  onEdit,
}: DataTableRowActionsProps) {
  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      {onEdit ? (
        <Button
          aria-label={editLabel}
          className="size-7 border-input bg-card p-0 text-control-foreground"
          onClick={onEdit}
          title={editLabel}
          variant="outline"
        >
          <EditIcon className="size-3.5" />
        </Button>
      ) : null}
      {actions?.length ? (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                aria-label={menuLabel}
                className="size-7 border-input bg-card p-0 text-control-foreground"
                title={menuLabel}
                variant="outline"
              >
                <MoreVerticalIcon className="size-3.5" />
              </Button>
            }
          />
          <DropdownMenuContent>
            {actions.map((action) => (
              <Fragment key={action.label}>
                {action.separatorBefore ? <DropdownMenuSeparator /> : null}
                <DropdownMenuItem
                  disabled={action.disabled}
                  onClick={action.onSelect}
                  variant={action.destructive ? 'destructive' : 'default'}
                >
                  {action.label}
                </DropdownMenuItem>
              </Fragment>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </div>
  );
}
