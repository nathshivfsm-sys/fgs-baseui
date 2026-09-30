import { z } from 'zod';
import {
  nullableText,
  pagedResultSchema,
  setupResponseSchema,
  type SetupListParams,
} from './envelope.schema';

/**
 * Wire shapes of `/jobtypetask` from the FGS Setup Service swagger
 * (`JobTypeTask*` DTOs). Frontend name is subcategory. The path and JSON
 * property names stay as swagger declares them.
 */
export const subcategorySummaryDtoSchema = z.object({
  id: z.number(),
  jobCategoryId: z.number(),
  tradeId: z.number(),
  skillLevelId: z.number().nullish(),
  name: nullableText,
  taskName: nullableText,
  priority: z.number(),
  estimatedHours: z.number(),
  displayOrder: z.number().nullish(),
  isActive: z.boolean(),
  categoryName: nullableText,
});

export const subcategoryDetailDtoSchema = subcategorySummaryDtoSchema;

export const subcategoryLookupDtoSchema = z.object({
  id: z.number(),
  name: nullableText,
});

export const subcategoryCreateDtoSchema = z.object({
  jobCategoryId: z.number(),
  tradeId: z.number(),
  name: nullableText,
  priority: z.number(),
  estimatedHours: z.number(),
  displayOrder: z.number().nullish(),
  taskName: nullableText,
  skillLevelId: z.number().nullish(),
  isActive: z.boolean().nullish(),
});

export const subcategoryUpdateDtoSchema = z.object({
  jobCategoryId: z.number(),
  tradeId: z.number(),
  name: nullableText,
  priority: z.number(),
  estimatedHours: z.number(),
  displayOrder: z.number().nullish(),
  taskName: nullableText,
  skillLevelId: z.number().nullish(),
});

export const subcategoryPatchDtoSchema = z.object({
  jobCategoryId: z.number().nullish(),
  tradeId: z.number().nullish(),
  name: nullableText,
  taskName: nullableText,
  priority: z.number().nullish(),
  estimatedHours: z.number().nullish(),
  displayOrder: z.number().nullish(),
  isActive: z.boolean().nullish(),
  skillLevelId: z.number().nullish(),
});

export const subcategoryListResponseSchema = setupResponseSchema(
  pagedResultSchema(subcategorySummaryDtoSchema),
);
export const subcategoryDetailResponseSchema = setupResponseSchema(
  subcategoryDetailDtoSchema,
);
export const subcategoryLookupResponseSchema = setupResponseSchema(
  z.array(subcategoryLookupDtoSchema),
);

export type SubcategorySummaryDto = z.infer<typeof subcategorySummaryDtoSchema>;
export type SubcategoryDetailDto = z.infer<typeof subcategoryDetailDtoSchema>;
export type SubcategoryLookupDto = z.infer<typeof subcategoryLookupDtoSchema>;
export type SubcategoryCreateDto = z.infer<typeof subcategoryCreateDtoSchema>;
export type SubcategoryUpdateDto = z.infer<typeof subcategoryUpdateDtoSchema>;
export type SubcategoryPatchDto = z.infer<typeof subcategoryPatchDtoSchema>;

export type SubcategoryListParams = SetupListParams & {
  taskName?: string;
  name?: string;
  jobCategoryId?: number;
  jobTypeId?: number;
};
