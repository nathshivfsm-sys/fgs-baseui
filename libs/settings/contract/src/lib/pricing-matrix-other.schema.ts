import { z } from 'zod';
import {
  nullableText,
  pagedResultSchema,
  setupResponseSchema,
  type SetupListParams,
} from './envelope.schema';

/**
 * Wire shapes of `/pricingmatrixother` from the FGS Setup Service swagger
 * (`FgsSetupPricingMatrixOther*` write DTOs). Swagger documents create, update,
 * and patch only. Read DTOs add `id` and `isActive` (present on patch) to the
 * create fields. Detail equals summary.
 */
const pricingMatrixOtherFields = {
  pricingMatrixId: z.number(),
  categoryCode: nullableText,
  name: nullableText,
  adjustmentValue: z.number().nullish(),
  discountPercent: z.number().nullish(),
};

export const pricingMatrixOtherSummaryDtoSchema = z.object({
  id: z.number(),
  ...pricingMatrixOtherFields,
  isActive: z.boolean(),
});

export const pricingMatrixOtherDetailDtoSchema =
  pricingMatrixOtherSummaryDtoSchema;

export const pricingMatrixOtherLookupDtoSchema = z.object({
  id: z.number(),
  pricingMatrixId: z.number(),
  categoryCode: nullableText,
  name: nullableText,
});

export const pricingMatrixOtherCreateDtoSchema = z.object(
  pricingMatrixOtherFields,
);

export const pricingMatrixOtherUpdateDtoSchema =
  pricingMatrixOtherCreateDtoSchema;

export const pricingMatrixOtherPatchDtoSchema = z.object({
  pricingMatrixId: z.number().nullish(),
  categoryCode: nullableText,
  name: nullableText,
  adjustmentValue: z.number().nullish(),
  discountPercent: z.number().nullish(),
  isActive: z.boolean().nullish(),
});

export const pricingMatrixOtherListResponseSchema = setupResponseSchema(
  pagedResultSchema(pricingMatrixOtherSummaryDtoSchema),
);
export const pricingMatrixOtherDetailResponseSchema = setupResponseSchema(
  pricingMatrixOtherDetailDtoSchema,
);
export const pricingMatrixOtherLookupResponseSchema = setupResponseSchema(
  z.array(pricingMatrixOtherLookupDtoSchema),
);

export type PricingMatrixOtherSummaryDto = z.infer<
  typeof pricingMatrixOtherSummaryDtoSchema
>;
export type PricingMatrixOtherDetailDto = z.infer<
  typeof pricingMatrixOtherDetailDtoSchema
>;
export type PricingMatrixOtherLookupDto = z.infer<
  typeof pricingMatrixOtherLookupDtoSchema
>;
export type PricingMatrixOtherCreateDto = z.infer<
  typeof pricingMatrixOtherCreateDtoSchema
>;
export type PricingMatrixOtherUpdateDto = z.infer<
  typeof pricingMatrixOtherUpdateDtoSchema
>;
export type PricingMatrixOtherPatchDto = z.infer<
  typeof pricingMatrixOtherPatchDtoSchema
>;

export type PricingMatrixOtherListParams = SetupListParams & {
  pricingMatrixId?: number;
  categoryCode?: string;
};

export type PricingMatrixOtherLookupParams = {
  activeOnly?: boolean;
  pricingMatrixId?: number;
};
