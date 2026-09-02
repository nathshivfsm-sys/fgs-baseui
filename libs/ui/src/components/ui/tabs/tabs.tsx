import { Tabs as TabsPrimitive } from '@base-ui/react/tabs';
import { cva, type VariantProps } from 'class-variance-authority';
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

const tabsListVariants = cva('flex items-center overflow-x-auto', {
  variants: {
    /** Draws the full-width hairline the compact tabs sit on. */
    bordered: { false: '', true: 'border-b border-border-soft' },
    /** Pill-track container for `TabsTrigger`'s `tone: 'segmented'`. */
    variant: {
      default: '',
      segmented: 'gap-1 rounded-lg bg-secondary p-1',
    },
  },
  defaultVariants: { bordered: false, variant: 'default' },
});

export interface TabsListProps
  extends StringClassName<ComponentProps<typeof TabsPrimitive.List>>,
    VariantProps<typeof tabsListVariants> {}

export function TabsList({
  bordered,
  className,
  variant,
  ...props
}: TabsListProps) {
  return (
    <TabsPrimitive.List
      activateOnFocus
      className={cn(tabsListVariants({ bordered, variant }), className)}
      {...props}
    />
  );
}

const tabsTriggerVariants = cva(
  'shrink-0 rounded-t-sm outline-none transition-[color,border-color,background-color,box-shadow] hover:bg-accent/50 focus-visible:ring-[3px] focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50 data-active:font-semibold',
  {
    variants: {
      size: {
        default:
          'border-b border-input px-3 pt-2 pb-3 text-body leading-[1.4] data-active:border-b-2',
        /**
         * 12px capitalised notes tabs. The resting hairline comes from
         * `TabsList bordered`; the active tab overlaps it with its own border.
         */
        sm: 'border-b border-transparent px-3 py-1.5 text-caption font-medium capitalize leading-4 data-active:-mb-px',
        /** Pairs with `TabsList variant="segmented"` — the Login identifier tabs. */
        segmented:
          'flex-1 justify-center gap-2 rounded-md px-4 py-2.5 text-control leading-5',
      },
      tone: {
        default:
          'text-card-foreground data-active:border-tab-active data-active:text-tab-active',
        /** Interactive blue used by the Service Location screens. */
        action:
          'text-heading data-active:border-action data-active:text-action',
        /**
         * White pill on the active tab, matching the segmented track.
         * `text-muted-foreground` on `bg-secondary` reads 4.4:1, just under
         * AA — `text-control-foreground` is the darker token that clears it.
         */
        segmented:
          'text-control-foreground data-active:bg-card data-active:text-brand-blue data-active:shadow-xs',
      },
    },
    defaultVariants: { size: 'default', tone: 'default' },
  },
);

export interface TabsTriggerProps
  extends Omit<
      StringClassName<ComponentProps<typeof TabsPrimitive.Tab>>,
      'value'
    >,
    VariantProps<typeof tabsTriggerVariants> {
  value: string;
}

/** Accessible tab trigger; `tone` selects the active underline colour. */
export function TabsTrigger({
  className,
  size,
  tone,
  ...props
}: TabsTriggerProps) {
  return (
    <TabsPrimitive.Tab
      className={cn(tabsTriggerVariants({ size, tone }), className)}
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

export { tabsListVariants, tabsTriggerVariants };
