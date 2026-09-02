import { Popover as PopoverPrimitive } from '@base-ui/react/popover';
import type { ComponentProps } from 'react';
import type { StringClassName } from '../../../lib/class-name';
import { cn } from '../../../lib/cn';

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverClose = PopoverPrimitive.Close;

export interface PopoverContentProps
  extends StringClassName<ComponentProps<typeof PopoverPrimitive.Popup>>,
    Pick<
      ComponentProps<typeof PopoverPrimitive.Positioner>,
      'align' | 'alignOffset' | 'side' | 'sideOffset'
    > {}

/** Portalled popover surface; positioning props are forwarded to the positioner. */
export function PopoverContent({
  align = 'center',
  alignOffset = 0,
  className,
  side = 'bottom',
  sideOffset = 4,
  ...props
}: PopoverContentProps) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        className="isolate z-50"
        side={side}
        sideOffset={sideOffset}
      >
        <PopoverPrimitive.Popup
          className={cn(
            'flex w-72 origin-(--transform-origin) flex-col gap-2.5 rounded-md border border-border-component bg-popover p-3 text-control text-popover-foreground shadow-surface outline-none transition-[opacity,transform] duration-100 ease-out data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0',
            className,
          )}
          data-slot="popover-content"
          {...props}
        />
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  );
}

export function PopoverHeader({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex flex-col gap-0.5', className)}
      data-slot="popover-header"
      {...props}
    />
  );
}

/** Trailing action row, e.g. Cancel and Save for an inline edit form. */
export function PopoverFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex items-center justify-end gap-2', className)}
      data-slot="popover-footer"
      {...props}
    />
  );
}

export type PopoverTitleProps = StringClassName<
  ComponentProps<typeof PopoverPrimitive.Title>
>;

export function PopoverTitle({ className, ...props }: PopoverTitleProps) {
  return (
    <PopoverPrimitive.Title
      className={cn('font-semibold text-card-foreground', className)}
      data-slot="popover-title"
      {...props}
    />
  );
}

export type PopoverDescriptionProps = StringClassName<
  ComponentProps<typeof PopoverPrimitive.Description>
>;

export function PopoverDescription({
  className,
  ...props
}: PopoverDescriptionProps) {
  return (
    <PopoverPrimitive.Description
      className={cn('text-field-foreground', className)}
      data-slot="popover-description"
      {...props}
    />
  );
}
