import { Button, Callout, LockIcon, SectionCard } from '@cms/ui';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

/**
 * Public route. Reachable with no session so a customer can pay from an emailed link —
 * see the route table in ../App.tsx.
 */
export function InvoicePaymentPage() {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const [paid, setPaid] = useState(false);

  return (
    <div className="mx-auto max-w-md p-page-compact sm:p-page">
      <SectionCard>
        <h1 className="text-title font-bold text-heading">Pay invoice</h1>
        <p className="mt-1 text-control text-muted-foreground">
          Invoice <span className="font-semibold">{invoiceId}</span>
        </p>

        <p className="mt-4 text-metric-value font-bold text-heading">$250.00</p>

        <Callout
          className="mt-4"
          icon={<LockIcon className="size-4" />}
          title="No account needed"
        >
          This payment page is public — you do not need to sign in to settle an
          invoice.
        </Callout>

        {paid ? (
          <Callout className="mt-4" variant="success">
            Payment received. A receipt is on its way to your email.
          </Callout>
        ) : (
          <Button className="mt-4 w-full" onClick={() => setPaid(true)}>
            Pay $250.00
          </Button>
        )}
      </SectionCard>
    </div>
  );
}
