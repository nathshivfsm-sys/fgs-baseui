import { Route, Routes } from 'react-router-dom';
import type { CmsRuntime } from '@cms/platform-contract';
import { RemoteErrorBoundary } from './error-boundary';
import { CompanySettingsPage, SetupPage, ZonePostalCodePage } from './pages';
import './styles.css';

export interface AppProps {
  runtime: CmsRuntime;
}

export function App({ runtime }: AppProps) {
  return (
    <RemoteErrorBoundary>
      <div className="flex min-h-0 flex-1 flex-col" data-tenant={runtime.tenantId}>
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
        </Routes>
      </div>
    </RemoteErrorBoundary>
  );
}

export default App;
