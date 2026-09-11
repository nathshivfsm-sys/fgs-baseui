import type {
  CompanyAddressDto,
  CompanyDto,
  CompanyGeneralInfo,
} from '../schemas/company-settings.schema';
import type {
  CompanyAddress,
  CompanyDirtyFields,
  CompanyPatch,
  CompanyProfile,
} from '../types/company-profile';

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
): CompanyPatch {
  const wire: Required<CompanyPatch> = {
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
  ) as CompanyPatch;
}
