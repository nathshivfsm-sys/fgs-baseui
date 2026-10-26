import { cn } from '@cms/ui';
import type { CustomerDetailMetricTileProps } from '../types';

const iconToneClasses = {
  blue: 'bg-data-1 text-data-1-foreground',
  purple: 'bg-data-4 text-data-4-foreground',
} as const;

export const CustomerDetailMetricTile = ({
  caption,
  captionAlign = 'center',
  icon,
  label,
  loading = false,
  tone,
  value,
}: CustomerDetailMetricTileProps) => (
  <article
    className={cn(
      'relative h-48 min-w-0 overflow-hidden',
      'rounded-[10px] border border-[#f7f7f7] bg-surface',
      'shadow-[4px_4px_64px_16px_rgba(0,0,0,0.02)]',
    )}
  >
    <div className="px-5 pt-11">
      <div className="flex items-start gap-2">
        <div
          aria-hidden
          className={cn(
            'flex size-7.5 shrink-0 items-center justify-center rounded-[5px] [&_svg]:size-5',
            iconToneClasses[tone],
          )}
        >
          {icon}
        </div>
        <p className="min-w-0 pt-1.5 text-control font-medium leading-snug text-[#222]">
          {label}
        </p>
      </div>
      <p
        aria-live="polite"
        className="mt-4 text-lg font-semibold tabular-figures text-heading"
      >
        {loading ? (
          <>
            <span
              aria-hidden
              className="my-1 block h-6 w-24 animate-pulse rounded-sm bg-secondary motion-reduce:animate-none"
            />
            <span className="sr-only">Loading value</span>
          </>
        ) : (
          value
        )}
      </p>
    </div>
    <p
      className={cn(
        'absolute bottom-[21px] px-5 text-caption leading-[1.22] text-[#6b7280]',
        captionAlign === 'start' ? 'left-0 text-left' : 'inset-x-0 text-center',
      )}
    >
      {caption}
    </p>
  </article>
);
