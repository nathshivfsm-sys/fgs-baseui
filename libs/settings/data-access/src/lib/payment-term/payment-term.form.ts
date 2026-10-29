import { z } from 'zod';
import type {
  PaymentTermCreateDto,
  PaymentTermSummaryDto,
  PaymentTermUpdateDto,
} from '@cms/settings-contract';

/** Wire value for a term whose due date is a number of days after the invoice. */
export const PAYMENT_TERM_NET_DAYS_METHOD = 'NetDays';

/** Methods that store 0 days and do not ask the user to enter a count. */
export const PAYMENT_TERM_LOCKED_DAY_METHODS = [
  'DueOnReceipt',
  'EndOfMonth',
] as const;

export const PAYMENT_TERM_ACCOUNT_RECEIVABLE = 'receivable';
export const PAYMENT_TERM_ACCOUNT_PAYABLE = 'payable';

const WHOLE_DAYS = /^\d+$/;

export const paymentTermFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Payment term name is required.')
      .max(100, 'Payment term name must be at most 100 characters.'),
    dueDateMethod: z.string().trim().min(1, 'Due date method is required.'),
    numberOfDays: z.string(),
    accountType: z.union([
      z.literal(PAYMENT_TERM_ACCOUNT_RECEIVABLE),
      z.literal(PAYMENT_TERM_ACCOUNT_PAYABLE),
      z.literal(''),
    ]),
    isMobileVisible: z.boolean(),
    isActive: z.boolean(),
  })
  .superRefine((values, ctx) => {
    if (values.accountType === '') {
      ctx.addIssue({
        code: 'custom',
        message: 'Account type is required.',
        path: ['accountType'],
      });
    }
    if (
      values.dueDateMethod === PAYMENT_TERM_NET_DAYS_METHOD &&
      !WHOLE_DAYS.test(values.numberOfDays.trim())
    ) {
      ctx.addIssue({
        code: 'custom',
        message: 'Enter a whole number of days, 0 or greater.',
        path: ['numberOfDays'],
      });
    }
  });

export type PaymentTermForm = z.infer<typeof paymentTermFormSchema>;

export function paymentTermDaysAreLocked(dueDateMethod: string): boolean {
  return (PAYMENT_TERM_LOCKED_DAY_METHODS as readonly string[]).includes(
    dueDateMethod,
  );
}

export function emptyPaymentTermForm(): PaymentTermForm {
  return {
    name: '',
    dueDateMethod: '',
    numberOfDays: '',
    accountType: '',
    isMobileVisible: true,
    isActive: true,
  };
}

function accountTypeFromRecord(
  record: PaymentTermSummaryDto,
): PaymentTermForm['accountType'] {
  if (record.isAccountsPayable && !record.isAccountsReceivable) {
    return PAYMENT_TERM_ACCOUNT_PAYABLE;
  }
  if (record.isAccountsReceivable) return PAYMENT_TERM_ACCOUNT_RECEIVABLE;
  return '';
}

export function toPaymentTermFormValues(
  record: PaymentTermSummaryDto,
): PaymentTermForm {
  return {
    name: record.name ?? '',
    dueDateMethod: record.dueDateMethod ?? '',
    numberOfDays: paymentTermDaysAreLocked(record.dueDateMethod ?? '')
      ? '0'
      : record.numberOfDays == null
        ? ''
        : String(record.numberOfDays),
    accountType: accountTypeFromRecord(record),
    isMobileVisible: record.isMobileVisible,
    isActive: record.isActive,
  };
}

function toWireFields(values: PaymentTermForm): PaymentTermCreateDto {
  const numberOfDays = paymentTermDaysAreLocked(values.dueDateMethod)
    ? 0
    : Number(values.numberOfDays);
  return {
    name: values.name,
    dueDateMethod: values.dueDateMethod,
    numberOfDays,
    isAccountsReceivable:
      values.accountType === PAYMENT_TERM_ACCOUNT_RECEIVABLE,
    isAccountsPayable: values.accountType === PAYMENT_TERM_ACCOUNT_PAYABLE,
    isMobileVisible: values.isMobileVisible,
  };
}

export function toPaymentTermCreateDto(
  values: PaymentTermForm,
): PaymentTermCreateDto {
  return toWireFields(values);
}

export function toPaymentTermUpdateDto(
  values: PaymentTermForm,
): PaymentTermUpdateDto {
  return toWireFields(values);
}
