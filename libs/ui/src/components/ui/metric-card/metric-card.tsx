import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../../lib/cn';
import { BodySmall } from '../typography';

const metricCardIconVariants = cva(
  'flex size-11 shrink-0 items-center justify-center rounded-md [&_svg]:size-[22px]',
  {
    variants: {
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

const metricCardDescriptionVariants = cva('text-caption leading-4', {
  variants: {
    tone: {
      default: 'text-foreground-subtle',
      positive: 'text-success-strong',
      negative: 'text-destructive',
    },
  },
  defaultVariants: { tone: 'default' },
});

export type MetricCardTone = NonNullable<
  VariantProps<typeof metricCardIconVariants>['tone']
>;
export type MetricCardDescriptionTone = NonNullable<
  VariantProps<typeof metricCardDescriptionVariants>['tone']
>;
export interface MetricCardProps
  extends Omit<ComponentProps<'article'>, 'title'>,
    VariantProps<typeof metricCardIconVariants> {
  description?: ReactNode;
  descriptionTone?: MetricCardDescriptionTone;
  icon?: ReactNode;
  label: ReactNode;
  loading?: boolean;
  value: ReactNode;
}

/** Reusable responsive card for a key metric and its supporting context. */
export function MetricCard({
  className,
  description,
  descriptionTone,
  icon,
  label,
  loading = false,
  tone,
  value,
  ...props
}: MetricCardProps) {
  return (
    <article
      aria-busy={loading || undefined}
      className={cn(
        'flex min-h-26 min-w-0 items-center gap-3 rounded-lg border border-divider bg-surface px-4 py-3 text-surface-foreground',
        className,
      )}
      {...props}
    >
      {icon != null && (
        <div
          aria-hidden="true"
          className={metricCardIconVariants({ tone })}
          data-slot="metric-card-icon"
        >
          {icon}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <BodySmall className="text-caption leading-4" color="foreground-subtle">
          {label}
        </BodySmall>
        <div
          aria-live="polite"
          className="text-metric-value font-bold text-heading tabular-figures"
        >
          {loading ? (
            <>
              <span
                aria-hidden="true"
                className="my-1 block h-5 w-12 animate-pulse rounded-sm bg-secondary motion-reduce:animate-none"
              />
              <span className="sr-only">Loading value</span>
            </>
          ) : (
            value
          )}
        </div>
        {description != null && (
          <BodySmall
            className={metricCardDescriptionVariants({ tone: descriptionTone })}
          >
            {description}
          </BodySmall>
        )}
      </div>
    </article>
  );
}

export { metricCardDescriptionVariants, metricCardIconVariants };
