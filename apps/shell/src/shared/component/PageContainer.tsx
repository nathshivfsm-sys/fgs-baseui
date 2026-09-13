import type { ReactNode } from 'react';

export interface PageContainerProps {
  children: ReactNode;
}

/**
 * The single owner of page gutters. Both shells render their routed content
 * through this, so every page — a shell page or a federated remote — is inset
 * from the top nav and sidebar without repeating the padding itself. Remotes
 * deliberately render flush and inherit these gutters; adding their own would
 * double up here and drift out of alignment with each other.
 *
 * `flex-1 min-h-0` fills the shell's main pane so a child can claim the leftover
 * height with `flex-1` and scroll internally (LoginPage, CompanySettingsPage,
 * ZonePostalCodePage). Pages that grow with content still overflow into main.
 */
export function PageContainer({ children }: PageContainerProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col p-4 sm:p-6">{children}</div>
  );
}
