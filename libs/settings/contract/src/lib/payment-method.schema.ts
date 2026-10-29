import { z } from 'zod';
import {
  nullableText,
  pagedResultSchema,
  setupResponseSchema,
  type SetupListParams,
} from './envelope.schema';

/**
 * Wire shapes of `/paymentmethod` from the FGS Setup Service swagger
 * (`FgsSetupPaymentMethod*` DTOs).
 */
export const paymentMethodSummaryDtoSchema = z.object({
  id: z.number(),
  displayName: nullableText,
  sortOrder: z.number(),
  isMobileVisible: z.boolean(),
  isCustomerPortalVisible: z.boolean(),
  isActive: z.boolean(),
});

export const paymentMethodDetailDtoSchema = paymentMethodSummaryDtoSchema;

export const paymentMethodLookupDtoSchema = z.object({
  id: z.number(),
  displayName: nullableText,
  sortOrder: z.number(),
});

export const paymentMethodCreateDtoSchema = z.object({
  displayName: nullableText,
  sortOrder: z.number(),
  isMobileVisible: z.boolean(),
  isCustomerPortalVisible: z.boolean(),
});

export const paymentMethodUpdateDtoSchema = paymentMethodCreateDtoSchema;

export const paymentMethodPatchDtoSchema = z.object({
  displayName: nullableText,
  sortOrder: z.number().nullish(),
  isMobileVisible: z.boolean().nullish(),
  isCustomerPortalVisible: z.boolean().nullish(),
  isActive: z.boolean().nullish(),
});

export const paymentMethodListResponseSchema = setupResponseSchema(
  pagedResultSchema(paymentMethodSummaryDtoSchema),
);
export const paymentMethodDetailResponseSchema = setupResponseSchema(
  paymentMethodDetailDtoSchema,
);
export const paymentMethodLookupResponseSchema = setupResponseSchema(
  z.array(paymentMethodLookupDtoSchema),
);

export type PaymentMethodSummaryDto = z.infer<
  typeof paymentMethodSummaryDtoSchema
>;
export type PaymentMethodDetailDto = z.infer<
  typeof paymentMethodDetailDtoSchema
>;
export type PaymentMethodLookupDto = z.infer<
  typeof paymentMethodLookupDtoSchema
>;
export type PaymentMethodCreateDto = z.infer<
  typeof paymentMethodCreateDtoSchema
>;
export type PaymentMethodUpdateDto = z.infer<
  typeof paymentMethodUpdateDtoSchema
>;
export type PaymentMethodPatchDto = z.infer<typeof paymentMethodPatchDtoSchema>;

export type PaymentMethodListParams = SetupListParams & {
  displayName?: string;
};

export type PaymentMethodLookupParams = {
  activeOnly?: boolean;
  isMobileVisible?: boolean;
  isCustomerPortalVisible?: boolean;
};
