import { z } from 'zod';
import {
  nullableText,
  pagedResultSchema,
  setupResponseSchema,
  type SetupListParams,
} from './envelope.schema';

/**
 * Wire shapes of `/paymentterm` from the FGS Setup Service swagger
 * (`FgsSetupPaymentTerm*` DTOs). `dueDateMethod` is a free string; swagger
 * publishes no enum.
 */
export const paymentTermSummaryDtoSchema = z.object({
  id: z.number(),
  name: nullableText,
  dueDateMethod: nullableText,
  numberOfDays: z.number().nullish(),
  isAccountsReceivable: z.boolean(),
  isAccountsPayable: z.boolean(),
  isMobileVisible: z.boolean(),
  isActive: z.boolean(),
});

export const paymentTermDetailDtoSchema = paymentTermSummaryDtoSchema;

export const paymentTermLookupDtoSchema = z.object({
  id: z.number(),
  name: nullableText,
});

export const paymentTermCreateDtoSchema = z.object({
  name: nullableText,
  dueDateMethod: nullableText,
  numberOfDays: z.number().nullish(),
  isAccountsReceivable: z.boolean(),
  isAccountsPayable: z.boolean(),
  isMobileVisible: z.boolean(),
});

export const paymentTermUpdateDtoSchema = paymentTermCreateDtoSchema;

export const paymentTermPatchDtoSchema = z.object({
  name: nullableText,
  dueDateMethod: nullableText,
  numberOfDays: z.number().nullish(),
  isAccountsReceivable: z.boolean().nullish(),
  isAccountsPayable: z.boolean().nullish(),
  isMobileVisible: z.boolean().nullish(),
  isActive: z.boolean().nullish(),
});

export const paymentTermListResponseSchema = setupResponseSchema(
  pagedResultSchema(paymentTermSummaryDtoSchema),
);
export const paymentTermDetailResponseSchema = setupResponseSchema(
  paymentTermDetailDtoSchema,
);
export const paymentTermLookupResponseSchema = setupResponseSchema(
  z.array(paymentTermLookupDtoSchema),
);

export type PaymentTermSummaryDto = z.infer<typeof paymentTermSummaryDtoSchema>;
export type PaymentTermDetailDto = z.infer<typeof paymentTermDetailDtoSchema>;
export type PaymentTermLookupDto = z.infer<typeof paymentTermLookupDtoSchema>;
export type PaymentTermCreateDto = z.infer<typeof paymentTermCreateDtoSchema>;
export type PaymentTermUpdateDto = z.infer<typeof paymentTermUpdateDtoSchema>;
export type PaymentTermPatchDto = z.infer<typeof paymentTermPatchDtoSchema>;

export type PaymentTermListParams = SetupListParams & {
  name?: string;
};
