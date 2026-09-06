import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, ReactNode } from 'react';
import { ChevronRightIcon } from '../../../icons';
import { cn } from '../../../lib/cn';
import { cardSurfaceVariants } from '../card';
import { Body, BodySmall } from '../typography';

// 60px icon tile from Figma node 70:231. Previously `--spacing-setting-icon`;
// spacing is now Tailwind's numeric scale, so 60px is `size-15`.
const settingCardIconVariants = cva(
  'flex size-15 shrink-0 items-center justify-center rounded-lg [&_svg]:size-8',
  {
    variants: {
      /**
       * Tones map onto the categorical `data-*` roles rather than colour names,
       * so retinting a slot in the theme moves every card using it.
       */
      tone: {
        blue: 'bg-data-1 text-data-1-foreground',
        green: 'bg-data-2 text-data-2-foreground',
        orange: 'bg-data-3 text-data-3-foreground',
        purple: 'bg-data-4 text-data-4-foreground',
        neutral: 'bg-data-5 text-data-5-foreground',
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
        'group/setting-card flex w-full flex-col overflow-hidden text-left transition-colors hover:border-input-strong focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30',
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
          <Body bold className="leading-snug" color="heading" truncationEnabled>
            {title}
          </Body>
          {description != null && (
            <BodySmall
              className="mt-1 line-clamp-2 text-caption"
              color="foreground-subtle"
            >
              {description}
            </BodySmall>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-divider px-5 py-3">
        <span className="text-control text-foreground">{footerText}</span>
        <ChevronRightIcon
          aria-hidden="true"
          className="size-4 shrink-0 text-icon-muted"
        />
      </div>
    </button>
  );
}

export function SettingCardGrid({
  className,
  ...props
}: ComponentProps<'div'>) {
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
