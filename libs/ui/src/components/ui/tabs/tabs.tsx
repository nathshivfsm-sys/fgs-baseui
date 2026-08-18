import { Tabs as TabsPrimitive } from '@base-ui/react/tabs';
import type { ComponentProps } from 'react';
import type { StringClassName } from '../../../lib/class-name';
import { cn } from '../../../lib/cn';

export interface TabsProps
  extends Omit<
    StringClassName<ComponentProps<typeof TabsPrimitive.Root>>,
    'defaultValue' | 'value'
  > {
  defaultValue?: string;
  value?: string;
}

export function Tabs(props: TabsProps) {
  return <TabsPrimitive.Root {...props} />;
}

export type TabsListProps = StringClassName<
  ComponentProps<typeof TabsPrimitive.List>
>;

export function TabsList({ className, ...props }: TabsListProps) {
  return (
    <TabsPrimitive.List
      activateOnFocus
      className={cn('flex items-center overflow-x-auto font-form', className)}
      {...props}
    />
  );
}

export interface TabsTriggerProps
  extends Omit<
    StringClassName<ComponentProps<typeof TabsPrimitive.Tab>>,
    'value'
  > {
  value: string;
}

/** Accessible tab trigger with the Figma indigo active underline. */
export function TabsTrigger({ className, ...props }: TabsTriggerProps) {
  return (
    <TabsPrimitive.Tab
      className={cn(
        'shrink-0 rounded-t-sm border-b border-input px-3 pt-2 pb-3 text-body leading-[1.4] text-card-foreground outline-none transition-[color,border-color,background-color,box-shadow] hover:bg-accent/50 focus-visible:ring-[3px] focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50 data-active:border-b-2 data-active:border-tab-active data-active:font-semibold data-active:text-tab-active',
        className,
      )}
      {...props}
    />
  );
}

export interface TabsContentProps
  extends Omit<
    StringClassName<ComponentProps<typeof TabsPrimitive.Panel>>,
    'value'
  > {
  value: string;
}

export function TabsContent({ className, ...props }: TabsContentProps) {
  return (
    <TabsPrimitive.Panel
      className={cn(
        'mt-4 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30',
        className,
      )}
      {...props}
    />
  );
}
