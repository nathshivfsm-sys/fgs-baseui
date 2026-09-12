import type { ReactNode } from 'react';
import { Body, BodySmall, ChevronRightIcon, cn } from '@cms/ui';

export interface CatalogNavCardProps {
  activeCount?: number;
  description: string;
  icon: ReactNode;
  iconClassName?: string;
  onSelect: () => void;
  selected: boolean;
  title: string;
}

export function CatalogNavCard({
  activeCount,
  description,
  icon,
  iconClassName,
  onSelect,
  selected,
  title,
}: CatalogNavCardProps) {
  const countLabel =
    activeCount === undefined ? '—' : `${activeCount} Active`;

  return (
    <button
      aria-current={selected ? 'true' : undefined}
      className={cn(
        'flex w-full flex-col rounded-xl border p-4 text-left transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30',
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
      <BodySmall className="mt-2 text-caption" color="foreground-subtle">
        {description}
      </BodySmall>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-caption font-medium text-action">{countLabel}</span>
        <span className="inline-flex items-center gap-0.5 text-caption font-medium text-action">
          View
          <ChevronRightIcon className="size-3" />
        </span>
      </div>
    </button>
  );
}
