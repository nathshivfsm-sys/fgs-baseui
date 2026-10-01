import type { GloBillingCategoryTypeLookupDto } from '@cms/shared-contract';

export const formatBillingCategoryTypeLabel = (
  billingCategoryType: string | null | undefined,
  typeOptions: readonly GloBillingCategoryTypeLookupDto[] | undefined,
): string => {
  if (!billingCategoryType) return '—';
  const match = (typeOptions ?? []).find(
    (option) =>
      (option.billingCategoryType ?? '').toLowerCase() ===
      billingCategoryType.toLowerCase(),
  );
  return match?.billingCategoryName ?? billingCategoryType;
};
