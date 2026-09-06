import {
  Body,
  BodySmall,
  Button,
  Callout,
  Heading1,
  LockIcon,
  SectionCard,
} from '@cms/ui';
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
    // Only the narrow measure is this page's concern; the surrounding gutters
    // come from the host shell.
    <div className="mx-auto w-full max-w-md">
      <SectionCard>
        <Heading1 bold>Pay invoice</Heading1>
        <BodySmall className="mt-1" color="foreground-muted">
          Invoice <span className="font-semibold">{invoiceId}</span>
        </BodySmall>

        <Body bold className="mt-4 text-metric-value" color="heading">
          $250.00
        </Body>

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
