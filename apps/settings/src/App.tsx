import { Route, Routes } from 'react-router-dom';
import type { CmsRuntime } from '@cms/platform-contract';
import { RemoteErrorBoundary } from './error-boundary';
import { CompanySettingsPage, SetupPage } from './pages';
import './styles.css';

export interface AppProps {
  runtime: CmsRuntime;
}

export function App({ runtime }: AppProps) {
  return (
    <RemoteErrorBoundary>
      <div data-tenant={runtime.tenantId}>
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
        </Routes>
      </div>
    </RemoteErrorBoundary>
  );
}

export default App;
