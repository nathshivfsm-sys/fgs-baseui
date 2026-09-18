import { z } from 'zod';
import {
  nullableText,
  pagedResultSchema,
  setupResponseSchema,
  type SetupListParams,
} from './envelope.schema';

/**
 * Wire shapes of `/techskilllevel` from the FGS Setup Service swagger
 * (`FgsSetupTechSkillLevel*` DTOs).
 */
export const techSkillLevelSummaryDtoSchema = z.object({
  id: z.number(),
  code: nullableText,
  name: nullableText,
  description: nullableText,
  sortOrder: z.number().nullish(),
  isActive: z.boolean(),
});

export const techSkillLevelDetailDtoSchema = techSkillLevelSummaryDtoSchema;

export const techSkillLevelLookupDtoSchema = z.object({
  id: z.number(),
  code: nullableText,
  name: nullableText,
  sortOrder: z.number().nullish(),
});

export const techSkillLevelCreateDtoSchema = z.object({
  code: nullableText,
  name: nullableText,
  description: nullableText,
  sortOrder: z.number().nullish(),
});

export const techSkillLevelUpdateDtoSchema = techSkillLevelCreateDtoSchema;

export const techSkillLevelPatchDtoSchema = z.object({
  code: nullableText,
  name: nullableText,
  description: nullableText,
  sortOrder: z.number().nullish(),
  isActive: z.boolean().nullish(),
});

export const techSkillLevelListResponseSchema = setupResponseSchema(
  pagedResultSchema(techSkillLevelSummaryDtoSchema),
);
export const techSkillLevelDetailResponseSchema = setupResponseSchema(
  techSkillLevelDetailDtoSchema,
);
export const techSkillLevelLookupResponseSchema = setupResponseSchema(
  z.array(techSkillLevelLookupDtoSchema),
);

export type TechSkillLevelSummaryDto = z.infer<
  typeof techSkillLevelSummaryDtoSchema
>;
export type TechSkillLevelDetailDto = z.infer<
  typeof techSkillLevelDetailDtoSchema
>;
export type TechSkillLevelLookupDto = z.infer<
  typeof techSkillLevelLookupDtoSchema
>;
export type TechSkillLevelCreateDto = z.infer<
  typeof techSkillLevelCreateDtoSchema
>;
export type TechSkillLevelUpdateDto = z.infer<
  typeof techSkillLevelUpdateDtoSchema
>;
export type TechSkillLevelPatchDto = z.infer<
  typeof techSkillLevelPatchDtoSchema
>;

export type TechSkillLevelListParams = SetupListParams & {
  code?: string;
  name?: string;
};
