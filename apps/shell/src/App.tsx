import { Component, Suspense, useMemo, type ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useStore } from 'zustand';
import type { CmsRuntime } from '@cms/platform-contract';
import { AppShell } from './components/AppShell';
import { ALL_NAV_ROUTES } from './components/nav-config';
import { RoutePlaceholder } from './components/RoutePlaceholder';
import { lazyProvider } from './mf';
import { cmsRuntime } from './runtime';
import { shellStore } from './store/store';

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
const Invoice = lazyProvider<{ runtime: CmsRuntime }>('invoice', 'App');

const MFE_ROUTE_PATHS = new Set(['/leads', '/workorders', '/invoice']);

export function App() {
  const tenantId = useStore(shellStore, (state) => state.tenantId);
  const currentUser = useStore(shellStore, (state) => state.currentUser);
  const theme = useStore(shellStore, (state) => state.theme);
  const setTenantId = useStore(shellStore, (state) => state.setTenantId);
  const toggleTheme = useStore(shellStore, (state) => state.toggleTheme);
  const mfeRuntime = useMemo<CmsRuntime>(
    () => ({ ...cmsRuntime, tenantId, currentUser }),
    [currentUser, tenantId],
  );

  return (
    <AppShell
      currentUser={currentUser}
      onTenantChange={setTenantId}
      onToggleTheme={toggleTheme}
      tenantId={tenantId}
      theme={theme}
    >
      <Routes>
        <Route path="/" element={<Navigate to="/workorders" replace />} />
        <Route
          path="/workorders/*"
          element={
            <ProviderBoundary name="Work orders">
              <Workorder runtime={mfeRuntime} />
            </ProviderBoundary>
          }
        />
        <Route
          path="/leads/*"
          element={
            <ProviderBoundary name="Leads">
              <Lead runtime={mfeRuntime} />
            </ProviderBoundary>
          }
        />
        <Route
          path="/invoice/*"
          element={
            <ProviderBoundary name="Invoice">
              <Invoice runtime={mfeRuntime} />
            </ProviderBoundary>
          }
        />
        {ALL_NAV_ROUTES.filter((route) => !MFE_ROUTE_PATHS.has(route.path)).map(
          (route) => (
            <Route
              element={
                <RoutePlaceholder label={route.label} section={route.section} />
              }
              key={route.path}
              path={route.path}
            />
          ),
        )}
      </Routes>
    </AppShell>
  );
}

export default App;
