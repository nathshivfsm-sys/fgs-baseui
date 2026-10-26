import { z } from 'zod';
import {
  apiResponseSchema,
  nullableText,
  pagedResultSchema,
  type PagedListParams,
} from './envelope.schema';

/**
 * Wire shapes of `/paymentterm` from the FGS Setup Service swagger
 * (`FgsSetupPaymentTerm*` DTOs). Payment terms are used by customers, invoices,
 * and vendors across remotes, so the DTOs live in the shared contract.
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

export const paymentTermListResponseSchema = apiResponseSchema(
  pagedResultSchema(paymentTermSummaryDtoSchema),
);
export const paymentTermDetailResponseSchema = apiResponseSchema(
  paymentTermDetailDtoSchema,
);
export const paymentTermLookupResponseSchema = apiResponseSchema(
  z.array(paymentTermLookupDtoSchema),
);

export type PaymentTermSummaryDto = z.infer<typeof paymentTermSummaryDtoSchema>;
export type PaymentTermDetailDto = z.infer<typeof paymentTermDetailDtoSchema>;
export type PaymentTermLookupDto = z.infer<typeof paymentTermLookupDtoSchema>;
export type PaymentTermCreateDto = z.infer<typeof paymentTermCreateDtoSchema>;
export type PaymentTermUpdateDto = z.infer<typeof paymentTermUpdateDtoSchema>;
export type PaymentTermPatchDto = z.infer<typeof paymentTermPatchDtoSchema>;

export type PaymentTermListParams = PagedListParams & {
  isActive?: boolean;
  name?: string;
};
