import { z } from 'zod';
import {
  nullableText,
  pagedResultSchema,
  setupResponseSchema,
  type SetupListParams,
} from './envelope.schema';

/**
 * Wire shapes of `/tax` from the FGS Setup Service swagger (`FgsSetupTax*` DTOs).
 */
export const taxLineDetailDtoSchema = z.object({
  id: z.number(),
  fgsSetupTaxAuthorityId: z.number(),
  taxAuthorityCode: nullableText,
  taxAuthorityName: nullableText,
  taxPercent: z.number(),
  effectiveFromDate: z.string(),
  effectiveToDate: z.string().nullish(),
  isActive: z.boolean(),
});

export const taxSummaryDtoSchema = z.object({
  id: z.number(),
  taxCode: nullableText,
  name: nullableText,
  showTaxDetail: z.boolean(),
  description: nullableText,
  taxRate: z.number(),
  isActive: z.boolean(),
});

export const taxDetailDtoSchema = taxSummaryDtoSchema.extend({
  taxDetails: z.array(taxLineDetailDtoSchema).nullish(),
});

export const taxLookupDtoSchema = z.object({
  id: z.number(),
  taxCode: nullableText,
  name: nullableText,
  taxRate: z.number(),
});

export const taxCreateDtoSchema = z.object({
  taxCode: nullableText,
  name: nullableText,
  isExternalSystemRecord: z.boolean(),
  externalSystemId: nullableText,
  syncToken: nullableText,
  showTaxDetail: z.boolean(),
  description: nullableText,
});

export const taxUpdateDtoSchema = taxCreateDtoSchema;

export const taxPatchDtoSchema = z.object({
  taxCode: nullableText,
  name: nullableText,
  isExternalSystemRecord: z.boolean().nullish(),
  externalSystemId: nullableText,
  syncToken: nullableText,
  showTaxDetail: z.boolean().nullish(),
  description: nullableText,
  isActive: z.boolean().nullish(),
});

export const taxListResponseSchema = setupResponseSchema(
  pagedResultSchema(taxSummaryDtoSchema),
);
export const taxDetailResponseSchema = setupResponseSchema(taxDetailDtoSchema);
export const taxLookupResponseSchema = setupResponseSchema(
  z.array(taxLookupDtoSchema),
);

export type TaxLineDetailDto = z.infer<typeof taxLineDetailDtoSchema>;
export type TaxSummaryDto = z.infer<typeof taxSummaryDtoSchema>;
export type TaxDetailDto = z.infer<typeof taxDetailDtoSchema>;
export type TaxLookupDto = z.infer<typeof taxLookupDtoSchema>;
export type TaxCreateDto = z.infer<typeof taxCreateDtoSchema>;
export type TaxUpdateDto = z.infer<typeof taxUpdateDtoSchema>;
export type TaxPatchDto = z.infer<typeof taxPatchDtoSchema>;

export type TaxListParams = SetupListParams & {
  taxCode?: string;
  name?: string;
};
