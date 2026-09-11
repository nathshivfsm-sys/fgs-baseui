import type { CmsRuntime } from '@cms/platform-contract';
import {
  loadWorkorders,
  type LoadWorkorders,
} from '@cms/workorder-data-access';
import { RemoteErrorBoundary } from './error-boundary';
import { WorkOrdersPage } from './pages';
import './styles.css';

export type { LoadWorkorders, Workorder } from '@cms/workorder-data-access';

export interface AppProps {
  runtime: CmsRuntime;
  loadWorkorders?: LoadWorkorders;
}

export function App({
  runtime,
  loadWorkorders: load = loadWorkorders,
}: AppProps) {
  return (
    <RemoteErrorBoundary>
      <WorkOrdersPage loadWorkorders={load} runtime={runtime} />
    </RemoteErrorBoundary>
  );
}

export default App;
