import { z } from 'zod';
import {
  pagedResultSchema,
  setupResponseSchema,
  type SetupListParams,
} from './envelope.schema';

/**
 * Wire shapes of `/pricingmatrixmaterialtier` from the FGS Setup Service
 * swagger (`FgsSetupPricingMatrixMaterialTier*` write DTOs). Swagger documents
 * create, update, and patch only. Read DTOs add `id` and `isActive` (present
 * on patch) to the create fields. Detail equals summary.
 */
const pricingMatrixMaterialTierFields = {
  pricingMatrixId: z.number(),
  fromCost: z.number(),
  toCost: z.number().nullish(),
  adjustmentValue: z.number(),
};

export const pricingMatrixMaterialTierSummaryDtoSchema = z.object({
  id: z.number(),
  ...pricingMatrixMaterialTierFields,
  isActive: z.boolean(),
});

export const pricingMatrixMaterialTierDetailDtoSchema =
  pricingMatrixMaterialTierSummaryDtoSchema;

export const pricingMatrixMaterialTierLookupDtoSchema = z.object({
  id: z.number(),
  pricingMatrixId: z.number(),
  fromCost: z.number(),
  toCost: z.number().nullish(),
  adjustmentValue: z.number(),
});

export const pricingMatrixMaterialTierCreateDtoSchema = z.object(
  pricingMatrixMaterialTierFields,
);

export const pricingMatrixMaterialTierUpdateDtoSchema =
  pricingMatrixMaterialTierCreateDtoSchema;

export const pricingMatrixMaterialTierPatchDtoSchema = z.object({
  pricingMatrixId: z.number().nullish(),
  fromCost: z.number().nullish(),
  toCost: z.number().nullish(),
  adjustmentValue: z.number().nullish(),
  isActive: z.boolean().nullish(),
});

export const pricingMatrixMaterialTierListResponseSchema = setupResponseSchema(
  pagedResultSchema(pricingMatrixMaterialTierSummaryDtoSchema),
);
export const pricingMatrixMaterialTierDetailResponseSchema =
  setupResponseSchema(pricingMatrixMaterialTierDetailDtoSchema);
export const pricingMatrixMaterialTierLookupResponseSchema =
  setupResponseSchema(z.array(pricingMatrixMaterialTierLookupDtoSchema));

export type PricingMatrixMaterialTierSummaryDto = z.infer<
  typeof pricingMatrixMaterialTierSummaryDtoSchema
>;
export type PricingMatrixMaterialTierDetailDto = z.infer<
  typeof pricingMatrixMaterialTierDetailDtoSchema
>;
export type PricingMatrixMaterialTierLookupDto = z.infer<
  typeof pricingMatrixMaterialTierLookupDtoSchema
>;
export type PricingMatrixMaterialTierCreateDto = z.infer<
  typeof pricingMatrixMaterialTierCreateDtoSchema
>;
export type PricingMatrixMaterialTierUpdateDto = z.infer<
  typeof pricingMatrixMaterialTierUpdateDtoSchema
>;
export type PricingMatrixMaterialTierPatchDto = z.infer<
  typeof pricingMatrixMaterialTierPatchDtoSchema
>;

export type PricingMatrixMaterialTierListParams = SetupListParams & {
  pricingMatrixId?: number;
};

export type PricingMatrixMaterialTierLookupParams = {
  activeOnly?: boolean;
  pricingMatrixId?: number;
};
