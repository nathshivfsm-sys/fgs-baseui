import { z } from 'zod';
import {
  nullableText,
  pagedResultSchema,
  setupResponseSchema,
  type SetupListParams,
} from './envelope.schema';

/**
 * Wire shapes of `/pricingmatrix` from the FGS Setup Service swagger
 * (`FgsSetupPricingMatrix*` DTOs). `description` is write-only: create and
 * update accept it, summary and detail do not return it. `code` is read-only.
 */
export const pricingMatrixSummaryDtoSchema = z.object({
  id: z.number(),
  code: nullableText,
  name: nullableText,
  isDefault: z.boolean(),
  isLaborTierStructure: z.boolean(),
  isLaborRateBySkillLevel: z.boolean(),
  priceAdjustmentTypeId: z.number(),
  effectiveFrom: z.string(),
  effectiveTo: nullableText,
  isMobileVisible: z.boolean(),
  isActive: z.boolean(),
});

export const pricingMatrixDetailDtoSchema = pricingMatrixSummaryDtoSchema;

export const pricingMatrixLookupDtoSchema = z.object({
  id: z.number(),
  code: nullableText,
  name: nullableText,
  isDefault: z.boolean(),
});

export const pricingMatrixCreateDtoSchema = z.object({
  name: nullableText,
  description: nullableText,
  isDefault: z.boolean(),
  isLaborTierStructure: z.boolean(),
  isLaborRateBySkillLevel: z.boolean(),
  priceAdjustmentTypeId: z.number().nullish(),
  effectiveFrom: nullableText,
  effectiveTo: nullableText,
  isMobileVisible: z.boolean().nullish(),
});

export const pricingMatrixUpdateDtoSchema = pricingMatrixCreateDtoSchema;

export const pricingMatrixPatchDtoSchema = z.object({
  name: nullableText,
  description: nullableText,
  isDefault: z.boolean().nullish(),
  isLaborTierStructure: z.boolean().nullish(),
  isLaborRateBySkillLevel: z.boolean().nullish(),
  priceAdjustmentTypeId: z.number().nullish(),
  effectiveFrom: nullableText,
  effectiveTo: nullableText,
  isMobileVisible: z.boolean().nullish(),
  isActive: z.boolean().nullish(),
});

export const pricingMatrixListResponseSchema = setupResponseSchema(
  pagedResultSchema(pricingMatrixSummaryDtoSchema),
);
export const pricingMatrixDetailResponseSchema = setupResponseSchema(
  pricingMatrixDetailDtoSchema,
);
export const pricingMatrixLookupResponseSchema = setupResponseSchema(
  z.array(pricingMatrixLookupDtoSchema),
);

export type PricingMatrixSummaryDto = z.infer<
  typeof pricingMatrixSummaryDtoSchema
>;
export type PricingMatrixDetailDto = z.infer<
  typeof pricingMatrixDetailDtoSchema
>;
export type PricingMatrixLookupDto = z.infer<
  typeof pricingMatrixLookupDtoSchema
>;
export type PricingMatrixCreateDto = z.infer<
  typeof pricingMatrixCreateDtoSchema
>;
export type PricingMatrixUpdateDto = z.infer<
  typeof pricingMatrixUpdateDtoSchema
>;
export type PricingMatrixPatchDto = z.infer<typeof pricingMatrixPatchDtoSchema>;

export type PricingMatrixListParams = SetupListParams & {
  code?: string;
  isDefault?: boolean;
};
