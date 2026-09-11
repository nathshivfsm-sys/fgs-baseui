import { useMemo } from 'react';
import {
  matchPath,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { useStore } from 'zustand';
import type { CmsRuntime } from '@cms/platform-contract';
import { RequireAuth, useAuth } from '@cms/shared-auth';
import {
  ALL_NAV_ROUTES,
  AppShell,
  ProviderBoundary,
  PublicShell,
  RoutePlaceholder,
} from './shared';
import { lazyProvider } from './mf';
import { LoginPage } from './pages';
import { PUBLIC_ROUTE_PATTERNS } from './routes';
import { cmsRuntime } from './runtime';
import { GUEST_USER, shellStore } from './store';

const Workorder = lazyProvider<{ runtime: CmsRuntime }>('workorder', 'App');
const Lead = lazyProvider<{ runtime: CmsRuntime }>('lead', 'App');
const Settings = lazyProvider<{ runtime: CmsRuntime }>('settings', 'App');
const Invoice = lazyProvider<{ runtime: CmsRuntime }>('invoice', 'App');

const MFE_ROUTE_PATHS = new Set([
  '/leads',
  '/workorders',
  '/invoice',
  '/settings',
]);

export function App() {
  const tenantId = useStore(shellStore, (state) => state.tenantId);
  const { logout, user } = useAuth();
  const { pathname } = useLocation();

  const mfeRuntime = useMemo<CmsRuntime>(
    () => ({ ...cmsRuntime, tenantId, currentUser: user ?? GUEST_USER }),
    [tenantId, user],
  );

  const isPublicRoute = PUBLIC_ROUTE_PATTERNS.some(
    (pattern) => matchPath(pattern, pathname) !== null,
  );

  const routes = (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Mounted outside RequireAuth on purpose: the invoice remote mixes a public
          payment route with protected ones and applies its own guard per route. */}
      <Route
        path="/invoice/*"
        element={
          <ProviderBoundary name="Invoice">
            <Invoice runtime={mfeRuntime} />
          </ProviderBoundary>
        }
      />

      <Route element={<RequireAuth />}>
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
          path="/settings/*"
          element={
            <ProviderBoundary name="Settings">
              <Settings runtime={mfeRuntime} />
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
      </Route>
    </Routes>
  );

  // Anonymous visitors — and anyone on a public route — get the logo-only chrome. The
  // `user !== null` check also narrows the type for AppShell's non-nullable prop.
  return user !== null && !isPublicRoute ? (
    <AppShell currentUser={user} onLogout={logout} tenantId={tenantId}>
      {routes}
    </AppShell>
  ) : (
    <PublicShell>{routes}</PublicShell>
  );
}

export default App;
