import {
  Toaster as HotToaster,
  type ToasterProps as HotToasterProps,
} from 'react-hot-toast';
import { cn } from '../../../lib/cn';

export const ALERT_POSITIONS = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
] as const;

export type AlertPosition = (typeof ALERT_POSITIONS)[number];

export interface ToasterProps {
  containerClassName?: string;
  /** Default auto-dismiss in milliseconds. Per-toast `duration` still wins. */
  duration?: number;
  gutter?: number;
  position?: AlertPosition;
  reverseOrder?: boolean;
}

/**
 * Host for `alert.*` toasts. Mount exactly once at the application root (the
 * shell bootstrap when federated, each remote's standalone bootstrap otherwise).
 * A second instance duplicates every toast.
 */
export function Toaster({
  containerClassName,
  duration = 4000,
  gutter = 12,
  position = 'top-right',
  reverseOrder = false,
}: ToasterProps) {
  const toastOptions: HotToasterProps['toastOptions'] = { duration };

  return (
    <HotToaster
      containerClassName={cn('z-[100]', containerClassName)}
      gutter={gutter}
      position={position}
      reverseOrder={reverseOrder}
      toastOptions={toastOptions}
    />
  );
}
