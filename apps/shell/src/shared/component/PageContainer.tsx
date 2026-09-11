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
 * `min-h-full` (with border-box sizing, so the padding is included rather than
 * added on top) makes the container fill the scroll area without overflowing
 * it, which lets a child claim the full height with `flex-1` — see LoginPage.
 */
export function PageContainer({ children }: PageContainerProps) {
  return <div className="flex min-h-full flex-col p-4 sm:p-6">{children}</div>;
}
