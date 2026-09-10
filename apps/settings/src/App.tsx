import { Route, Routes } from 'react-router-dom';
import type { CmsRuntime } from '@cms/platform-contract';
import type {
  LoadCompanySettings,
  SaveCompanySettings,
} from '@cms/settings-data-access';
import { RemoteErrorBoundary } from './error-boundary';
import { CompanySettingsPage } from './pages/CompanySettingsPage';
import { SetupPage } from './pages/SetupPage';
import './styles.css';

export interface AppProps {
  loadCompanySettings?: LoadCompanySettings;
  runtime: CmsRuntime;
  saveCompanySettings?: SaveCompanySettings;
}

export function App({
  loadCompanySettings,
  runtime,
  saveCompanySettings,
}: AppProps) {
  return (
    <RemoteErrorBoundary>
      <div data-tenant={runtime.tenantId}>
        <Routes>
          <Route index element={<SetupPage />} />
          <Route
            element={
              <CompanySettingsPage
                companyId={runtime.tenantId}
                loadCompanySettings={loadCompanySettings}
                queryClient={runtime.queryClient}
                saveCompanySettings={saveCompanySettings}
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
