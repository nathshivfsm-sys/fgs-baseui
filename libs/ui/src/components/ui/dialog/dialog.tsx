import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import type { ComponentProps, ReactNode } from 'react';
import { CloseIcon } from '../../../icons';
import type { StringClassName } from '../../../lib/class-name';
import { cn } from '../../../lib/cn';
import { Button } from '../button';
import { IconButton } from '../icon-button';

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogClose = DialogPrimitive.Close;

export type DialogOverlayProps = StringClassName<
  ComponentProps<typeof DialogPrimitive.Backdrop>
>;

export function DialogOverlay({ className, ...props }: DialogOverlayProps) {
  return (
    <DialogPrimitive.Backdrop
      className={cn(
        'fixed inset-0 isolate z-50 bg-black/20 transition-opacity duration-100 ease-out supports-backdrop-filter:backdrop-blur-xs data-ending-style:opacity-0 data-starting-style:opacity-0',
        className,
      )}
      data-slot="dialog-overlay"
      {...props}
    />
  );
}

export interface DialogContentProps
  extends StringClassName<ComponentProps<typeof DialogPrimitive.Popup>> {
  /** Renders the top-right close action. Set to `false` for required decisions. */
  showCloseButton?: boolean;
  /** Accessible name for the close action. */
  closeLabel?: string;
}

/** Centered, portalled dialog surface including its own backdrop. */
export function DialogContent({
  children,
  className,
  closeLabel = 'Close',
  showCloseButton = true,
  ...props
}: DialogContentProps) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        className={cn(
          'fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-card border border-border-component bg-popover p-4 font-form text-control text-popover-foreground shadow-surface outline-none transition-[opacity,scale] duration-100 ease-out sm:max-w-sm data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0',
          className,
        )}
        data-slot="dialog-content"
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            render={
              <IconButton
                className="absolute top-2 right-2"
                icon={<CloseIcon className="size-3" />}
                label={closeLabel}
                size="sm"
                variant="ghost"
              />
            }
          />
        )}
      </DialogPrimitive.Popup>
    </DialogPortal>
  );
}

export function DialogHeader({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex flex-col gap-2 pr-8', className)}
      data-slot="dialog-header"
      {...props}
    />
  );
}

export interface DialogFooterProps extends ComponentProps<'div'> {
  /** Appends a dismiss action after `children`. */
  showCloseButton?: boolean;
  /** Label for the appended dismiss action. */
  closeLabel?: ReactNode;
}

/** Action row; edge-to-edge inside `DialogContent`'s padding. */
export function DialogFooter({
  children,
  className,
  closeLabel = 'Close',
  showCloseButton = false,
  ...props
}: DialogFooterProps) {
  return (
    <div
      className={cn(
        '-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-card border-t border-divider bg-secondary/40 p-4 sm:flex-row sm:justify-end',
        className,
      )}
      data-slot="dialog-footer"
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close render={<Button variant="outline" />}>
          {closeLabel}
        </DialogPrimitive.Close>
      )}
    </div>
  );
}

export type DialogTitleProps = StringClassName<
  ComponentProps<typeof DialogPrimitive.Title>
>;

export function DialogTitle({ className, ...props }: DialogTitleProps) {
  return (
    <DialogPrimitive.Title
      className={cn(
        'text-body font-semibold leading-snug text-heading',
        className,
      )}
      data-slot="dialog-title"
      {...props}
    />
  );
}

export type DialogDescriptionProps = StringClassName<
  ComponentProps<typeof DialogPrimitive.Description>
>;

export function DialogDescription({
  className,
  ...props
}: DialogDescriptionProps) {
  return (
    <DialogPrimitive.Description
      className={cn('text-field-foreground', className)}
      data-slot="dialog-description"
      {...props}
    />
  );
}
