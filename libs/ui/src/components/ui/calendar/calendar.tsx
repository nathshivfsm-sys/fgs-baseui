import type { ComponentProps } from 'react';
import { useEffect, useRef } from 'react';
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
  type Locale,
} from 'react-day-picker';
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '../../../icons';
import { cn } from '../../../lib/cn';
import { Button, buttonVariants, type ButtonProps } from '../button';

/** Intersection rather than `interface extends`: `DayPicker`'s props are a union of selection modes. */
export type CalendarProps = ComponentProps<typeof DayPicker> & {
  /** Variant applied to the month navigation buttons. */
  buttonVariant?: ButtonProps['variant'];
};

/** Date picker built on react-day-picker, styled with the library's Button and icons. */
export function Calendar({
  buttonVariant = 'ghost',
  captionLayout = 'label',
  className,
  classNames,
  components,
  formatters,
  locale,
  showOutsideDays = true,
  showWeekNumber,
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      captionLayout={captionLayout}
      className={cn(
        'group/calendar bg-surface p-2 text-surface-foreground [--cell-radius:var(--radius-md)] [--cell-size:--spacing(8)] in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent',
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className,
      )}
      classNames={{
        root: cn('w-fit', defaultClassNames.root),
        months: cn(
          'relative flex flex-col gap-4 md:flex-row',
          defaultClassNames.months,
        ),
        month: cn('flex w-full flex-col gap-4', defaultClassNames.month),
        nav: cn(
          'absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1',
          defaultClassNames.nav,
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          'size-(--cell-size) p-0 select-none aria-disabled:opacity-50',
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          'size-(--cell-size) p-0 select-none aria-disabled:opacity-50',
          defaultClassNames.button_next,
        ),
        month_caption: cn(
          'flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)',
          defaultClassNames.month_caption,
        ),
        dropdowns: cn(
          'flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-control font-medium',
          defaultClassNames.dropdowns,
        ),
        dropdown_root: cn(
          'relative rounded-(--cell-radius)',
          defaultClassNames.dropdown_root,
        ),
        dropdown: cn(
          'absolute inset-0 bg-surface opacity-0',
          defaultClassNames.dropdown,
        ),
        caption_label: cn(
          'font-medium select-none',
          captionLayout === 'label'
            ? 'text-control'
            : 'flex items-center gap-1 rounded-(--cell-radius) text-control [&>svg]:size-3.5 [&>svg]:text-icon-muted',
          defaultClassNames.caption_label,
        ),
        month_grid: cn('w-full border-collapse', defaultClassNames.month_grid),
        weekdays: cn('flex', defaultClassNames.weekdays),
        weekday: cn(
          'flex-1 rounded-(--cell-radius) text-caption font-normal text-input-foreground select-none',
          defaultClassNames.weekday,
        ),
        week: cn('mt-2 flex w-full', defaultClassNames.week),
        week_number_header: cn(
          'w-(--cell-size) select-none',
          defaultClassNames.week_number_header,
        ),
        week_number: cn(
          'text-caption text-input-foreground select-none',
          defaultClassNames.week_number,
        ),
        day: cn(
          'group/day relative aspect-square h-full w-full rounded-(--cell-radius) p-0 text-center select-none [&:last-child[data-selected=true]_button]:rounded-r-(--cell-radius)',
          showWeekNumber
            ? '[&:nth-child(2)[data-selected=true]_button]:rounded-l-(--cell-radius)'
            : '[&:first-child[data-selected=true]_button]:rounded-l-(--cell-radius)',
          defaultClassNames.day,
        ),
        range_start: cn(
          'relative isolate z-0 rounded-l-(--cell-radius) bg-primary-subtle',
          defaultClassNames.range_start,
        ),
        range_middle: cn(
          'rounded-none bg-primary-subtle',
          defaultClassNames.range_middle,
        ),
        range_end: cn(
          'relative isolate z-0 rounded-r-(--cell-radius) bg-primary-subtle',
          defaultClassNames.range_end,
        ),
        today: cn(
          'rounded-(--cell-radius) bg-secondary text-surface-foreground data-[selected=true]:rounded-none',
          defaultClassNames.today,
        ),
        outside: cn(
          'text-input-foreground aria-selected:text-input-foreground',
          defaultClassNames.outside,
        ),
        disabled: cn(
          'text-input-foreground opacity-50',
          defaultClassNames.disabled,
        ),
        hidden: cn('invisible', defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className: rootClassName, rootRef, ...rootProps }) => (
          <div
            className={cn(rootClassName)}
            data-slot="calendar"
            ref={rootRef}
            {...rootProps}
          />
        ),
        Chevron: ({ className: chevronClassName, orientation }) => {
          const chevronClasses = cn('size-4', chevronClassName);
          if (orientation === 'left') {
            return <ChevronLeftIcon className={chevronClasses} />;
          }
          if (orientation === 'right') {
            return <ChevronRightIcon className={chevronClasses} />;
          }
          return <ChevronDownIcon className={chevronClasses} />;
        },
        DayButton: (dayButtonProps) => (
          <CalendarDayButton locale={locale} {...dayButtonProps} />
        ),
        // `week` is react-day-picker's data object, not a DOM attribute, and the
        // element must stay a `th` for the `scope="row"` the library sets on it.
        WeekNumber: ({ children, week: _week, ...weekNumberProps }) => (
          <th {...weekNumberProps}>
            <div className="flex size-(--cell-size) items-center justify-center text-center">
              {children}
            </div>
          </th>
        ),
        ...components,
      }}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString(locale?.code, { month: 'short' }),
        ...formatters,
      }}
      locale={locale}
      showOutsideDays={showOutsideDays}
      showWeekNumber={showWeekNumber}
      {...props}
    />
  );
}

export interface CalendarDayButtonProps
  extends ComponentProps<typeof DayButton> {
  locale?: Partial<Locale>;
}

/** Single day cell; reuses `Button` so focus, hover, and disabled states stay consistent. */
export function CalendarDayButton({
  className,
  day,
  locale,
  modifiers,
  ...props
}: CalendarDayButtonProps) {
  const defaultClassNames = getDefaultClassNames();
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <Button
      className={cn(
        'relative isolate z-10 flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 border-0 font-normal leading-none group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] group-data-[focused=true]/day:ring-ring/30 data-[range-end=true]:rounded-(--cell-radius) data-[range-end=true]:bg-primary data-[range-end=true]:text-action-foreground data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-primary-subtle data-[range-middle=true]:text-primary-subtle-foreground data-[range-start=true]:rounded-(--cell-radius) data-[range-start=true]:bg-primary data-[range-start=true]:text-action-foreground data-[selected-single=true]:bg-primary data-[selected-single=true]:text-action-foreground [&>span]:text-caption [&>span]:opacity-70',
        defaultClassNames.day,
        className,
      )}
      data-day={day.date.toLocaleDateString(locale?.code)}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      data-range-start={modifiers.range_start}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      ref={ref}
      size="icon"
      variant="ghost"
      {...props}
    />
  );
}
