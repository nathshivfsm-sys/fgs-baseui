import { z } from 'zod';
import {
  nullableText,
  pagedResultSchema,
  setupResponseSchema,
  type SetupListParams,
} from './envelope.schema';

/**
 * Wire shapes of `/billingcategory` from the FGS Setup Service swagger
 * (`BillingCategory*` DTOs).
 */
export const billingCategorySummaryDtoSchema = z.object({
  id: z.number(),
  billingCategoryType: nullableText,
  billingCategoryName: nullableText,
  description: nullableText,
  displayOrder: z.number().nullish(),
  isSystemDefined: z.boolean(),
  showToFieldTech: z.boolean(),
  allowToPick: z.boolean(),
  isActive: z.boolean(),
});

export const billingCategoryDetailDtoSchema = billingCategorySummaryDtoSchema;

export const billingCategoryLookupDtoSchema = z.object({
  id: z.number(),
  billingCategoryType: nullableText,
  billingCategoryName: nullableText,
  displayOrder: z.number().nullish(),
});

export const billingCategoryCreateDtoSchema = z.object({
  billingCategoryType: nullableText,
  billingCategoryName: nullableText,
  description: nullableText,
  displayOrder: z.number().nullish(),
  isSystemDefined: z.boolean(),
  showToFieldTech: z.boolean(),
  allowToPick: z.boolean(),
});

export const billingCategoryUpdateDtoSchema = billingCategoryCreateDtoSchema;

export const billingCategoryPatchDtoSchema = z.object({
  billingCategoryType: nullableText,
  billingCategoryName: nullableText,
  description: nullableText,
  displayOrder: z.number().nullish(),
  isSystemDefined: z.boolean().nullish(),
  showToFieldTech: z.boolean().nullish(),
  allowToPick: z.boolean().nullish(),
  isActive: z.boolean().nullish(),
});

export const billingCategoryListResponseSchema = setupResponseSchema(
  pagedResultSchema(billingCategorySummaryDtoSchema),
);
export const billingCategoryDetailResponseSchema = setupResponseSchema(
  billingCategoryDetailDtoSchema,
);
export const billingCategoryLookupResponseSchema = setupResponseSchema(
  z.array(billingCategoryLookupDtoSchema),
);

export type BillingCategorySummaryDto = z.infer<
  typeof billingCategorySummaryDtoSchema
>;
export type BillingCategoryDetailDto = z.infer<
  typeof billingCategoryDetailDtoSchema
>;
export type BillingCategoryLookupDto = z.infer<
  typeof billingCategoryLookupDtoSchema
>;
export type BillingCategoryCreateDto = z.infer<
  typeof billingCategoryCreateDtoSchema
>;
export type BillingCategoryUpdateDto = z.infer<
  typeof billingCategoryUpdateDtoSchema
>;
export type BillingCategoryPatchDto = z.infer<
  typeof billingCategoryPatchDtoSchema
>;

export type BillingCategoryListParams = SetupListParams & {
  billingCategoryType?: string;
  billingCategoryName?: string;
  showToFieldTech?: boolean;
  allowToPick?: boolean;
  isSystemDefined?: boolean;
};

export type BillingCategoryLookupParams = {
  activeOnly?: boolean;
  showToFieldTech?: boolean;
  allowToPick?: boolean;
};
