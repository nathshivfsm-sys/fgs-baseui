import { z } from 'zod';
import type {
  CompanyAddressDto,
  CompanyDto,
  CompanyPatchDto,
} from '@cms/settings-contract';

const WEBSITE_PATTERN = /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(:\d+)?(\/\S*)?$/i;

function phoneDigitCount(value: string): number {
  return value.replace(/\D/g, '').length;
}

/**
 * The editable fields of the General Info form. Keys match the DTO's so the PATCH
 * body needs no renaming. `code` and `companyNumber` are read-only and deliberately
 * absent — they can never become dirty, so they can never be sent.
 */
export const companyGeneralInfoFormSchema = z.object({
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

export type CompanyGeneralInfo = z.infer<typeof companyGeneralInfoFormSchema>;

export interface CompanyAddress {
  /** Non-empty street lines, in order (`addressLine1`..`addressLine4`). */
  lines: string[];
  city: string;
  state: string;
  postalCode: string;
  /** ISO country code as the API returns it, e.g. `US`. */
  country: string;
}

/** What the General Info screen renders: the editable form plus read-only context. */
export interface CompanyProfile {
  /** Read-only; equals the login `companyId` and is the endpoint's path key. */
  companyNumber: string;
  /** Read-only; a server-generated slug. */
  code: string;
  generalInfo: CompanyGeneralInfo;
  physicalAddress: CompanyAddress | null;
  billingAddress: CompanyAddress | null;
}

/** React Hook Form's `dirtyFields` for the flat General Info form. */
export type CompanyDirtyFields = Partial<
  Readonly<Record<keyof CompanyGeneralInfo, boolean | undefined>>
>;

function text(value: string | null | undefined): string {
  return value ?? '';
}

function emptyToNull(value: string): string | null {
  return value === '' ? null : value;
}

/**
 * The API stores digits with the country code (`15551234567`). North American numbers
 * are shown formatted; anything else is shown as returned rather than guessed at.
 */
export function formatPhoneNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  const hasCountryCode = digits.length === 11 && digits.startsWith('1');
  const national = hasCountryCode ? digits.slice(1) : digits;
  if (national.length !== 10) return raw;
  const formatted = `(${national.slice(0, 3)}) ${national.slice(3, 6)}-${national.slice(6)}`;
  return hasCountryCode ? `+1 ${formatted}` : formatted;
}

/** Back to the wire format: digits only, with `1` prefixed to a bare 10-digit number. */
export function normalizePhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, '');
  return digits.length === 10 ? `1${digits}` : digits;
}

function toCompanyAddress(
  dto: CompanyAddressDto | null | undefined,
): CompanyAddress | null {
  if (!dto) return null;
  const lines = [
    dto.addressLine1,
    dto.addressLine2,
    dto.addressLine3,
    dto.addressLine4,
  ].filter((line): line is string => Boolean(line?.trim()));
  return {
    lines,
    city: text(dto.city),
    state: text(dto.state),
    postalCode: text(dto.postalCode),
    country: text(dto.country),
  };
}

export function toCompanyProfile(dto: CompanyDto): CompanyProfile {
  return {
    companyNumber: dto.companyNumber == null ? '' : String(dto.companyNumber),
    code: text(dto.code),
    generalInfo: {
      name: text(dto.name),
      legalName: text(dto.legalName),
      companySize: text(dto.companySize),
      taxId: text(dto.taxId),
      email: text(dto.email),
      phoneNumber: formatPhoneNumber(text(dto.phoneNumber)),
      website: text(dto.website),
      timeZone: text(dto.timeZone),
      isActive: dto.isActive,
    },
    physicalAddress: toCompanyAddress(dto.physicalAddress),
    billingAddress: toCompanyAddress(dto.billingAddress),
  };
}

/**
 * Builds a PATCH body holding only the fields the user changed. A cleared optional
 * field is sent as `null`, never as `''`.
 */
export function toCompanyPatch(
  values: CompanyGeneralInfo,
  dirtyFields: CompanyDirtyFields,
): CompanyPatchDto {
  const wire: Required<CompanyPatchDto> = {
    name: values.name,
    legalName: values.legalName,
    companySize: emptyToNull(values.companySize),
    taxId: emptyToNull(values.taxId),
    email: values.email,
    phoneNumber: normalizePhoneNumber(values.phoneNumber),
    website: emptyToNull(values.website),
    timeZone: values.timeZone,
    isActive: values.isActive,
  };
  return Object.fromEntries(
    Object.entries(wire).filter(
      ([key]) => dirtyFields[key as keyof CompanyGeneralInfo],
    ),
  ) as CompanyPatchDto;
}
