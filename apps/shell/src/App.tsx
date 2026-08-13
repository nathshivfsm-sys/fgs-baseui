import { Component, Suspense, type ReactNode } from 'react';
import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import { useStore } from 'zustand';
import type { CmsRuntime } from '@cms/platform-contract';
import { Button } from '@cms/ui';
import { lazyProvider } from './mf';
import { cmsRuntime } from './runtime';

class ProviderBoundary extends Component<
  { children: ReactNode; name: string },
  { error: Error | null }
> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div
          className="rounded-lg border border-destructive/30 bg-destructive/5 p-6"
          role="alert"
        >
          <strong>{this.props.name} is unavailable.</strong>
          <p className="text-sm text-destructive">{this.state.error.message}</p>
        </div>
      );
    }
    return (
      <Suspense fallback={<p role="status">Loading {this.props.name}…</p>}>
        {this.props.children}
      </Suspense>
    );
  }
}

const Workorder = lazyProvider<{ runtime: CmsRuntime }>('workorder', 'App');
const Lead = lazyProvider<{ runtime: CmsRuntime }>('lead', 'App');

export function App() {
  const tenantId = useStore(cmsRuntime.appStore, (state) => state.tenantId);
  const setTenantId = useStore(
    cmsRuntime.appStore,
    (state) => state.setTenantId,
  );
  return (
    <div className="min-h-screen bg-background">
      <header className="flex flex-col items-start gap-4 border-b bg-card px-page-compact py-4 sm:flex-row sm:items-center sm:justify-between sm:px-page">
        <div>
          <p className="text-xs font-semibold uppercase text-primary">CMS</p>
          <h1 className="text-xl font-bold">Operations workspace</h1>
        </div>
        <Button
          variant="outline"
          onClick={() =>
            setTenantId(tenantId === 'northwind' ? 'contoso' : 'northwind')
          }
        >
          Tenant: {tenantId}
        </Button>
      </header>
      <div className="mx-auto grid max-w-app gap-6 p-page-compact sm:p-page md:grid-cols-[12rem_minmax(0,1fr)]">
        <nav
          aria-label="Primary"
          className="grid grid-cols-2 gap-2 md:flex md:flex-col"
        >
          <Button asChild variant="ghost">
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground'
              }
              to="/workorders"
            >
              Work orders
            </NavLink>
          </Button>
          <Button asChild variant="ghost">
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground'
              }
              to="/leads"
            >
              Leads
            </NavLink>
          </Button>
        </nav>
        <main className="min-w-0">
          <Routes>
            <Route path="/" element={<Navigate to="/workorders" replace />} />
            <Route
              path="/workorders/*"
              element={
                <ProviderBoundary name="Work orders">
                  <Workorder runtime={cmsRuntime} />
                </ProviderBoundary>
              }
            />
            <Route
              path="/leads/*"
              element={
                <ProviderBoundary name="Leads">
                  <Lead runtime={cmsRuntime} />
                </ProviderBoundary>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
