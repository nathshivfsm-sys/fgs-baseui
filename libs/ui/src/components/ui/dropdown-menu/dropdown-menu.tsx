import { Menu } from '@base-ui/react/menu';
import { cva, type VariantProps } from 'class-variance-authority';
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
            // 6px padding is what insets the highlighted row from the popup
            // edges in the designs.
            'min-w-52 overflow-hidden rounded-metric border border-border-soft bg-popover p-1.5 text-popover-foreground shadow-popup',
            className,
          )}
          {...props}
        />
      </Menu.Positioner>
    </Menu.Portal>
  );
}

const dropdownMenuItemVariants = cva(
  'relative flex min-h-9 cursor-default select-none items-center gap-3 rounded-md px-3 py-1.5 text-control font-medium outline-none transition-colors data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        /** Muted leading icon that adopts the action blue while highlighted. */
        default:
          'text-control-foreground data-highlighted:bg-action-subtle data-highlighted:text-action [&_svg]:text-icon-muted data-highlighted:[&_svg]:text-action',
        destructive:
          'text-destructive data-highlighted:bg-destructive/10 data-highlighted:text-destructive-strong [&_svg]:text-destructive data-highlighted:[&_svg]:text-destructive-strong',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface DropdownMenuItemProps
  extends StringClassName<ComponentProps<typeof Menu.Item>>,
    VariantProps<typeof dropdownMenuItemVariants> {}

export function DropdownMenuItem({
  className,
  variant,
  ...props
}: DropdownMenuItemProps) {
  return (
    <Menu.Item
      className={cn(dropdownMenuItemVariants({ variant }), className)}
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
        'px-3 py-1.5 text-caption font-semibold text-muted-foreground',
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
      className={cn('-mx-1.5 my-1.5 h-px bg-divider', className)}
      {...props}
    />
  );
}

export { dropdownMenuItemVariants };
