import { Route, Routes } from 'react-router-dom';
import type { CmsRuntime } from '@cms/platform-contract';
import { loadLeads, type LoadLeads } from '@cms/lead-data-access';
import { RemoteErrorBoundary } from './error-boundary';
import { LeadsPage } from './pages';
import './styles.css';

export type { Lead, LoadLeads } from '@cms/lead-data-access';

export interface AppProps {
  runtime: CmsRuntime;
  loadLeads?: LoadLeads;
}

export const App = ({ runtime, loadLeads: load = loadLeads }: AppProps) => (
  <RemoteErrorBoundary>
    <Routes>
      <Route index element={<LeadsPage loadLeads={load} runtime={runtime} />} />
    </Routes>
  </RemoteErrorBoundary>
);

export default App;
