import type { ReactNode } from 'react';
import toast from 'react-hot-toast';
import { cn } from '../../../lib/cn';
import { Alert, type AlertVariant } from './alert';
import type { AlertPosition } from './toaster';

export interface ShowAlertOptions {
  action?: ReactNode;
  className?: string;
  description?: ReactNode;
  dismissible?: boolean;
  duration?: number;
  icon?: ReactNode | false;
  id?: string;
  position?: AlertPosition;
}

const DEFAULT_DURATION: Record<AlertVariant, number> = {
  success: 4000,
  info: 4000,
  warning: 6000,
  error: 6000,
};

const showAlert = (
  variant: AlertVariant,
  title: ReactNode,
  options: ShowAlertOptions = {},
) => {
  const {
    action,
    className,
    description,
    dismissible = true,
    duration = DEFAULT_DURATION[variant],
    icon,
    id,
    position,
  } = options;

  return toast.custom(
    (t) => {
      const handleDismiss = () => {
        toast.dismiss(t.id);
      };

      return (
        <Alert
          action={action}
          className={cn(
            'transition-opacity duration-200',
            t.visible ? 'opacity-100' : 'opacity-0',
            className,
          )}
          description={description}
          dismissible={dismissible}
          icon={icon}
          onDismiss={handleDismiss}
          title={title}
          variant={variant}
        />
      );
    },
    {
      duration,
      id,
      position,
      removeDelay: 200,
    },
  );
};

/** Imperative toast API. Requires a single `<Toaster />` mounted at the app root. */
export const alert = {
  success: (title: ReactNode, options?: ShowAlertOptions) =>
    showAlert('success', title, options),
  error: (title: ReactNode, options?: ShowAlertOptions) =>
    showAlert('error', title, options),
  warning: (title: ReactNode, options?: ShowAlertOptions) =>
    showAlert('warning', title, options),
  info: (title: ReactNode, options?: ShowAlertOptions) =>
    showAlert('info', title, options),
  dismiss: (id?: string) => toast.dismiss(id),
  remove: (id?: string) => toast.remove(id),
};
