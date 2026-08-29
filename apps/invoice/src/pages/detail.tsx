import { SectionCard } from '@cms/ui';
import { Link, useParams } from 'react-router-dom';

/** Protected route — the guard is applied in ../App.tsx. */
export function InvoiceDetailPage() {
  const { invoiceId } = useParams<{ invoiceId: string }>();

  return (
    <div className="p-page-compact sm:p-page">
      <SectionCard>
        <h1 className="text-title font-bold text-heading">
          Invoice {invoiceId}
        </h1>
        <p className="mt-2 text-control text-muted-foreground">
          Internal billing detail — line items, tax breakdown, and payment
          history live here once the data layer is wired up.
        </p>
        <Link
          className="mt-4 inline-block text-control font-semibold text-brand-blue hover:underline"
          to=".."
        >
          Back to invoices
        </Link>
      </SectionCard>
    </div>
  );
}
