import { z } from 'zod';
import {
  nullableText,
  pagedResultSchema,
  setupResponseSchema,
  type SetupListParams,
} from './envelope.schema';

/**
 * Wire shapes of `/tag` from the FGS Setup Service swagger (`FgsTag*` DTOs).
 */
export const tagSummaryDtoSchema = z.object({
  id: z.number(),
  tagCode: nullableText,
  name: nullableText,
  description: nullableText,
  backgroundColor: nullableText,
  textColor: nullableText,
  iconFileId: z.number().nullish(),
  /** Entity scope when the API supplies it; empty means all entities. */
  entities: z.array(z.string()).nullish(),
  usageCount: z.number(),
  isActive: z.boolean(),
});

export const tagDetailDtoSchema = tagSummaryDtoSchema;

export const tagLookupDtoSchema = z.object({
  id: z.number(),
  tagCode: nullableText,
  name: nullableText,
});

export const tagCreateDtoSchema = z.object({
  tagCode: nullableText,
  name: nullableText,
  description: nullableText,
  backgroundColor: nullableText,
  textColor: nullableText,
  iconFileId: z.number().nullish(),
  entities: z.array(z.string()).nullish(),
});

export const tagUpdateDtoSchema = tagCreateDtoSchema;

export const tagPatchDtoSchema = z.object({
  tagCode: nullableText,
  name: nullableText,
  description: nullableText,
  backgroundColor: nullableText,
  textColor: nullableText,
  iconFileId: z.number().nullish(),
  entities: z.array(z.string()).nullish(),
  isActive: z.boolean().nullish(),
});

export const tagListResponseSchema = setupResponseSchema(
  pagedResultSchema(tagSummaryDtoSchema),
);
export const tagDetailResponseSchema = setupResponseSchema(tagDetailDtoSchema);
export const tagLookupResponseSchema = setupResponseSchema(
  z.array(tagLookupDtoSchema),
);

export type TagSummaryDto = z.infer<typeof tagSummaryDtoSchema>;
export type TagDetailDto = z.infer<typeof tagDetailDtoSchema>;
export type TagLookupDto = z.infer<typeof tagLookupDtoSchema>;
export type TagCreateDto = z.infer<typeof tagCreateDtoSchema>;
export type TagUpdateDto = z.infer<typeof tagUpdateDtoSchema>;
export type TagPatchDto = z.infer<typeof tagPatchDtoSchema>;

export type TagListParams = SetupListParams & {
  tagCode?: string;
  name?: string;
};
