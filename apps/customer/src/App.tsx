import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import type { CmsRuntime } from '@cms/platform-contract';
import { RouteBoundary } from './shared/component';
import { RemoteErrorBoundary } from './error-boundary';
import './styles.css';

const CustomersPage = lazy(() =>
  import('./pages/CustomersPage').then((module) => ({
    default: module.CustomersPage,
  })),
);
const CreateCustomerPage = lazy(() =>
  import('./pages/CreateCustomerPage').then((module) => ({
    default: module.CreateCustomerPage,
  })),
);
const CustomerDetailPage = lazy(() =>
  import('./pages/CustomerDetailPage').then((module) => ({
    default: module.CustomerDetailPage,
  })),
);
const CreateServiceLocationPage = lazy(() =>
  import('./pages/CreateServiceLocationPage').then((module) => ({
    default: module.CreateServiceLocationPage,
  })),
);

export interface AppProps {
  runtime: CmsRuntime;
}

export const App = ({ runtime }: AppProps) => (
  <RemoteErrorBoundary>
    <div className="flex min-h-0 flex-1 flex-col">
      <Routes>
        <Route
          index
          element={
            <RouteBoundary>
              <CustomersPage
                currentUser={runtime.currentUser}
                queryClient={runtime.queryClient}
              />
            </RouteBoundary>
          }
        />
        <Route
          path="new"
          element={
            <RouteBoundary>
              <CreateCustomerPage queryClient={runtime.queryClient} />
            </RouteBoundary>
          }
        />
        <Route path=":customerId">
          <Route
            index
            element={
              <RouteBoundary>
                <CustomerDetailPage queryClient={runtime.queryClient} />
              </RouteBoundary>
            }
          />
          <Route
            path="service-locations/new"
            element={
              <RouteBoundary>
                <CreateServiceLocationPage queryClient={runtime.queryClient} />
              </RouteBoundary>
            }
          />
        </Route>
      </Routes>
    </div>
  </RemoteErrorBoundary>
);

export default App;
