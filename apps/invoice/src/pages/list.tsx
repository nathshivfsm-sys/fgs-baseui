import { useAuth } from '@cms/shared-auth';
import { SectionCard } from '@cms/ui';
import { Link } from 'react-router-dom';

// Links are route-relative on purpose: the same table resolves to /invoice/... under the
// shell and to /... on the standalone dev server, where this app is mounted at the root.
const INVOICES = [
  { id: 'INV-101', customer: 'Northwind Facilities', amount: '$250.00' },
  { id: 'INV-102', customer: 'Contoso Home Services', amount: '$1,180.00' },
] as const;

/** Protected route — the guard is applied in ../App.tsx. */
export function InvoiceListPage() {
  const { user } = useAuth();

  // No page gutters here — the host shell (and bootstrap.tsx when standalone)
  // supplies them, so this remote stays aligned with every other one.
  return (
    <SectionCard>
      <h1 className="text-title font-bold text-heading">Invoices</h1>
      <p className="mt-1 text-control text-foreground-muted">
        Signed in as {user?.displayName}
      </p>

      <ul className="mt-4 flex flex-col divide-y divide-divider">
        {INVOICES.map((invoice) => (
          <li
            className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3 text-control"
            key={invoice.id}
          >
            <Link
              className="font-semibold text-primary hover:underline"
              to={invoice.id}
            >
              {invoice.id}
            </Link>
            <span className="text-foreground-muted">{invoice.customer}</span>
            <span className="ml-auto font-semibold text-heading">
              {invoice.amount}
            </span>
            <Link
              className="text-foreground-muted hover:underline"
              to={`payment/${invoice.id}`}
            >
              Public payment link
            </Link>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}
