import { Drawer as DrawerPrimitive } from '@base-ui/react/drawer';
import type { ComponentProps } from 'react';
import { createContext, useContext, useMemo } from 'react';
import type { StringClassName } from '../../../lib/class-name';
import { cn } from '../../../lib/cn';

interface DrawerContextValue {
  hasSnapPoints: boolean;
  modal: ComponentProps<typeof DrawerPrimitive.Root>['modal'];
  showSwipeHandle: boolean;
  swipeDirection: NonNullable<
    ComponentProps<typeof DrawerPrimitive.Root>['swipeDirection']
  >;
}

const DrawerContext = createContext<DrawerContextValue | null>(null);

/** `DrawerContent` needs the root's swipe/snap configuration to style itself. */
function useDrawer() {
  const context = useContext(DrawerContext);

  if (!context) {
    throw new Error('useDrawer must be used within a Drawer.');
  }

  return context;
}

export interface DrawerProps
  extends ComponentProps<typeof DrawerPrimitive.Root> {
  /** Renders a grab handle on the swipeable edge. */
  showSwipeHandle?: boolean;
}

/** Edge-anchored, swipeable surface. Use `Dialog` for centered, modal decisions. */
export function Drawer({
  modal = true,
  showSwipeHandle = false,
  snapPoints,
  swipeDirection = 'down',
  ...props
}: DrawerProps) {
  const hasSnapPoints = snapPoints != null && snapPoints.length > 0;
  const contextValue = useMemo(
    () => ({ hasSnapPoints, modal, showSwipeHandle, swipeDirection }),
    [hasSnapPoints, modal, showSwipeHandle, swipeDirection],
  );

  return (
    <DrawerContext.Provider value={contextValue}>
      <DrawerPrimitive.Root
        data-slot="drawer"
        modal={modal}
        snapPoints={snapPoints}
        swipeDirection={swipeDirection}
        {...props}
      />
    </DrawerContext.Provider>
  );
}

export const DrawerTrigger = DrawerPrimitive.Trigger;
export const DrawerPortal = DrawerPrimitive.Portal;
export const DrawerClose = DrawerPrimitive.Close;

export type DrawerOverlayProps = StringClassName<
  ComponentProps<typeof DrawerPrimitive.Backdrop>
>;

export function DrawerOverlay({ className, ...props }: DrawerOverlayProps) {
  return (
    <DrawerPrimitive.Backdrop
      className={cn(
        'fixed inset-0 z-50 min-h-dvh select-none bg-black/20 opacity-[max(var(--drawer-overlay-min-opacity,0),calc(1-var(--drawer-swipe-progress)))] transition-opacity duration-450 ease-[cubic-bezier(0.32,0.72,0,1)] supports-backdrop-filter:backdrop-blur-xs data-ending-style:pointer-events-none data-ending-style:opacity-0 data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-snap-points:[--drawer-overlay-min-opacity:0.5] data-starting-style:opacity-0 data-swiping:duration-0 supports-[-webkit-touch-callout:none]:absolute',
        className,
      )}
      data-slot="drawer-overlay"
      {...props}
    />
  );
}

/** Grab affordance on the swipeable edge; decorative, so it stays aria-hidden. */
export function DrawerSwipeHandle({
  className,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'relative z-10 flex shrink-0 cursor-grab transition-opacity duration-200 active:cursor-grabbing group-data-nested-drawer-open/drawer-popup:opacity-0 group-data-nested-drawer-swiping/drawer-popup:opacity-100 group-data-[swipe-axis=x]/drawer-popup:h-full group-data-[swipe-axis=x]/drawer-popup:w-3 group-data-[swipe-axis=x]/drawer-popup:items-center group-data-[swipe-axis=y]/drawer-popup:h-3 group-data-[swipe-axis=y]/drawer-popup:w-full group-data-[swipe-axis=y]/drawer-popup:justify-center group-data-[swipe-direction=down]/drawer-popup:items-end group-data-[swipe-direction=left]/drawer-popup:order-last group-data-[swipe-direction=left]/drawer-popup:justify-start group-data-[swipe-direction=right]/drawer-popup:justify-end group-data-[swipe-direction=up]/drawer-popup:order-last group-data-[swipe-direction=up]/drawer-popup:items-start after:block after:shrink-0 after:rounded-full after:bg-border group-data-[swipe-axis=x]/drawer-popup:after:h-24 group-data-[swipe-axis=x]/drawer-popup:after:w-1 group-data-[swipe-axis=y]/drawer-popup:after:h-1 group-data-[swipe-axis=y]/drawer-popup:after:w-24',
        className,
      )}
      data-slot="drawer-swipe-handle"
      {...props}
    />
  );
}

export type DrawerContentProps = StringClassName<
  ComponentProps<typeof DrawerPrimitive.Popup>
>;

/** Portalled drawer surface; renders its own backdrop when the root is modal. */
export function DrawerContent({
  children,
  className,
  ...props
}: DrawerContentProps) {
  const { hasSnapPoints, modal, showSwipeHandle, swipeDirection } = useDrawer();
  const swipeAxis =
    swipeDirection === 'down' || swipeDirection === 'up' ? 'y' : 'x';

  return (
    <DrawerPortal>
      {modal === true && (
        <DrawerOverlay data-snap-points={hasSnapPoints ? '' : undefined} />
      )}
      <DrawerPrimitive.Viewport
        className="pointer-events-none fixed inset-0 z-50 select-none data-[modal=true]:pointer-events-auto"
        data-modal={modal}
        data-slot="drawer-viewport"
      >
        <DrawerPrimitive.Popup
          className={cn(
            // Base.
            'group/drawer-popup pointer-events-auto fixed z-50 m-(--drawer-inset,0px) flex h-(--drawer-content-height) max-h-(--drawer-content-max-height,none) min-h-0 w-(--drawer-content-width,auto) transform-[translate3d(var(--translate-x,0px),var(--translate-y,0px),0)_scale(var(--stack-scale))] flex-col border-border-component bg-popover font-form text-control text-popover-foreground transition-[transform,height,opacity,filter] duration-450 ease-[cubic-bezier(0.22,1,0.36,1)] outline-none will-change-transform select-none [interpolate-size:allow-keywords] data-[swipe-direction=down]:rounded-t-card data-[swipe-direction=down]:border-t data-[swipe-direction=left]:rounded-r-card data-[swipe-direction=left]:border-r data-[swipe-direction=right]:rounded-l-card data-[swipe-direction=right]:border-l data-[swipe-direction=up]:rounded-b-card data-[swipe-direction=up]:border-b',
            // Nested.
            'data-nested-drawer-open:overflow-hidden data-nested-drawer-open:brightness-95',
            // Bleed.
            'after:pointer-events-none after:absolute after:bg-(--drawer-bleed-background,var(--color-popover)) data-[swipe-axis=x]:after:inset-y-0 data-[swipe-axis=x]:after:w-(--bleed) data-[swipe-axis=y]:after:inset-x-0 data-[swipe-axis=y]:after:h-(--bleed) data-[swipe-direction=down]:after:top-full data-[swipe-direction=left]:after:right-full data-[swipe-direction=right]:after:left-full data-[swipe-direction=up]:after:bottom-full',
            // Sizing.
            '[--drawer-content-height:var(--drawer-height,auto)] data-[swipe-axis=x]:[--drawer-content-width:75%] data-[swipe-axis=y]:[--drawer-content-max-height:calc(100dvh-6rem)] data-[swipe-axis=y]:data-snap-points:[--drawer-content-height:100dvh] data-[swipe-axis=x]:sm:[--drawer-content-width:24rem]',
            // Stack.
            '[--bleed:3rem] [--peek:1rem] [--stack-height:var(--drawer-frontmost-height,var(--drawer-height,0px))] [--stack-peek-offset:max(0px,calc((var(--nested-drawers)-var(--stack-progress))*var(--peek)))] [--stack-progress:clamp(0,var(--drawer-swipe-progress),1)] [--stack-scale-base:max(0,calc(1-(var(--nested-drawers)*var(--stack-step))))] [--stack-scale:clamp(0,calc(var(--stack-scale-base)+(var(--stack-step)*var(--stack-progress))),1)] [--stack-shrink:calc(1-var(--stack-scale))] [--stack-step:0.05]',
            // Transitions.
            'data-ending-style:transform-(--closed-transform) data-ending-style:opacity-[0.9999] data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-nested-drawer-swiping:duration-0 data-ending-style:data-nested-drawer-swiping:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-starting-style:transform-(--closed-transform) data-swiping:duration-0 data-ending-style:data-swiping:duration-[calc(var(--drawer-swipe-strength)*400ms)]',
            // Axis: y.
            'data-[swipe-axis=y]:inset-x-0 data-[swipe-axis=y]:data-nested-drawer-open:h-(--stack-height)',
            // Axis: x.
            'data-[swipe-axis=x]:inset-y-0 data-[swipe-axis=x]:flex-row',
            // Direction: down.
            'data-[swipe-direction=down]:bottom-0 data-[swipe-direction=down]:origin-bottom data-[swipe-direction=down]:[--closed-transform:translate3d(0,calc(100%+var(--drawer-inset,0px)+2px),0)] data-[swipe-direction=down]:[--translate-y:calc(var(--drawer-snap-point-offset,0px)+var(--drawer-swipe-movement-y)-var(--stack-peek-offset)-(var(--stack-shrink)*var(--stack-height)))]',
            // Direction: up.
            'data-[swipe-direction=up]:top-0 data-[swipe-direction=up]:origin-top data-[swipe-direction=up]:[--closed-transform:translate3d(0,calc(-100%-var(--drawer-inset,0px)-2px),0)] data-[swipe-direction=up]:[--translate-y:calc(var(--drawer-snap-point-offset,0px)+var(--drawer-swipe-movement-y)+var(--stack-peek-offset)+(var(--stack-shrink)*var(--stack-height)))]',
            // Direction: left.
            'data-[swipe-direction=left]:left-0 data-[swipe-direction=left]:origin-left data-[swipe-direction=left]:[--closed-transform:translate3d(calc(-100%-var(--drawer-inset,0px)-2px),0,0)] data-[swipe-direction=left]:[--translate-x:calc(var(--drawer-swipe-movement-x)+var(--stack-peek-offset)+(var(--stack-shrink)*100%))]',
            // Direction: right.
            'data-[swipe-direction=right]:right-0 data-[swipe-direction=right]:origin-right data-[swipe-direction=right]:[--closed-transform:translate3d(calc(100%+var(--drawer-inset,0px)+2px),0,0)] data-[swipe-direction=right]:[--translate-x:calc(var(--drawer-swipe-movement-x)-var(--stack-peek-offset)-(var(--stack-shrink)*100%))]',
            className,
          )}
          data-slot="drawer-popup"
          data-snap-points={hasSnapPoints ? '' : undefined}
          data-swipe-axis={swipeAxis}
          {...props}
        >
          {showSwipeHandle && <DrawerSwipeHandle />}
          <DrawerPrimitive.Content
            className="flex min-h-0 flex-1 flex-col overflow-hidden overscroll-contain rounded-[inherit] transition-opacity duration-300 ease-[cubic-bezier(0.45,1.005,0,1.005)] select-text group-data-nested-drawer-open/drawer-popup:opacity-0 group-data-nested-drawer-swiping/drawer-popup:opacity-100 group-data-swiping/drawer-popup:select-none"
            data-slot="drawer-content"
          >
            {children}
          </DrawerPrimitive.Content>
        </DrawerPrimitive.Popup>
      </DrawerPrimitive.Viewport>
    </DrawerPortal>
  );
}

export function DrawerHeader({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex shrink-0 flex-col gap-1 p-4 pb-0 group-data-[swipe-axis=y]/drawer-popup:text-center md:text-left',
        className,
      )}
      data-slot="drawer-header"
      {...props}
    />
  );
}

export function DrawerFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('mt-auto flex shrink-0 flex-col gap-2 p-4 pt-0', className)}
      data-slot="drawer-footer"
      {...props}
    />
  );
}

export type DrawerTitleProps = StringClassName<
  ComponentProps<typeof DrawerPrimitive.Title>
>;

export function DrawerTitle({ className, ...props }: DrawerTitleProps) {
  return (
    <DrawerPrimitive.Title
      className={cn(
        'text-body font-semibold leading-snug text-heading',
        className,
      )}
      data-slot="drawer-title"
      {...props}
    />
  );
}

export type DrawerDescriptionProps = StringClassName<
  ComponentProps<typeof DrawerPrimitive.Description>
>;

export function DrawerDescription({
  className,
  ...props
}: DrawerDescriptionProps) {
  return (
    <DrawerPrimitive.Description
      className={cn('text-balance text-field-foreground', className)}
      data-slot="drawer-description"
      {...props}
    />
  );
}
