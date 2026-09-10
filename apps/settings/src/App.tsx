import type { CmsRuntime } from '@cms/platform-contract';
import { RemoteErrorBoundary } from './error-boundary';
import { SetupPage } from './pages/SetupPage';
import './styles.css';

export interface AppProps {
  runtime: CmsRuntime;
}

export function App({ runtime }: AppProps) {
  return (
    <RemoteErrorBoundary>
      <div data-tenant={runtime.tenantId}>
        <SetupPage />
      </div>
    </RemoteErrorBoundary>
  );
}

export default App;
