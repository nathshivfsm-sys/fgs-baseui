import { FieldProLogoIcon } from '@cms/ui';
import type { ReactNode } from 'react';

export interface PublicShellProps {
  children: ReactNode;
}

/** Chrome for pages an anonymous visitor can reach: brand mark only, no navigation. */
export function PublicShell({ children }: PublicShellProps) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <header className="flex h-topbar shrink-0 items-center gap-2 border-b border-divider bg-card px-4 sm:px-5">
        <FieldProLogoIcon aria-hidden="true" className="size-7 shrink-0" />
        <p className="text-body font-bold text-heading">FieldPro</p>
      </header>
      <main className="min-w-0 flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
