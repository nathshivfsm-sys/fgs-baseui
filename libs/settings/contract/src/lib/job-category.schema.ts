import { z } from 'zod';
import {
  nullableText,
  pagedResultSchema,
  setupResponseSchema,
  type SetupListParams,
} from './envelope.schema';

/**
 * Wire shapes of `/jobcategory` from the FGS Setup Service swagger
 * (`JobCategory*` DTOs).
 */
export const jobCategorySummaryDtoSchema = z.object({
  id: z.number(),
  categoryCode: nullableText,
  name: nullableText,
  backgroundColor: nullableText,
  textColor: nullableText,
  displayOrder: z.number().nullish(),
  isActive: z.boolean(),
});

export const jobCategoryDetailDtoSchema = jobCategorySummaryDtoSchema;

export const jobCategoryLookupDtoSchema = z.object({
  id: z.number(),
  categoryCode: nullableText,
  name: nullableText,
  displayOrder: z.number().nullish(),
});

export const jobCategoryCreateDtoSchema = z.object({
  categoryCode: nullableText,
  name: nullableText,
  displayOrder: z.number().nullish(),
  backgroundColor: nullableText,
  textColor: nullableText,
  isActive: z.boolean(),
});

export const jobCategoryUpdateDtoSchema = z.object({
  categoryCode: nullableText,
  name: nullableText,
  displayOrder: z.number().nullish(),
  backgroundColor: nullableText,
  textColor: nullableText,
});

export const jobCategoryPatchDtoSchema = z.object({
  categoryCode: nullableText,
  name: nullableText,
  displayOrder: z.number().nullish(),
  isActive: z.boolean().nullish(),
  backgroundColor: nullableText,
  textColor: nullableText,
});

export const jobCategoryListResponseSchema = setupResponseSchema(
  pagedResultSchema(jobCategorySummaryDtoSchema),
);
export const jobCategoryDetailResponseSchema = setupResponseSchema(
  jobCategoryDetailDtoSchema,
);
export const jobCategoryLookupResponseSchema = setupResponseSchema(
  z.array(jobCategoryLookupDtoSchema),
);

export type JobCategorySummaryDto = z.infer<typeof jobCategorySummaryDtoSchema>;
export type JobCategoryDetailDto = z.infer<typeof jobCategoryDetailDtoSchema>;
export type JobCategoryLookupDto = z.infer<typeof jobCategoryLookupDtoSchema>;
export type JobCategoryCreateDto = z.infer<typeof jobCategoryCreateDtoSchema>;
export type JobCategoryUpdateDto = z.infer<typeof jobCategoryUpdateDtoSchema>;
export type JobCategoryPatchDto = z.infer<typeof jobCategoryPatchDtoSchema>;

export type JobCategoryListParams = SetupListParams & {
  categoryCode?: string;
  name?: string;
};
