import { z } from 'zod';

const nullableText = z.string().nullish();

/**
 * Wire shape of `GET /company/{companyId}`, taken from a real response.
 *
 * Display strings are deliberately lenient (`nullish`): one missing field must not
 * blank the whole screen. Required-ness is the form schema's job, below. Keys the
 * screen never reads (`id`, `tenantId`, `companyGuid`, address `id`/`county`/
 * `formattedAddress`/coordinates/`placeId`) are stripped by Zod without being listed.
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

export const companyResponseSchema = z.object({
  success: z.boolean(),
  statusCode: z.number(),
  data: companyDtoSchema,
});

export type CompanyAddressDto = z.infer<typeof companyAddressDtoSchema>;
export type CompanyDto = z.infer<typeof companyDtoSchema>;

const WEBSITE_PATTERN = /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(:\d+)?(\/\S*)?$/i;

function phoneDigitCount(value: string): number {
  return value.replace(/\D/g, '').length;
}

/**
 * The editable fields of the General Info form. Keys match the DTO's so the PATCH
 * body needs no renaming. `code` and `companyNumber` are read-only and deliberately
 * absent — they can never become dirty, so they can never be sent.
 */
export const companyGeneralInfoSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(150, 'Name must be 150 characters or fewer'),
  legalName: z
    .string()
    .trim()
    .min(1, 'Legal name is required')
    .max(150, 'Legal name must be 150 characters or fewer'),
  companySize: z.string(),
  taxId: z.string().trim().max(50, 'Tax ID must be 50 characters or fewer'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .pipe(z.email('Enter a valid email address')),
  phoneNumber: z
    .string()
    .min(1, 'Phone number is required')
    .refine(
      (value) => phoneDigitCount(value) >= 10 && phoneDigitCount(value) <= 15,
      'Enter a valid phone number',
    ),
  website: z
    .string()
    .trim()
    .refine(
      (value) => value === '' || WEBSITE_PATTERN.test(value),
      'Enter a valid website, e.g. www.example.com',
    ),
  timeZone: z.string().min(1, 'Time zone is required'),
  isActive: z.boolean(),
});

export type CompanyGeneralInfo = z.infer<typeof companyGeneralInfoSchema>;
