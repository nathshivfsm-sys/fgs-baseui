import { z } from 'zod';
import {
  nullableText,
  pagedResultSchema,
  setupResponseSchema,
  type SetupListParams,
} from './envelope.schema';

/**
 * Wire shapes of `/businesstype` from the FGS Setup Service swagger
 * (`FgsBusinessType*` DTOs).
 */
export const businessTypeSummaryDtoSchema = z.object({
  id: z.number(),
  code: nullableText,
  name: nullableText,
  description: nullableText,
  displayOrder: z.number().nullish(),
  isActive: z.boolean(),
});

export const businessTypeDetailDtoSchema = businessTypeSummaryDtoSchema;

export const businessTypeLookupDtoSchema = z.object({
  id: z.number(),
  code: nullableText,
  name: nullableText,
  displayOrder: z.number().nullish(),
});

export const businessTypeCreateDtoSchema = z.object({
  code: nullableText,
  name: nullableText,
  description: nullableText,
  displayOrder: z.number().nullish(),
});

export const businessTypeUpdateDtoSchema = businessTypeCreateDtoSchema;

export const businessTypePatchDtoSchema = z.object({
  code: nullableText,
  name: nullableText,
  description: nullableText,
  displayOrder: z.number().nullish(),
  isActive: z.boolean().nullish(),
});

export const businessTypeListResponseSchema = setupResponseSchema(
  pagedResultSchema(businessTypeSummaryDtoSchema),
);
export const businessTypeDetailResponseSchema = setupResponseSchema(
  businessTypeDetailDtoSchema,
);
export const businessTypeLookupResponseSchema = setupResponseSchema(
  z.array(businessTypeLookupDtoSchema),
);

export type BusinessTypeSummaryDto = z.infer<
  typeof businessTypeSummaryDtoSchema
>;
export type BusinessTypeDetailDto = z.infer<typeof businessTypeDetailDtoSchema>;
export type BusinessTypeLookupDto = z.infer<typeof businessTypeLookupDtoSchema>;
export type BusinessTypeCreateDto = z.infer<typeof businessTypeCreateDtoSchema>;
export type BusinessTypeUpdateDto = z.infer<typeof businessTypeUpdateDtoSchema>;
export type BusinessTypePatchDto = z.infer<typeof businessTypePatchDtoSchema>;

export type BusinessTypeListParams = SetupListParams & {
  code?: string;
  name?: string;
};
