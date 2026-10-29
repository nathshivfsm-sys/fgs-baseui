import type { PaymentTermSummaryDto } from '@cms/settings-contract';
import { ACCOUNT_TYPE_OPTIONS } from '../constant';

export function paymentTermAccountTypeLabel(
  record: Pick<
    PaymentTermSummaryDto,
    'isAccountsReceivable' | 'isAccountsPayable'
  >,
): string {
  const labels = ACCOUNT_TYPE_OPTIONS.flatMap((option) => {
    if (option.value === 'receivable' && record.isAccountsReceivable) {
      return [option.label];
    }
    if (option.value === 'payable' && record.isAccountsPayable) {
      return [option.label];
    }
    return [];
  });
  return labels.length > 0 ? labels.join(', ') : '—';
}
