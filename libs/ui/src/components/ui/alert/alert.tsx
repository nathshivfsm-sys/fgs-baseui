import { cva, type VariantProps } from 'class-variance-authority';
import type { ReactNode } from 'react';
import {
  AlertTriangleIcon,
  CircleCheckIcon,
  CircleXIcon,
  CloseIcon,
  InfoCircleIcon,
} from '../../../icons';
import { cn } from '../../../lib/cn';
import { IconButton } from '../icon-button';
import { BodySmall } from '../typography';

export const ALERT_VARIANTS = ['success', 'error', 'warning', 'info'] as const;

export type AlertVariant = (typeof ALERT_VARIANTS)[number];

const alertVariants = cva(
  'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border bg-surface p-3.5 text-control text-surface-foreground shadow-lg',
  {
    variants: {
      variant: {
        success: 'border-success/30',
        error: 'border-destructive/30',
        warning: 'border-warning-border',
        info: 'border-primary/30',
      },
    },
    defaultVariants: { variant: 'info' },
  },
);

const iconTone: Record<AlertVariant, string> = {
  success: 'bg-data-2 text-success-strong',
  error: 'bg-destructive/10 text-destructive-strong',
  warning: 'bg-warning text-warning-foreground',
  info: 'bg-action-subtle text-primary',
};

const DefaultIcons: Record<AlertVariant, typeof CircleCheckIcon> = {
  success: CircleCheckIcon,
  error: CircleXIcon,
  warning: AlertTriangleIcon,
  info: InfoCircleIcon,
};

export interface AlertProps extends VariantProps<typeof alertVariants> {
  /** Trailing control such as an Undo button. */
  action?: ReactNode;
  className?: string;
  /** Secondary copy under the title. `children` is used when this is omitted. */
  description?: ReactNode;
  /**
   * Shows the dismiss control when `onDismiss` is also provided. Defaults to
   * true whenever a dismiss handler is passed.
   */
  dismissible?: boolean;
  /**
   * Leading status glyph. Pass `false` to hide the default icon; pass a node
   * to replace it.
   */
  icon?: ReactNode | false;
  /**
   * When false, the toast host owns live-region semantics and this surface
   * stays presentational. Standalone usage keeps `role="status"` / `alert`.
   */
  live?: boolean;
  onDismiss?: () => void;
  title?: ReactNode;
  children?: ReactNode;
}

/**
 * Toast notification surface. Hand-authored because the shadcn registry ships
 * Sonner, and this package standardizes on react-hot-toast so every MFE shares
 * one toast store through the `@cms/ui` singleton. Use `Callout` for inline
 * banners; use `alert.success()` / `Toaster` for ephemeral messages.
 */
export function Alert({
  action,
  children,
  className,
  description,
  dismissible,
  icon,
  live = true,
  onDismiss,
  title,
  variant = 'info',
}: AlertProps) {
  const resolvedVariant = variant ?? 'info';
  const showDismiss = (dismissible ?? onDismiss != null) && onDismiss != null;
  const body = description ?? children;
  const DefaultIcon = DefaultIcons[resolvedVariant];
  const resolvedIcon =
    icon === false ? null : (icon ?? <DefaultIcon className="size-5" />);

  const handleDismiss = () => {
    onDismiss?.();
  };

  const role =
    live === false
      ? undefined
      : resolvedVariant === 'error' || resolvedVariant === 'warning'
        ? 'alert'
        : 'status';

  return (
    <div
      className={cn(alertVariants({ variant: resolvedVariant }), className)}
      data-slot="alert"
      data-variant={resolvedVariant}
      role={role}
    >
      {resolvedIcon != null && (
        <span
          aria-hidden="true"
          className={cn(
            'mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full',
            iconTone[resolvedVariant],
          )}
        >
          {resolvedIcon}
        </span>
      )}
      <div className="min-w-0 flex-1">
        {title != null && (
          <BodySmall className="font-semibold">{title}</BodySmall>
        )}
        {body != null && (
          <BodySmall
            className={title != null ? 'mt-0.5' : undefined}
            color="foreground-muted"
          >
            {body}
          </BodySmall>
        )}
        {action != null && <div className="mt-2">{action}</div>}
      </div>
      {showDismiss && (
        <IconButton
          className="-mt-1 -mr-1 shrink-0"
          icon={<CloseIcon className="size-3.5" />}
          label="Dismiss notification"
          onClick={handleDismiss}
          size="xs"
          variant="ghost"
        />
      )}
    </div>
  );
}

export { alertVariants };
