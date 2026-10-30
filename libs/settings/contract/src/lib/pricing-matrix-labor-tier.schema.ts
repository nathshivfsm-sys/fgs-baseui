import { z } from 'zod';
import {
  pagedResultSchema,
  setupResponseSchema,
  type SetupListParams,
} from './envelope.schema';

/**
 * Wire shapes of `/pricingmatrixlabortier` from the FGS Setup Service swagger
 * (`FgsSetupPricingMatrixLaborTier*` write DTOs). Swagger documents create,
 * update, and patch only. Read DTOs add `id` and `isActive` (present on patch)
 * to the create fields. Detail equals summary.
 */
const pricingMatrixLaborTierFields = {
  pricingMatrixLaborId: z.number(),
  sequenceOrder: z.number(),
  durationMinutes: z.number(),
  rate: z.number(),
  techSkillLevelId: z.number().nullish(),
};

export const pricingMatrixLaborTierSummaryDtoSchema = z.object({
  id: z.number(),
  ...pricingMatrixLaborTierFields,
  isActive: z.boolean(),
});

export const pricingMatrixLaborTierDetailDtoSchema =
  pricingMatrixLaborTierSummaryDtoSchema;

export const pricingMatrixLaborTierLookupDtoSchema = z.object({
  id: z.number(),
  pricingMatrixLaborId: z.number(),
  sequenceOrder: z.number(),
  rate: z.number(),
});

export const pricingMatrixLaborTierCreateDtoSchema = z.object(
  pricingMatrixLaborTierFields,
);

export const pricingMatrixLaborTierUpdateDtoSchema =
  pricingMatrixLaborTierCreateDtoSchema;

export const pricingMatrixLaborTierPatchDtoSchema = z.object({
  pricingMatrixLaborId: z.number().nullish(),
  sequenceOrder: z.number().nullish(),
  durationMinutes: z.number().nullish(),
  rate: z.number().nullish(),
  techSkillLevelId: z.number().nullish(),
  isActive: z.boolean().nullish(),
});

export const pricingMatrixLaborTierListResponseSchema = setupResponseSchema(
  pagedResultSchema(pricingMatrixLaborTierSummaryDtoSchema),
);
export const pricingMatrixLaborTierDetailResponseSchema = setupResponseSchema(
  pricingMatrixLaborTierDetailDtoSchema,
);
export const pricingMatrixLaborTierLookupResponseSchema = setupResponseSchema(
  z.array(pricingMatrixLaborTierLookupDtoSchema),
);

export type PricingMatrixLaborTierSummaryDto = z.infer<
  typeof pricingMatrixLaborTierSummaryDtoSchema
>;
export type PricingMatrixLaborTierDetailDto = z.infer<
  typeof pricingMatrixLaborTierDetailDtoSchema
>;
export type PricingMatrixLaborTierLookupDto = z.infer<
  typeof pricingMatrixLaborTierLookupDtoSchema
>;
export type PricingMatrixLaborTierCreateDto = z.infer<
  typeof pricingMatrixLaborTierCreateDtoSchema
>;
export type PricingMatrixLaborTierUpdateDto = z.infer<
  typeof pricingMatrixLaborTierUpdateDtoSchema
>;
export type PricingMatrixLaborTierPatchDto = z.infer<
  typeof pricingMatrixLaborTierPatchDtoSchema
>;

export type PricingMatrixLaborTierListParams = SetupListParams & {
  pricingMatrixLaborId?: number;
};

export type PricingMatrixLaborTierLookupParams = {
  activeOnly?: boolean;
  pricingMatrixLaborId?: number;
};
