import type { ReactNode } from 'react';

export interface SettingsPageTitleProps {
  children: ReactNode;
  className?: string;
  moduleKey?: string;
  /** Route to open. Defaults to the Setup grid. */
  to?: string;
  /** Resolve `to` against the URL, used by nested screens such as Add Employee. */
  urlRelative?: boolean;
}
