import { z } from 'zod';
import type {
  PostalCodeCreateDto,
  PostalCodeSummaryDto,
  PostalCodeUpdateDto,
} from '@cms/settings-contract';

export const postalCodeFormSchema = z.object({
  postalCode: z.string().trim().min(1, 'Postal Code is required').max(16),
  city: z.string().trim().min(1, 'City is required').max(100),
  state: z.string().trim().max(32),
  fgsSetupZoneId: z.string(),
  fgsSetupTaxId: z.string().trim().min(1, 'Tax Code is required'),
  tripCharge: z
    .string()
    .trim()
    .refine(
      (value) => value === '' || Number.isFinite(Number(value)),
      'Enter a valid amount',
    ),
});

export type PostalCodeForm = z.infer<typeof postalCodeFormSchema>;

export function emptyPostalCodeForm(): PostalCodeForm {
  return {
    postalCode: '',
    city: '',
    state: '',
    fgsSetupZoneId: '',
    fgsSetupTaxId: '',
    tripCharge: '',
  };
}

export function toPostalCodeFormValues(
  postalCode: PostalCodeSummaryDto,
): PostalCodeForm {
  return {
    postalCode: postalCode.postalCode ?? '',
    city: postalCode.city ?? '',
    state: postalCode.state ?? '',
    fgsSetupZoneId:
      postalCode.fgsSetupZoneId == null ? '' : String(postalCode.fgsSetupZoneId),
    fgsSetupTaxId:
      postalCode.fgsSetupTaxId == null ? '' : String(postalCode.fgsSetupTaxId),
    tripCharge:
      postalCode.tripCharge == null ? '' : String(postalCode.tripCharge),
  };
}

function optionalId(value: string): number | null {
  if (value === '') return null;
  return Number(value);
}

export function toPostalCodeWriteDto(
  values: PostalCodeForm,
): PostalCodeCreateDto & PostalCodeUpdateDto {
  return {
    postalCode: values.postalCode,
    city: values.city,
    state: values.state === '' ? null : values.state,
    fgsSetupZoneId: optionalId(values.fgsSetupZoneId),
    fgsSetupTaxId: optionalId(values.fgsSetupTaxId),
    tripCharge: values.tripCharge === '' ? null : Number(values.tripCharge),
  };
}
