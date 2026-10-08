import { z } from 'zod';
import {
  nullableText,
  pagedResultSchema,
  setupResponseSchema,
  type SetupListParams,
} from './envelope.schema';

const nullableNumber = z.number().nullish();

/**
 * Wire shapes of `/setupdescription` from the FGS Setup Service swagger
 * (`FgsSetupDescription*` DTOs).
 */
export const setupDescriptionSummaryDtoSchema = z.object({
  id: z.number(),
  descriptionTypeCode: nullableText,
  shortNote: nullableText,
  body: nullableText,
  fgsSetupTechTradeId: nullableNumber,
  sortOrder: z.number(),
  isActive: z.boolean(),
});

export const setupDescriptionDetailDtoSchema = setupDescriptionSummaryDtoSchema;

export const setupDescriptionLookupDtoSchema = z.object({
  id: z.number(),
  descriptionTypeCode: nullableText,
  body: nullableText,
  sortOrder: z.number(),
});

export const setupDescriptionCreateDtoSchema = z.object({
  descriptionTypeCode: nullableText,
  shortNote: nullableText,
  body: nullableText,
  fgsSetupTechTradeId: nullableNumber,
  sortOrder: z.number(),
});

export const setupDescriptionUpdateDtoSchema = setupDescriptionCreateDtoSchema;

export const setupDescriptionPatchDtoSchema = z.object({
  descriptionTypeCode: nullableText,
  shortNote: nullableText,
  body: nullableText,
  fgsSetupTechTradeId: nullableNumber,
  sortOrder: z.number().nullish(),
  isActive: z.boolean().nullish(),
});

export const setupDescriptionListResponseSchema = setupResponseSchema(
  pagedResultSchema(setupDescriptionSummaryDtoSchema),
);
export const setupDescriptionDetailResponseSchema = setupResponseSchema(
  setupDescriptionDetailDtoSchema,
);
export const setupDescriptionLookupResponseSchema = setupResponseSchema(
  z.array(setupDescriptionLookupDtoSchema),
);

export type SetupDescriptionSummaryDto = z.infer<
  typeof setupDescriptionSummaryDtoSchema
>;
export type SetupDescriptionDetailDto = z.infer<
  typeof setupDescriptionDetailDtoSchema
>;
export type SetupDescriptionLookupDto = z.infer<
  typeof setupDescriptionLookupDtoSchema
>;
export type SetupDescriptionCreateDto = z.infer<
  typeof setupDescriptionCreateDtoSchema
>;
export type SetupDescriptionUpdateDto = z.infer<
  typeof setupDescriptionUpdateDtoSchema
>;
export type SetupDescriptionPatchDto = z.infer<
  typeof setupDescriptionPatchDtoSchema
>;

export type SetupDescriptionListParams = SetupListParams & {
  descriptionTypeCode?: string;
};

export type SetupDescriptionLookupParams = {
  activeOnly?: boolean;
};
