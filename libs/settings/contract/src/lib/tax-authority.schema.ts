import { z } from 'zod';
import {
  nullableText,
  pagedResultSchema,
  setupResponseSchema,
  type SetupListParams,
} from './envelope.schema';

/**
 * Wire shapes of `/taxauthority` from the FGS Setup Service swagger
 * (`FgsSetupTaxAuthority*` DTOs).
 */
export const taxAuthoritySummaryDtoSchema = z.object({
  id: z.number(),
  code: nullableText,
  name: nullableText,
  regionCode: nullableText,
  isExternalSystemRecord: z.boolean(),
  taxPercent: z.number(),
  description: nullableText,
  usageCount: z.number(),
  isActive: z.boolean(),
});

export const taxAuthorityDetailDtoSchema = taxAuthoritySummaryDtoSchema;

export const taxAuthorityLookupDtoSchema = z.object({
  id: z.number(),
  code: nullableText,
  name: nullableText,
  taxPercent: z.number(),
});

export const taxAuthorityCreateDtoSchema = z.object({
  code: nullableText,
  name: nullableText,
  regionCode: nullableText,
  isExternalSystemRecord: z.boolean(),
  taxPercent: z.number(),
  description: nullableText,
});

export const taxAuthorityUpdateDtoSchema = taxAuthorityCreateDtoSchema;

export const taxAuthorityPatchDtoSchema = z.object({
  code: nullableText,
  name: nullableText,
  regionCode: nullableText,
  isExternalSystemRecord: z.boolean().nullish(),
  taxPercent: z.number().nullish(),
  description: nullableText,
  isActive: z.boolean().nullish(),
});

export const taxAuthorityListResponseSchema = setupResponseSchema(
  pagedResultSchema(taxAuthoritySummaryDtoSchema),
);
export const taxAuthorityDetailResponseSchema = setupResponseSchema(
  taxAuthorityDetailDtoSchema,
);
export const taxAuthorityLookupResponseSchema = setupResponseSchema(
  z.array(taxAuthorityLookupDtoSchema),
);

export type TaxAuthoritySummaryDto = z.infer<
  typeof taxAuthoritySummaryDtoSchema
>;
export type TaxAuthorityDetailDto = z.infer<typeof taxAuthorityDetailDtoSchema>;
export type TaxAuthorityLookupDto = z.infer<typeof taxAuthorityLookupDtoSchema>;
export type TaxAuthorityCreateDto = z.infer<typeof taxAuthorityCreateDtoSchema>;
export type TaxAuthorityUpdateDto = z.infer<typeof taxAuthorityUpdateDtoSchema>;
export type TaxAuthorityPatchDto = z.infer<typeof taxAuthorityPatchDtoSchema>;

export type TaxAuthorityListParams = SetupListParams & {
  code?: string;
  name?: string;
};
