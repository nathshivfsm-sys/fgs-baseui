import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, ReactNode } from 'react';
import { ChevronRightIcon } from '../../../icons';
import { cn } from '../../../lib/cn';
import { cardSurfaceVariants } from '../card';

const settingCardIconVariants = cva(
  'flex size-setting-icon shrink-0 items-center justify-center rounded-metric [&_svg]:size-8',
  {
    variants: {
      tone: {
        blue: 'bg-metric-blue text-metric-blue-foreground',
        green: 'bg-metric-green text-metric-green-foreground',
        orange: 'bg-metric-orange text-metric-orange-foreground',
        purple: 'bg-metric-purple text-metric-purple-foreground',
        neutral: 'bg-metric-neutral text-metric-neutral-foreground',
      },
    },
    defaultVariants: { tone: 'blue' },
  },
);

export type SettingCardTone = NonNullable<
  VariantProps<typeof settingCardIconVariants>['tone']
>;

export interface SettingCardProps
  extends Omit<ComponentProps<'button'>, 'title'>,
    VariantProps<typeof settingCardIconVariants> {
  description?: ReactNode;
  /** Left side of the footer row, e.g. "12 Settings". */
  footerText: ReactNode;
  icon: ReactNode;
  title: ReactNode;
}

/**
 * Setup page category card: icon tile, title, description, and a footer row
 * with a count and a chevron affordance. A real `<button>` (not a `div` with
 * an `onClick`) so it is focusable and operable from the keyboard even before
 * it has a navigation target.
 */
export function SettingCard({
  className,
  description,
  footerText,
  icon,
  title,
  tone,
  type = 'button',
  ...props
}: SettingCardProps) {
  return (
    <button
      className={cn(
        cardSurfaceVariants(),
        'group/setting-card flex w-full flex-col overflow-hidden text-left font-form transition-colors hover:border-input-strong focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30',
        className,
      )}
      data-slot="setting-card"
      type={type}
      {...props}
    >
      <div className="flex flex-1 items-start gap-4 p-5">
        <div
          aria-hidden="true"
          className={settingCardIconVariants({ tone })}
          data-slot="setting-card-icon"
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-body font-bold leading-snug text-heading">
            {title}
          </p>
          {description != null && (
            <p className="mt-1 line-clamp-2 text-caption text-table-foreground">
              {description}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-divider px-5 py-3">
        <span className="text-control text-control-foreground">
          {footerText}
        </span>
        <ChevronRightIcon
          aria-hidden="true"
          className="size-4 shrink-0 text-icon-muted"
        />
      </div>
    </button>
  );
}

export function SettingCardGrid({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3',
        className,
      )}
      data-slot="setting-card-grid"
      {...props}
    />
  );
}

export { settingCardIconVariants };
