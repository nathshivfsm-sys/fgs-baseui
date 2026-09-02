import type { RowData } from '@tanstack/react-table';
import {
  ColumnsIcon,
  FilterIcon,
  MoreVerticalIcon,
  SearchIcon,
} from '../../../../icons';
import { cn } from '../../../../lib/cn';
import { Button } from '../../button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../dropdown-menu';
import { TextInput } from '../../text-input';
import type {
  DataTableColumnsMenuProps,
  DataTableControlsProps,
  DataTableFilterButtonProps,
  DataTableOverflowMenuProps,
  DataTableSearchProps,
  DataTableToolbarProps,
} from '../types';

const toolbarControlClass = 'border-input bg-surface text-foreground';

/** Row above the grid holding scope, search, and view controls. */
export function DataTableToolbar({
  className,
  end,
  start,
}: DataTableToolbarProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-3 px-4 py-3',
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-2">{start}</div>
      <div className="flex flex-wrap items-center gap-2">{end}</div>
    </div>
  );
}

/** Global search field wired to the table's global filter. */
export function DataTableSearch({
  className,
  label = 'Search',
  onValueChange,
  placeholder = 'Search...',
  value,
}: DataTableSearchProps) {
  return (
    <div className={cn('w-full sm:w-56', className)}>
      <TextInput
        aria-label={label}
        className="border-input bg-surface"
        onChange={(event) => onValueChange(event.target.value)}
        placeholder={placeholder}
        startAdornment={<SearchIcon className="size-4" />}
        type="search"
        value={value}
      />
    </div>
  );
}

/** Filter entry point. The panel contents are supplied by the consumer. */
export function DataTableFilterButton({
  active,
  children,
  label = 'Filter',
}: DataTableFilterButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button className={toolbarControlClass} variant="outline">
            <FilterIcon className="size-4 text-icon-muted" />
            {label}
            {active ? (
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-primary"
              />
            ) : null}
          </Button>
        }
      />
      <DropdownMenuContent className="min-w-52">{children}</DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Column visibility picker driven by TanStack's column visibility feature. */
export function DataTableColumnsMenu<TData extends RowData>({
  label = 'Columns',
  table,
}: DataTableColumnsMenuProps<TData>) {
  const columns = table
    .getAllLeafColumns()
    .filter((column) => column.getCanHide());

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button className={toolbarControlClass} variant="outline">
            <ColumnsIcon className="size-4 text-icon-muted" />
            {label}
          </Button>
        }
      />
      <DropdownMenuContent className="min-w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Visible columns</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {columns.map((column) => {
            const header = column.columnDef.header;
            return (
              <DropdownMenuCheckboxItem
                checked={column.getIsVisible()}
                key={column.id}
                onCheckedChange={(checked) => column.toggleVisibility(checked)}
              >
                {column.columnDef.meta?.label ??
                  (typeof header === 'string' ? header : column.id)}
              </DropdownMenuCheckboxItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Trailing vertical-dots menu for table-level actions such as export. */
export function DataTableOverflowMenu({
  children,
  label = 'More table actions',
}: DataTableOverflowMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            aria-label={label}
            className={cn(toolbarControlClass, 'size-9 p-0')}
            title={label}
            variant="outline"
          >
            <MoreVerticalIcon className="size-4" />
          </Button>
        }
      />
      <DropdownMenuContent className="min-w-44">{children}</DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Complete optional toolbar composition used by DataTable. */
export function DataTableControls<TData extends RowData>({
  showColumnVisibility,
  enableSearch,
  filterActive,
  filterContent,
  globalFilter,
  menuContent,
  searchPlaceholder,
  table,
  toolbarActions,
  toolbarStart,
}: DataTableControlsProps<TData>) {
  const visible = Boolean(
    toolbarStart ||
      toolbarActions ||
      enableSearch ||
      showColumnVisibility ||
      filterContent ||
      menuContent,
  );

  if (!visible) return null;

  return (
    <DataTableToolbar
      start={toolbarStart}
      end={
        <>
          {filterContent ? (
            <DataTableFilterButton active={filterActive}>
              {filterContent}
            </DataTableFilterButton>
          ) : null}
          {enableSearch ? (
            <DataTableSearch
              label={searchPlaceholder}
              onValueChange={table.setGlobalFilter}
              placeholder={searchPlaceholder}
              value={globalFilter}
            />
          ) : null}
          {toolbarActions}
          {showColumnVisibility ? <DataTableColumnsMenu table={table} /> : null}
          {menuContent ? (
            <DataTableOverflowMenu>{menuContent}</DataTableOverflowMenu>
          ) : null}
        </>
      }
    />
  );
}
