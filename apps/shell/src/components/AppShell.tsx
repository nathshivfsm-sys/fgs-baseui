import type { UserDetails } from '@cms/platform-contract';
import { useState, type ReactNode } from 'react';
import { PageContainer } from './PageContainer';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';

export interface AppShellProps {
  children: ReactNode;
  currentUser: UserDetails;
  onLogout: () => void;
  tenantId: string;
}

/** Persistent sidebar + top nav shell wrapping every authenticated page. */
export function AppShell({
  children,
  currentUser,
  onLogout,
  tenantId,
}: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <TopNav
        currentUser={currentUser}
        onOpenMobileSidebar={() => setMobileOpen(true)}
        tenantId={tenantId}
        onLogout={onLogout}
      />

      <div className="flex min-h-0 flex-1">
        <div className="hidden lg:block!">
          <Sidebar
            collapsed={collapsed}
            onToggleCollapse={() => setCollapsed((value) => !value)}
          />
        </div>

        {mobileOpen && (
          <div className="fixed inset-0 z-40 flex lg:hidden!">
            <button
              aria-label="Close navigation"
              className="absolute inset-0 bg-foreground/40"
              onClick={() => setMobileOpen(false)}
              type="button"
            />
            <Sidebar
              className="relative z-10 shadow-sm"
              collapsed={false}
              onNavigate={() => setMobileOpen(false)}
              showCollapseControl={false}
            />
          </div>
        )}

        <main className="min-w-0 flex-1 overflow-y-auto">
          <PageContainer>{children}</PageContainer>
        </main>
      </div>
    </div>
  );
}
