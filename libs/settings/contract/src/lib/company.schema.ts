import { z } from 'zod';
import { nullableText, setupResponseSchema } from './envelope.schema';

/**
 * Wire shapes of `/company/{companyId}` from the FGS Setup Service swagger.
 * Display strings are lenient (`nullish`): one missing field must not blank a
 * screen. Required-ness belongs on the form schema in data-access.
 *
 * Keys the screen never reads (`id`, `tenantId`, `companyGuid`, address `id` /
 * `county` / `formattedAddress` / coordinates / `placeId`) are stripped by Zod
 * without being listed.
 */
export const companyAddressDtoSchema = z.object({
  addressLine1: nullableText,
  addressLine2: nullableText,
  addressLine3: nullableText,
  addressLine4: nullableText,
  city: nullableText,
  state: nullableText,
  postalCode: nullableText,
  country: nullableText,
});

export const companyDtoSchema = z.object({
  companyNumber: z.union([z.string(), z.number()]).nullish(),
  code: nullableText,
  name: nullableText,
  legalName: nullableText,
  email: nullableText,
  phoneNumber: nullableText,
  website: nullableText,
  taxId: nullableText,
  companySize: nullableText,
  timeZone: nullableText,
  isActive: z.boolean(),
  physicalAddress: companyAddressDtoSchema.nullish(),
  billingAddress: companyAddressDtoSchema.nullish(),
});

export const companyPatchDtoSchema = z.object({
  name: nullableText,
  legalName: nullableText,
  companySize: nullableText,
  taxId: nullableText,
  email: nullableText,
  phoneNumber: nullableText,
  website: nullableText,
  timeZone: nullableText,
  isActive: z.boolean().nullish(),
});

export const companyDetailResponseSchema = setupResponseSchema(companyDtoSchema);

export type CompanyAddressDto = z.infer<typeof companyAddressDtoSchema>;
export type CompanyDto = z.infer<typeof companyDtoSchema>;
export type CompanyPatchDto = z.infer<typeof companyPatchDtoSchema>;
