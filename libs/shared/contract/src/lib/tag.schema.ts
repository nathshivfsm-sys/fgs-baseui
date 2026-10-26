import { z } from 'zod';
import {
  apiResponseSchema,
  nullableText,
  pagedResultSchema,
  type PagedListParams,
} from './envelope.schema';

/**
 * Wire shapes of `/tag` from the FGS Setup Service swagger (`FgsTag*` DTOs).
 * Tags are attached to customers, service locations, and other records across
 * remotes, so the DTOs live in the shared contract.
 */
export const tagSummaryDtoSchema = z.object({
  id: z.number(),
  tagCode: nullableText,
  name: nullableText,
  description: nullableText,
  backgroundColor: nullableText,
  textColor: nullableText,
  iconFileId: z.number().nullish(),
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
});

export const tagUpdateDtoSchema = tagCreateDtoSchema;

export const tagPatchDtoSchema = tagCreateDtoSchema.extend({
  isActive: z.boolean().nullish(),
});

export const tagListResponseSchema = apiResponseSchema(
  pagedResultSchema(tagSummaryDtoSchema),
);
export const tagDetailResponseSchema = apiResponseSchema(tagDetailDtoSchema);
export const tagLookupResponseSchema = apiResponseSchema(
  z.array(tagLookupDtoSchema),
);

export type TagSummaryDto = z.infer<typeof tagSummaryDtoSchema>;
export type TagDetailDto = z.infer<typeof tagDetailDtoSchema>;
export type TagLookupDto = z.infer<typeof tagLookupDtoSchema>;
export type TagCreateDto = z.infer<typeof tagCreateDtoSchema>;
export type TagUpdateDto = z.infer<typeof tagUpdateDtoSchema>;
export type TagPatchDto = z.infer<typeof tagPatchDtoSchema>;

export type TagListParams = PagedListParams & {
  isActive?: boolean;
  tagCode?: string;
  name?: string;
};
