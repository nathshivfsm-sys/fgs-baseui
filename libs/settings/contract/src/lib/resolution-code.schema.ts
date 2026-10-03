import { z } from 'zod';
import {
  nullableText,
  pagedResultSchema,
  setupResponseSchema,
  type SetupListParams,
} from './envelope.schema';

/**
 * Wire shapes of `/resolutioncode` from the FGS Setup Service swagger
 * (`ResolutionCode*` DTOs).
 */
export const resolutionCodeSummaryDtoSchema = z.object({
  id: z.number(),
  gloResolutionTypeId: z.number(),
  resolutionCode: nullableText,
  resolutionName: nullableText,
  isMobileVisible: z.boolean(),
  isActive: z.boolean(),
});

export const resolutionCodeDetailDtoSchema = resolutionCodeSummaryDtoSchema;

export const resolutionCodeLookupDtoSchema = z.object({
  id: z.number(),
  resolutionCode: nullableText,
  resolutionName: nullableText,
});

export const resolutionCodeCreateDtoSchema = z.object({
  gloResolutionTypeId: z.number(),
  resolutionCode: nullableText,
  resolutionName: nullableText,
  isMobileVisible: z.boolean(),
});

export const resolutionCodeUpdateDtoSchema = resolutionCodeCreateDtoSchema;

export const resolutionCodePatchDtoSchema = z.object({
  gloResolutionTypeId: z.number().nullish(),
  resolutionCode: nullableText,
  resolutionName: nullableText,
  isMobileVisible: z.boolean().nullish(),
  isActive: z.boolean().nullish(),
});

export const resolutionCodeListResponseSchema = setupResponseSchema(
  pagedResultSchema(resolutionCodeSummaryDtoSchema),
);
export const resolutionCodeDetailResponseSchema = setupResponseSchema(
  resolutionCodeDetailDtoSchema,
);
export const resolutionCodeLookupResponseSchema = setupResponseSchema(
  z.array(resolutionCodeLookupDtoSchema),
);

export type ResolutionCodeSummaryDto = z.infer<
  typeof resolutionCodeSummaryDtoSchema
>;
export type ResolutionCodeDetailDto = z.infer<
  typeof resolutionCodeDetailDtoSchema
>;
export type ResolutionCodeLookupDto = z.infer<
  typeof resolutionCodeLookupDtoSchema
>;
export type ResolutionCodeCreateDto = z.infer<
  typeof resolutionCodeCreateDtoSchema
>;
export type ResolutionCodeUpdateDto = z.infer<
  typeof resolutionCodeUpdateDtoSchema
>;
export type ResolutionCodePatchDto = z.infer<
  typeof resolutionCodePatchDtoSchema
>;

export type ResolutionCodeListParams = SetupListParams & {
  resolutionCode?: string;
  resolutionName?: string;
};

export type ResolutionCodeLookupParams = {
  activeOnly?: boolean;
  isMobileVisible?: boolean;
};
