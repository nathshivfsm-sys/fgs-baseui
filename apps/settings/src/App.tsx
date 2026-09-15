import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import type { CmsRuntime } from '@cms/platform-contract';
import { Skeleton } from '@cms/ui';
import { RemoteErrorBoundary } from './error-boundary';
import './styles.css';

const SetupPage = lazy(() =>
  import('./pages/SetupPage').then((module) => ({ default: module.SetupPage })),
);
const CompanySettingsPage = lazy(() =>
  import('./pages/CompanySettingsPage').then((module) => ({
    default: module.CompanySettingsPage,
  })),
);
const ZonePostalCodePage = lazy(() =>
  import('./pages/ZonePostalCodePage').then((module) => ({
    default: module.ZonePostalCodePage,
  })),
);
const BusinessUnitPage = lazy(() =>
  import('./pages/BusinessUnitPage').then((module) => ({
    default: module.BusinessUnitPage,
  })),
);

export interface AppProps {
  runtime: CmsRuntime;
}

const PageFallback = () => (
  <div aria-busy="true" className="flex min-h-0 flex-1 flex-col gap-4 p-4">
    <Skeleton className="h-8 w-64" />
    <Skeleton className="h-24 w-full" />
    <Skeleton className="min-h-80 w-full flex-1" />
  </div>
);

export const App = ({ runtime }: AppProps) => (
  <RemoteErrorBoundary>
    <div className="flex min-h-0 flex-1 flex-col" data-tenant={runtime.tenantId}>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route index element={<SetupPage />} />
          <Route
            element={
              <CompanySettingsPage
                companyId={runtime.currentUser.companyId}
                queryClient={runtime.queryClient}
              />
            }
            path="company/general-info"
          />
          <Route
            element={
              <ZonePostalCodePage queryClient={runtime.queryClient} />
            }
            path="company/zone-postal-code"
          />
          <Route
            element={<BusinessUnitPage queryClient={runtime.queryClient} />}
            path="company/business-unit"
          />
        </Routes>
      </Suspense>
    </div>
  </RemoteErrorBoundary>
);

export default App;
