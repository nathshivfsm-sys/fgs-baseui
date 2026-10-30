import { z } from 'zod';
import {
  pagedResultSchema,
  setupResponseSchema,
  type SetupListParams,
} from './envelope.schema';

/**
 * Wire shapes of `/pricingmatrixlabor` from the FGS Setup Service swagger
 * (`FgsSetupPricingMatrixLabor*` write DTOs). Swagger documents create, update,
 * and patch only. Read DTOs add `id` and `isActive` (present on patch) to the
 * create fields. Detail equals summary.
 */
const pricingMatrixLaborFields = {
  pricingMatrixId: z.number(),
  laborRateTypeId: z.number(),
  techSkillLevelId: z.number().nullish(),
  baseRate: z.number(),
  overtimeMultiplier: z.number().nullish(),
  doubleTimeMultiplier: z.number().nullish(),
  discountPercent: z.number().nullish(),
};

export const pricingMatrixLaborSummaryDtoSchema = z.object({
  id: z.number(),
  ...pricingMatrixLaborFields,
  isActive: z.boolean(),
});

export const pricingMatrixLaborDetailDtoSchema =
  pricingMatrixLaborSummaryDtoSchema;

export const pricingMatrixLaborLookupDtoSchema = z.object({
  id: z.number(),
  pricingMatrixId: z.number(),
  laborRateTypeId: z.number(),
  baseRate: z.number(),
});

export const pricingMatrixLaborCreateDtoSchema = z.object(
  pricingMatrixLaborFields,
);

export const pricingMatrixLaborUpdateDtoSchema =
  pricingMatrixLaborCreateDtoSchema;

export const pricingMatrixLaborPatchDtoSchema = z.object({
  pricingMatrixId: z.number().nullish(),
  laborRateTypeId: z.number().nullish(),
  techSkillLevelId: z.number().nullish(),
  baseRate: z.number().nullish(),
  overtimeMultiplier: z.number().nullish(),
  doubleTimeMultiplier: z.number().nullish(),
  discountPercent: z.number().nullish(),
  isActive: z.boolean().nullish(),
});

export const pricingMatrixLaborListResponseSchema = setupResponseSchema(
  pagedResultSchema(pricingMatrixLaborSummaryDtoSchema),
);
export const pricingMatrixLaborDetailResponseSchema = setupResponseSchema(
  pricingMatrixLaborDetailDtoSchema,
);
export const pricingMatrixLaborLookupResponseSchema = setupResponseSchema(
  z.array(pricingMatrixLaborLookupDtoSchema),
);

export type PricingMatrixLaborSummaryDto = z.infer<
  typeof pricingMatrixLaborSummaryDtoSchema
>;
export type PricingMatrixLaborDetailDto = z.infer<
  typeof pricingMatrixLaborDetailDtoSchema
>;
export type PricingMatrixLaborLookupDto = z.infer<
  typeof pricingMatrixLaborLookupDtoSchema
>;
export type PricingMatrixLaborCreateDto = z.infer<
  typeof pricingMatrixLaborCreateDtoSchema
>;
export type PricingMatrixLaborUpdateDto = z.infer<
  typeof pricingMatrixLaborUpdateDtoSchema
>;
export type PricingMatrixLaborPatchDto = z.infer<
  typeof pricingMatrixLaborPatchDtoSchema
>;

export type PricingMatrixLaborListParams = SetupListParams & {
  pricingMatrixId?: number;
};

export type PricingMatrixLaborLookupParams = {
  activeOnly?: boolean;
  pricingMatrixId?: number;
};
