import { Body, BodySmall, ChevronRightIcon, cn } from '@cms/ui';
import type { CatalogNavCardProps } from '../types';

export const CatalogNavCard = ({
  activeCount,
  inactiveCount,
  description,
  icon,
  iconClassName,
  onSelect,
  selected,
  title,
}: CatalogNavCardProps) => {
  const countLabel =
    activeCount === undefined ? (
      '—'
    ) : inactiveCount === undefined ? (
      `${activeCount} Active`
    ) : (
      <>
        {activeCount} Active{' '}
        <span className="text-foreground-muted">
          • {inactiveCount} Inactive
        </span>
      </>
    );

  return (
    <button
      aria-current={selected ? 'true' : undefined}
      className={cn(
        'flex w-full flex-col items-stretch rounded-xl border p-4 text-left transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30',
        selected
          ? 'border-action bg-action-subtle'
          : 'border-border bg-surface hover:border-input-strong',
      )}
      onClick={onSelect}
      type="button"
    >
      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className={cn(
            'flex size-8 shrink-0 items-center justify-center rounded-lg [&_svg]:size-4',
            iconClassName,
          )}
        >
          {icon}
        </span>
        <Body bold className="leading-5" color="heading">
          {title}
        </Body>
      </div>
      <BodySmall className="mt-2 text-caption" color="foreground-muted">
        {description}
      </BodySmall>
      <div className="mt-3 flex w-full items-center justify-between">
        <span className="text-caption font-medium text-action">
          {countLabel}
        </span>
        <span className="inline-flex items-center gap-0.5 text-caption font-medium text-action">
          View
          <ChevronRightIcon className="size-3" />
        </span>
      </div>
    </button>
  );
};
