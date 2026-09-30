import { z } from 'zod';
import {
  nullableText,
  pagedResultSchema,
  setupResponseSchema,
  type SetupListParams,
} from './envelope.schema';

/**
 * Wire shapes of `/jobtype` from the FGS Setup Service swagger
 * (`JobType*` DTOs). `jobTypeTaskId` on a nested line is a subcategory id
 * (`/jobtypetask`). `usedFor` is an int32; swagger publishes no enum.
 */
export const jobTypeSubCategoryDtoSchema = z.object({
  categoryId: z.number(),
  categoryName: nullableText,
  jobTypeTaskId: z.number(),
  name: nullableText,
});

export const jobTypeSubCategoryWriteDtoSchema = z.object({
  jobTypeTaskId: z.number(),
  displayOrder: z.number().nullish(),
  isActive: z.boolean(),
});

export const jobTypeSummaryDtoSchema = z.object({
  id: z.number(),
  jobTypeCode: nullableText,
  name: nullableText,
  usedFor: z.number(),
  businessUnit: nullableText,
  showToFieldTech: z.boolean(),
  showOnCustomerPortal: z.boolean(),
  displayOrder: z.number().nullish(),
  isActive: z.boolean(),
});

export const jobTypeDetailDtoSchema = jobTypeSummaryDtoSchema.extend({
  subCategories: z.array(jobTypeSubCategoryDtoSchema).nullish(),
});

export const jobTypeLookupDtoSchema = z.object({
  id: z.number(),
  jobTypeCode: nullableText,
  name: nullableText,
  displayOrder: z.number().nullish(),
});

export const jobTypeCountsDtoSchema = z.object({
  activeCount: z.number(),
  inactiveCount: z.number(),
});

export const jobTypeCreateDtoSchema = z.object({
  jobTypeCode: nullableText,
  name: nullableText,
  usedFor: z.number(),
  businessUnit: nullableText,
  showToFieldTech: z.boolean(),
  showOnCustomerPortal: z.boolean(),
  displayOrder: z.number().nullish(),
  subCategories: z.array(jobTypeSubCategoryWriteDtoSchema).nullish(),
  isActive: z.boolean(),
});

export const jobTypeUpdateDtoSchema = z.object({
  jobTypeCode: nullableText,
  name: nullableText,
  usedFor: z.number(),
  businessUnit: nullableText,
  showToFieldTech: z.boolean(),
  showOnCustomerPortal: z.boolean(),
  displayOrder: z.number().nullish(),
  subCategories: z.array(jobTypeSubCategoryWriteDtoSchema).nullish(),
});

export const jobTypePatchDtoSchema = z.object({
  jobTypeCode: nullableText,
  name: nullableText,
  usedFor: z.number().nullish(),
  businessUnit: nullableText,
  showToFieldTech: z.boolean().nullish(),
  showOnCustomerPortal: z.boolean().nullish(),
  displayOrder: z.number().nullish(),
  isActive: z.boolean().nullish(),
  subCategories: z.array(jobTypeSubCategoryWriteDtoSchema).nullish(),
});

export const jobTypeListResponseSchema = setupResponseSchema(
  pagedResultSchema(jobTypeSummaryDtoSchema),
);
export const jobTypeDetailResponseSchema = setupResponseSchema(
  jobTypeDetailDtoSchema,
);
export const jobTypeLookupResponseSchema = setupResponseSchema(
  z.array(jobTypeLookupDtoSchema),
);
export const jobTypeCountsResponseSchema = setupResponseSchema(
  jobTypeCountsDtoSchema,
);

export type JobTypeSubCategoryDto = z.infer<typeof jobTypeSubCategoryDtoSchema>;
export type JobTypeSubCategoryWriteDto = z.infer<
  typeof jobTypeSubCategoryWriteDtoSchema
>;
export type JobTypeSummaryDto = z.infer<typeof jobTypeSummaryDtoSchema>;
export type JobTypeDetailDto = z.infer<typeof jobTypeDetailDtoSchema>;
export type JobTypeLookupDto = z.infer<typeof jobTypeLookupDtoSchema>;
export type JobTypeCountsDto = z.infer<typeof jobTypeCountsDtoSchema>;
export type JobTypeCreateDto = z.infer<typeof jobTypeCreateDtoSchema>;
export type JobTypeUpdateDto = z.infer<typeof jobTypeUpdateDtoSchema>;
export type JobTypePatchDto = z.infer<typeof jobTypePatchDtoSchema>;

export type JobTypeListParams = SetupListParams & {
  jobTypeCode?: string;
  name?: string;
  usedFor?: number;
  jobTypeTaskId?: number;
  businessUnit?: string;
};

export type JobTypeCountsParams = {
  search?: string;
  jobTypeCode?: string;
  name?: string;
  usedFor?: number;
  jobTypeTaskId?: number;
  businessUnit?: string;
};
