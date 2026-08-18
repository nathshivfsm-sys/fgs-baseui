import { Menu } from '@base-ui/react/menu';
import type { ComponentProps } from 'react';
import type { StringClassName } from '../../../lib/class-name';
import { cn } from '../../../lib/cn';

export const DropdownMenu = Menu.Root;
export const DropdownMenuTrigger = Menu.Trigger;
/** Groups related items with a `DropdownMenuLabel`; Base UI requires the pairing. */
export const DropdownMenuGroup = Menu.Group;

export interface DropdownMenuContentProps
  extends StringClassName<ComponentProps<typeof Menu.Popup>> {
  align?: ComponentProps<typeof Menu.Positioner>['align'];
  sideOffset?: ComponentProps<typeof Menu.Positioner>['sideOffset'];
}

/** Portalled options surface with native Base UI keyboard navigation. */
export function DropdownMenuContent({
  align = 'end',
  className,
  sideOffset = 6,
  ...props
}: DropdownMenuContentProps) {
  return (
    <Menu.Portal>
      <Menu.Positioner align={align} className="z-50" sideOffset={sideOffset}>
        <Menu.Popup
          className={cn(
            'min-w-[8rem] overflow-hidden rounded-md border border-border-component bg-popover p-1 text-popover-foreground shadow-surface',
            className,
          )}
          {...props}
        />
      </Menu.Positioner>
    </Menu.Portal>
  );
}

export type DropdownMenuItemProps = StringClassName<
  ComponentProps<typeof Menu.Item>
>;

export function DropdownMenuItem({
  className,
  ...props
}: DropdownMenuItemProps) {
  return (
    <Menu.Item
      className={cn(
        'relative flex min-h-8 cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-control outline-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}

export type DropdownMenuLabelProps = StringClassName<
  ComponentProps<typeof Menu.GroupLabel>
>;

/** Must be rendered inside a `DropdownMenuGroup`. */
export function DropdownMenuLabel({
  className,
  ...props
}: DropdownMenuLabelProps) {
  return (
    <Menu.GroupLabel
      className={cn(
        'px-2 py-1.5 text-caption font-semibold text-muted-foreground',
        className,
      )}
      {...props}
    />
  );
}

export type DropdownMenuSeparatorProps = StringClassName<
  ComponentProps<typeof Menu.Separator>
>;

export function DropdownMenuSeparator({
  className,
  ...props
}: DropdownMenuSeparatorProps) {
  return (
    <Menu.Separator
      className={cn('-mx-1 my-1 h-px bg-divider', className)}
      {...props}
    />
  );
}
