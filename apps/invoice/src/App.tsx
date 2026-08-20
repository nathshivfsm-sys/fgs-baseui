import type { CmsRuntime } from '@cms/platform-contract';
import { RequireAuth } from '@cms/shared-auth';
import { Route, Routes } from 'react-router-dom';
import { RemoteErrorBoundary } from './error-boundary';
import { InvoiceDetailPage } from './pages/detail';
import { InvoiceListPage } from './pages/list';
import { InvoicePaymentPage } from './pages/payment';
import './styles.css';

export interface AppProps {
  runtime: CmsRuntime;
}

/**
 * The remote owns its own access rules. Paths are relative, so this table mounts at
 * /invoice under the shell and at / on the standalone dev server without changes.
 *
 * `payment/:invoiceId` outranks `:invoiceId` regardless of order — React Router scores a
 * static segment above a dynamic one — so a customer-facing payment link never falls
 * through to the protected detail route.
 */
export function App({ runtime }: AppProps) {
  return (
    <RemoteErrorBoundary>
      <div data-testid="invoice" data-tenant={runtime.tenantId}>
        <Routes>
          <Route path="payment/:invoiceId" element={<InvoicePaymentPage />} />

          <Route element={<RequireAuth />}>
            <Route index element={<InvoiceListPage />} />
            <Route path=":invoiceId" element={<InvoiceDetailPage />} />
          </Route>
        </Routes>
      </div>
    </RemoteErrorBoundary>
  );
}

export default App;
