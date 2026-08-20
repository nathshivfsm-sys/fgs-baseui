import type { UserDetails } from '@cms/platform-contract';
import { useState, type ReactNode } from 'react';
import type { Theme } from '../lib/theme';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';

export interface AppShellProps {
  children: ReactNode;
  currentUser: UserDetails;
  onLogout: () => void;
  onTenantChange: (tenantId: string) => void;
  onToggleTheme: () => void;
  tenantId: string;
  theme: Theme;
}

/** Persistent sidebar + top nav shell wrapping every authenticated page. */
export function AppShell({
  children,
  currentUser,
  onLogout,
  onTenantChange,
  onToggleTheme,
  tenantId,
  theme,
}: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
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
            className="relative z-10 shadow-surface"
            collapsed={false}
            onNavigate={() => setMobileOpen(false)}
            showCollapseControl={false}
          />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <TopNav
          currentUser={currentUser}
          onLogout={onLogout}
          onOpenMobileSidebar={() => setMobileOpen(true)}
          onTenantChange={onTenantChange}
          onToggleTheme={onToggleTheme}
          tenantId={tenantId}
          theme={theme}
        />
        <main className="min-w-0 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
