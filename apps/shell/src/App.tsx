import { Component, Suspense, type ReactNode } from 'react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
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
        <div className="rounded-lg border bg-card p-6" role="alert">
          <strong>{this.props.name} is unavailable.</strong>
          <p className="text-sm text-muted-foreground">
            {this.state.error.message}
          </p>
        </div>
      );
    }
    return (
      <Suspense fallback={<p>Loading {this.props.name}…</p>}>
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
      <header className="flex items-center justify-between border-b bg-card px-6 py-4">
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
      <div className="mx-auto grid max-w-6xl gap-6 p-6 md:grid-cols-[12rem_1fr]">
        <nav className="flex gap-2 md:flex-col">
          <Button asChild variant="ghost">
            <Link to="/workorders">Work orders</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to="/leads">Leads</Link>
          </Button>
        </nav>
        <main>
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
