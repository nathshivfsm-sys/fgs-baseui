import type { PaymentTermLookupDto } from '@cms/shared-contract';

export const resolvePaymentTermLabel = (
  paymentTermId: number | null | undefined,
  lookup: readonly PaymentTermLookupDto[] | undefined,
): string | null => {
  if (paymentTermId == null || !lookup?.length) return null;
  const match = lookup.find((term) => term.id === paymentTermId);
  return match?.name?.trim() || null;
};
