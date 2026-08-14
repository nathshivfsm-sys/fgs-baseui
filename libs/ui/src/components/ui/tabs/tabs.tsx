import * as TabsPrimitive from '@radix-ui/react-tabs';
import type { ComponentProps } from 'react';
import { cn } from '../../../lib/cn';

export const Tabs = TabsPrimitive.Root;

export function TabsList({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn('flex items-center overflow-x-auto font-form', className)}
      {...props}
    />
  );
}

/** Accessible tab trigger with the Figma indigo active underline. */
export function TabsTrigger({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        'shrink-0 rounded-t-sm border-b border-input px-3 pt-2 pb-3 text-body leading-[1.4] text-card-foreground outline-none transition-[color,border-color,background-color,box-shadow] hover:bg-accent/50 focus-visible:ring-[3px] focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-b-2 data-[state=active]:border-tab-active data-[state=active]:font-semibold data-[state=active]:text-tab-active',
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cn(
        'mt-4 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30',
        className,
      )}
      {...props}
    />
  );
}
