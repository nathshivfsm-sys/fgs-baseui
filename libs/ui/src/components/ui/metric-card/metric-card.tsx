import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../../lib/cn';

const metricCardIconVariants = cva(
  'flex size-metric-icon shrink-0 items-center justify-center rounded-md [&_svg]:size-[22px]',
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

const metricCardDescriptionVariants = cva('text-caption leading-4', {
  variants: {
    tone: {
      default: 'text-table-foreground',
      positive: 'text-metric-positive',
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
        'flex min-h-metric-card min-w-0 items-center gap-3 rounded-metric border border-divider bg-card px-4 py-3 text-card-foreground',
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
        <p className="text-caption leading-4 text-table-foreground">{label}</p>
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
          <p
            className={metricCardDescriptionVariants({ tone: descriptionTone })}
          >
            {description}
          </p>
        )}
      </div>
    </article>
  );
}

export { metricCardDescriptionVariants, metricCardIconVariants };
