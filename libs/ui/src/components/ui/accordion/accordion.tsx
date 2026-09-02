import { Accordion as AccordionPrimitive } from '@base-ui/react/accordion';
import type { ComponentProps } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '../../../icons';
import type { StringClassName } from '../../../lib/class-name';
import { cn } from '../../../lib/cn';

export type AccordionProps = StringClassName<
  ComponentProps<typeof AccordionPrimitive.Root>
>;

export function Accordion({ className, ...props }: AccordionProps) {
  return (
    <AccordionPrimitive.Root
      className={cn('flex w-full flex-col', className)}
      data-slot="accordion"
      {...props}
    />
  );
}

export type AccordionItemProps = StringClassName<
  ComponentProps<typeof AccordionPrimitive.Item>
>;

export function AccordionItem({ className, ...props }: AccordionItemProps) {
  return (
    <AccordionPrimitive.Item
      className={cn('not-last:border-b not-last:border-divider', className)}
      data-slot="accordion-item"
      {...props}
    />
  );
}

export type AccordionTriggerProps = StringClassName<
  ComponentProps<typeof AccordionPrimitive.Trigger>
>;

/** Full-width disclosure control; the chevron flips to reflect the open state. */
export function AccordionTrigger({
  children,
  className,
  ...props
}: AccordionTriggerProps) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          'group/accordion-trigger flex flex-1 items-center justify-between gap-3 rounded-sm py-2.5 text-left text-control font-medium text-card-foreground outline-none transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-icon-muted',
          className,
        )}
        data-slot="accordion-trigger"
        {...props}
      >
        {children}
        <ChevronDownIcon className="group-aria-expanded/accordion-trigger:hidden" />
        <ChevronUpIcon className="hidden group-aria-expanded/accordion-trigger:block" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

export type AccordionContentProps = StringClassName<
  ComponentProps<typeof AccordionPrimitive.Panel>
>;

/** Height is animated with Base UI's `--accordion-panel-height` and starting/ending styles. */
export function AccordionContent({
  children,
  className,
  ...props
}: AccordionContentProps) {
  return (
    <AccordionPrimitive.Panel
      className="h-(--accordion-panel-height) overflow-hidden text-control text-card-foreground transition-[height] duration-200 ease-out data-ending-style:h-0 data-starting-style:h-0"
      data-slot="accordion-content"
      {...props}
    >
      <div className={cn('pb-2.5', className)}>{children}</div>
    </AccordionPrimitive.Panel>
  );
}
