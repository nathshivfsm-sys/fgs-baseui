import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip';
import type { ComponentProps } from 'react';
import type { StringClassName } from '../../../lib/class-name';
import { cn } from '../../../lib/cn';

export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

export type TooltipProviderProps = ComponentProps<
  typeof TooltipPrimitive.Provider
>;

/** Shares one open/close delay across the tooltips it wraps. */
export function TooltipProvider({ delay = 0, ...props }: TooltipProviderProps) {
  return <TooltipPrimitive.Provider delay={delay} {...props} />;
}

export interface TooltipContentProps
  extends StringClassName<ComponentProps<typeof TooltipPrimitive.Popup>>,
    Pick<
      ComponentProps<typeof TooltipPrimitive.Positioner>,
      'align' | 'alignOffset' | 'side' | 'sideOffset'
    > {
  /** Renders the caret pointing at the trigger. */
  showArrow?: boolean;
}

/**
 * Inverted-surface label for an adjacent control. Keep it to a short phrase:
 * tooltips are supplementary, so never put essential content or actions here.
 */
export function TooltipContent({
  align = 'center',
  alignOffset = 0,
  children,
  className,
  showArrow = true,
  side = 'top',
  sideOffset = 4,
  ...props
}: TooltipContentProps) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        className="isolate z-50"
        side={side}
        sideOffset={sideOffset}
      >
        <TooltipPrimitive.Popup
          className={cn(
            'relative inline-flex w-fit max-w-xs origin-(--transform-origin) items-center gap-1.5 rounded-md bg-foreground-strong px-3 py-1.5 font-form text-caption text-background transition-[opacity,transform] duration-100 ease-out data-ending-style:scale-95 data-ending-style:opacity-0 data-instant:transition-none data-starting-style:scale-95 data-starting-style:opacity-0',
            className,
          )}
          data-slot="tooltip-content"
          {...props}
        >
          {children}
          {showArrow && (
            // Geometry follows Base UI's reference arrow: a rotated square
            // pseudo-element inside a clipped box, offset per resolved side.
            <TooltipPrimitive.Arrow
              className="relative block h-1.5 w-3 overflow-clip before:absolute before:bottom-0 before:left-1/2 before:h-[calc(6px*sqrt(2))] before:w-[calc(6px*sqrt(2))] before:bg-foreground-strong before:content-[''] before:[transform:translate(-50%,50%)_rotate(45deg)] data-[side=bottom]:top-[-6px] data-[side=left]:right-[-9px] data-[side=left]:rotate-90 data-[side=right]:left-[-9px] data-[side=right]:-rotate-90 data-[side=top]:bottom-[-6px] data-[side=top]:rotate-180"
              data-slot="tooltip-arrow"
            />
          )}
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  );
}
