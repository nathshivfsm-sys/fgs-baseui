import { ChevronLeftIcon, cn, Heading1 } from '@cms/ui';
import { Link } from 'react-router-dom';
import { SETUP_PATH, SETUP_TAB_STATE_KEY } from '../constant';
import type { SettingsPageTitleProps } from '../types';

export const SettingsPageTitle = ({
  children,
  className,
  moduleKey,
  to = SETUP_PATH,
  urlRelative = false,
}: SettingsPageTitleProps) => (
  <div className={cn('mt-2 flex flex-wrap items-center gap-3', className)}>
    <Heading1>{children}</Heading1>
    <Link
      aria-label="Back"
      className="inline-flex h-8 items-center gap-1 rounded-md px-2 text-control font-medium text-action outline-none transition-colors hover:bg-primary-subtle focus-visible:ring-[3px] focus-visible:ring-ring/30"
      relative={urlRelative ? 'path' : undefined}
      state={moduleKey ? { [SETUP_TAB_STATE_KEY]: moduleKey } : undefined}
      to={to}
    >
      <ChevronLeftIcon aria-hidden="true" className="size-4" />
      Back
    </Link>
  </div>
);
