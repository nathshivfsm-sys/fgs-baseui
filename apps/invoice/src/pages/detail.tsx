import { SectionCard } from '@cms/ui';
import { Link, useParams } from 'react-router-dom';

/** Protected route — the guard is applied in ../App.tsx. */
export function InvoiceDetailPage() {
  const { invoiceId } = useParams<{ invoiceId: string }>();

  // Page gutters are the host shell's job — see apps/shell PageContainer.
  return (
    <SectionCard>
      <h1 className="text-title font-bold text-heading">Invoice {invoiceId}</h1>
      <p className="mt-2 text-control text-foreground-muted">
        Internal billing detail — line items, tax breakdown, and payment history
        live here once the data layer is wired up.
      </p>
      <Link
        className="mt-4 inline-block text-control font-semibold text-primary hover:underline"
        to=".."
      >
        Back to invoices
      </Link>
    </SectionCard>
  );
}
