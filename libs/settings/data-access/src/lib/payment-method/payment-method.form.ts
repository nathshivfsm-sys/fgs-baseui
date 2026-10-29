import { z } from 'zod';
import type {
  PaymentMethodCreateDto,
  PaymentMethodSummaryDto,
  PaymentMethodUpdateDto,
} from '@cms/settings-contract';

export const paymentMethodFormSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(1, 'Payment method name is required.')
    .max(100, 'Payment method name must be at most 100 characters.'),
  isMobileVisible: z.boolean(),
  isActive: z.boolean(),
});

export type PaymentMethodForm = z.infer<typeof paymentMethodFormSchema>;

export function emptyPaymentMethodForm(): PaymentMethodForm {
  return {
    displayName: '',
    isMobileVisible: true,
    isActive: true,
  };
}

export function toPaymentMethodFormValues(
  record: PaymentMethodSummaryDto,
): PaymentMethodForm {
  return {
    displayName: record.displayName ?? '',
    isMobileVisible: record.isMobileVisible,
    isActive: record.isActive,
  };
}

export function toPaymentMethodCreateDto(
  values: PaymentMethodForm,
  sortOrder: number,
): PaymentMethodCreateDto {
  return {
    displayName: values.displayName,
    sortOrder,
    isMobileVisible: values.isMobileVisible,
    isCustomerPortalVisible: true,
  };
}

export function toPaymentMethodUpdateDto(
  values: PaymentMethodForm,
  record: PaymentMethodSummaryDto,
): PaymentMethodUpdateDto {
  return {
    displayName: values.displayName,
    sortOrder: record.sortOrder,
    isMobileVisible: values.isMobileVisible,
    isCustomerPortalVisible: record.isCustomerPortalVisible,
  };
}
