import { z } from 'zod';
import {
  nullableText,
  pagedResultSchema,
  setupResponseSchema,
  type SetupListParams,
} from './envelope.schema';

const nullableNumber = z.number().nullish();

/**
 * Wire shapes of `/postalcode` from the FGS Setup Service swagger
 * (`FgsSetupPostalCode*` DTOs), inferred from the Zone catalog pattern and the
 * Postal Code listing / create screens.
 */
export const postalCodeSummaryDtoSchema = z.object({
  id: z.number(),
  postalCode: nullableText,
  city: nullableText,
  state: nullableText,
  fgsSetupZoneId: nullableNumber,
  zoneCode: nullableText,
  zoneName: nullableText,
  fgsSetupTaxId: nullableNumber,
  taxCode: nullableText,
  taxRate: nullableNumber,
  tripCharge: nullableNumber,
  isActive: z.boolean(),
});

export const postalCodeDetailDtoSchema = postalCodeSummaryDtoSchema;

export const postalCodeLookupDtoSchema = z.object({
  id: z.number(),
  postalCode: nullableText,
  city: nullableText,
});

export const postalCodeCreateDtoSchema = z.object({
  postalCode: nullableText,
  city: nullableText,
  state: nullableText,
  fgsSetupZoneId: nullableNumber,
  fgsSetupTaxId: nullableNumber,
  tripCharge: nullableNumber,
});

export const postalCodeUpdateDtoSchema = postalCodeCreateDtoSchema;

export const postalCodePatchDtoSchema = z.object({
  postalCode: nullableText,
  city: nullableText,
  state: nullableText,
  fgsSetupZoneId: nullableNumber,
  fgsSetupTaxId: nullableNumber,
  tripCharge: nullableNumber,
  isActive: z.boolean().nullish(),
});

export const postalCodeListResponseSchema = setupResponseSchema(
  pagedResultSchema(postalCodeSummaryDtoSchema),
);
export const postalCodeDetailResponseSchema = setupResponseSchema(
  postalCodeDetailDtoSchema,
);
export const postalCodeLookupResponseSchema = setupResponseSchema(
  z.array(postalCodeLookupDtoSchema),
);

export type PostalCodeSummaryDto = z.infer<typeof postalCodeSummaryDtoSchema>;
export type PostalCodeDetailDto = z.infer<typeof postalCodeDetailDtoSchema>;
export type PostalCodeLookupDto = z.infer<typeof postalCodeLookupDtoSchema>;
export type PostalCodeCreateDto = z.infer<typeof postalCodeCreateDtoSchema>;
export type PostalCodeUpdateDto = z.infer<typeof postalCodeUpdateDtoSchema>;
export type PostalCodePatchDto = z.infer<typeof postalCodePatchDtoSchema>;

export type PostalCodeListParams = SetupListParams & {
  postalCode?: string;
  city?: string;
  state?: string;
};
