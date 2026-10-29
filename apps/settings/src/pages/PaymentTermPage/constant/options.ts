import type { SelectOption } from '@cms/ui';
import {
  PAYMENT_TERM_ACCOUNT_PAYABLE,
  PAYMENT_TERM_ACCOUNT_RECEIVABLE,
  PAYMENT_TERM_LOCKED_DAY_METHODS,
  PAYMENT_TERM_NET_DAYS_METHOD,
} from '@cms/settings-data-access';

export const PAYMENT_TERM_PAGE_SIZE = 10;

export const DUE_DATE_METHOD_OPTIONS: readonly SelectOption[] = [
  { value: PAYMENT_TERM_NET_DAYS_METHOD, label: 'NetDays' },
  { value: PAYMENT_TERM_LOCKED_DAY_METHODS[0], label: 'DueOnReceipt' },
  { value: PAYMENT_TERM_LOCKED_DAY_METHODS[1], label: 'EndOfMonth' },
];

export const ACCOUNT_TYPE_OPTIONS: readonly SelectOption[] = [
  {
    value: PAYMENT_TERM_ACCOUNT_RECEIVABLE,
    label: 'Account Receivable',
  },
  { value: PAYMENT_TERM_ACCOUNT_PAYABLE, label: 'Account Payable' },
];
