import { ScrollArea as ScrollAreaPrimitive } from '@base-ui/react/scroll-area';
import type { ComponentProps } from 'react';
import type { StringClassName } from '../../../lib/class-name';
import { cn } from '../../../lib/cn';

export interface ScrollAreaProps
  extends StringClassName<ComponentProps<typeof ScrollAreaPrimitive.Root>> {
  /** Which scrollbars to render. Defaults to vertical only. */
  orientation?: 'vertical' | 'horizontal' | 'both';
  /** Applied to the scrolling viewport rather than the outer wrapper. */
  viewportClassName?: string;
}

/**
 * Custom-scrollbar wrapper. Constrain it with a height (and a width for
 * horizontal scrolling) via `className`; the viewport inherits the radius.
 */
export function ScrollArea({
  children,
  className,
  orientation = 'vertical',
  viewportClassName,
  ...props
}: ScrollAreaProps) {
  const showVertical = orientation === 'vertical' || orientation === 'both';
  const showHorizontal = orientation === 'horizontal' || orientation === 'both';

  return (
    <ScrollAreaPrimitive.Root
      className={cn('relative', className)}
      data-slot="scroll-area"
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        className={cn(
          'size-full rounded-[inherit] outline-none transition-[box-shadow] focus-visible:ring-[3px] focus-visible:ring-ring/30',
          viewportClassName,
        )}
        data-slot="scroll-area-viewport"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      {showVertical && <ScrollBar orientation="vertical" />}
      {showHorizontal && <ScrollBar orientation="horizontal" />}
      {orientation === 'both' && (
        <ScrollAreaPrimitive.Corner data-slot="scroll-area-corner" />
      )}
    </ScrollAreaPrimitive.Root>
  );
}

export type ScrollBarProps = StringClassName<
  ComponentProps<typeof ScrollAreaPrimitive.Scrollbar>
>;

export function ScrollBar({
  className,
  orientation = 'vertical',
  ...props
}: ScrollBarProps) {
  return (
    <ScrollAreaPrimitive.Scrollbar
      // Base UI publishes the orientation as `data-orientation="vertical|horizontal"`,
      // not as bare `data-vertical`/`data-horizontal` attributes.
      className={cn(
        'flex touch-none select-none p-px transition-colors data-[orientation=horizontal]:h-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:border-t data-[orientation=horizontal]:border-t-transparent data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2.5 data-[orientation=vertical]:border-l data-[orientation=vertical]:border-l-transparent',
        className,
      )}
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      {...props}
    >
      <ScrollAreaPrimitive.Thumb
        className="relative flex-1 rounded-full bg-border"
        data-slot="scroll-area-thumb"
      />
    </ScrollAreaPrimitive.Scrollbar>
  );
}
