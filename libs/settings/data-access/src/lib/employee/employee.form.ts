import { z } from 'zod';
import type {
  EmployeeCreateDto,
  EmployeeDetailDto,
  EmployeeLocationWriteDto,
  EmployeePatchDto,
  EmployeeTechnicianProfileWriteDto,
} from '@cms/settings-contract';

export const EMPLOYEE_TYPE_OFFICE = 1;
export const EMPLOYEE_TYPE_TECHNICIAN = 2;

export const EMPLOYEE_STATUS_ACTIVE = 1;
export const EMPLOYEE_STATUS_INACTIVE = 2;

export const LABOR_BURDEN_TYPE_PERCENTAGE = 1;
export const LABOR_BURDEN_TYPE_FIXED = 2;

export const START_LOCATION_OFFICE = 1;
export const START_LOCATION_HOME = 2;

function phoneDigitCount(value: string): number {
  return value.replace(/\D/g, '').length;
}

function toApiPhoneDigits(value: string): string {
  return value.replace(/\D/g, '');
}

function toOptionalApiPhone(value: string): string | null {
  const digits = toApiPhoneDigits(value);
  return digits === '' ? null : digits;
}

function parseOptionalNumber(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed === '') return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

function toIsoDate(value: string): string | null {
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
}

function toApiTime(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed === '') return null;
  return trimmed.length === 5 ? `${trimmed}:00` : trimmed;
}

function toFormTime(value: string | null | undefined): string {
  if (!value) return '';
  return value.length >= 5 ? value.slice(0, 5) : value;
}

function toFormNumber(value: number | null | undefined): string {
  return value == null ? '' : String(value);
}

function toFormPhone(value: string | null | undefined): string {
  return value?.replace(/\D/g, '') ?? '';
}

function splitExternalName(value: string): {
  legalFirstName: string | null;
  legalLastName: string | null;
} {
  const trimmed = value.trim();
  if (trimmed === '') {
    return { legalFirstName: null, legalLastName: null };
  }
  const space = trimmed.indexOf(' ');
  if (space === -1) {
    return { legalFirstName: null, legalLastName: trimmed };
  }
  const legalLastName = trimmed.slice(space + 1).trim();
  return {
    legalFirstName: trimmed.slice(0, space),
    legalLastName: legalLastName === '' ? null : legalLastName,
  };
}

function joinExternalName(
  legalFirstName: string | null | undefined,
  legalLastName: string | null | undefined,
  techName: string | null | undefined,
): string {
  const legal = [legalFirstName?.trim(), legalLastName?.trim()]
    .filter((part) => part)
    .join(' ');
  return legal || techName?.trim() || '';
}

function toAddressWrite(values: {
  addressLine1: string;
  addressLine2: string;
  city: string;
  country: string;
  postalCode: string;
  state: string;
}): EmployeeLocationWriteDto {
  return {
    addressLine1: values.addressLine1.trim(),
    addressLine2:
      values.addressLine2.trim() === '' ? null : values.addressLine2.trim(),
    addressLine3: null,
    addressLine4: null,
    city: values.city.trim(),
    state: values.state.trim(),
    county: null,
    country: values.country,
    postalCode: values.postalCode.trim(),
    formattedAddress: null,
    latitude: null,
    longitude: null,
    placeId: null,
  };
}

function toTechnicianWrite(
  values: EmployeeCreateForm,
): EmployeeTechnicianProfileWriteDto | null {
  if (!values.mobileAccess) return null;
  return {
    techCode: values.techCode.trim() === '' ? null : values.techCode.trim(),
    techName:
      values.externalName.trim() === '' ? null : values.externalName.trim(),
    canBeScheduled: true,
    dailyCapacityHours: parseOptionalNumber(values.dailyCapacity),
    dispatchZoneId: parseOptionalNumber(values.dispatchZoneId),
    startLocationTypeId:
      parseOptionalNumber(values.startLocationTypeId) ?? START_LOCATION_OFFICE,
    startTime: toApiTime(values.startTime),
    techTradeId: parseOptionalNumber(values.techTradeId),
    techSkillId: parseOptionalNumber(values.techSkillId),
    truckId: parseOptionalNumber(values.truckId),
    customerFacingPhone: toOptionalApiPhone(values.maskedPhone),
    notes: values.bio.trim() === '' ? null : values.bio.trim(),
  };
}

function isFutureDate(value: string): boolean {
  const trimmed = value.trim();
  if (trimmed === '') return false;
  const parsed = new Date(`${trimmed}T23:59:59`);
  return parsed.getTime() > Date.now();
}

const optionalEmail = z
  .string()
  .trim()
  .refine(
    (value) => value === '' || z.email().safeParse(value).success,
    'Enter a valid email address',
  );

const requiredEmail = z
  .string()
  .trim()
  .min(1, 'Office email is required')
  .pipe(z.email('Enter a valid email address'));

const optionalPhone = z.string().refine((value) => {
  const trimmed = value.trim();
  if (trimmed === '') return true;
  const digits = phoneDigitCount(trimmed);
  return digits >= 10 && digits <= 15;
}, 'Enter a valid phone number');

const requiredPhone = z
  .string()
  .min(1, 'Office phone is required')
  .refine((value) => {
    const digits = phoneDigitCount(value);
    return digits >= 10 && digits <= 15;
  }, 'Enter a valid phone number');

const optionalRate = z.string().refine((value) => {
  const trimmed = value.trim();
  if (trimmed === '') return true;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) && parsed >= 0;
}, 'Enter a valid rate');

export const employeeCreateFormSchema = z
  .object({
    userId: z.string(),
    roleName: z.string(),
    isActive: z.boolean(),
    displayName: z.string().trim().min(1, 'Name is required').max(150),
    externalName: z
      .string()
      .trim()
      .min(1, 'External name is required')
      .max(150),
    birthDate: z.string(),
    personalEmail: optionalEmail,
    personalPhone: optionalPhone,
    officeEmail: requiredEmail,
    officePhone: requiredPhone,
    addressLine1: z.string().trim().min(1, 'Address 1 is required').max(200),
    addressLine2: z.string().trim().max(200),
    postalCode: z.string().trim().min(1, 'Zip code is required').max(20),
    city: z.string().trim().min(1, 'City is required').max(100),
    state: z.string().trim().min(1, 'State is required').max(100),
    country: z.string().min(1, 'Country is required'),
    verifyWithGoogle: z.boolean(),
    hireDate: z.string(),
    laborBurdenTypeId: z.string(),
    laborBurdenValue: optionalRate,
    regularRate: optionalRate,
    isTechnician: z.boolean(),
    techCode: z.string(),
    mobileAccess: z.boolean(),
    maskedPhone: optionalPhone,
    bio: z.string().trim().max(2000),
    dispatchZoneId: z.string(),
    truckId: z.string(),
    techTradeId: z.string(),
    techSkillId: z.string(),
    startTime: z.string(),
    dailyCapacity: optionalRate,
    startLocationTypeId: z.string(),
  })
  .superRefine((values, ctx) => {
    if (isFutureDate(values.birthDate)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Date of birth cannot be in the future',
        path: ['birthDate'],
      });
    }

    if (values.mobileAccess) {
      if (values.maskedPhone.trim() === '') {
        ctx.addIssue({
          code: 'custom',
          message: 'Masked phone is required when mobile access is enabled',
          path: ['maskedPhone'],
        });
      }
      if (values.dispatchZoneId.trim() === '') {
        ctx.addIssue({
          code: 'custom',
          message: 'Zone is required when mobile access is enabled',
          path: ['dispatchZoneId'],
        });
      }
      if (values.techTradeId.trim() === '') {
        ctx.addIssue({
          code: 'custom',
          message: 'Trade is required when mobile access is enabled',
          path: ['techTradeId'],
        });
      }
      if (values.techSkillId.trim() === '') {
        ctx.addIssue({
          code: 'custom',
          message: 'Skills is required when mobile access is enabled',
          path: ['techSkillId'],
        });
      }
      if (values.dailyCapacity.trim() === '') {
        ctx.addIssue({
          code: 'custom',
          message: 'Daily capacity is required when mobile access is enabled',
          path: ['dailyCapacity'],
        });
      }
    }
  });

export type EmployeeCreateForm = z.infer<typeof employeeCreateFormSchema>;

export function emptyEmployeeCreateForm(): EmployeeCreateForm {
  return {
    userId: '',
    roleName: '',
    isActive: true,
    displayName: '',
    externalName: '',
    birthDate: '',
    personalEmail: '',
    personalPhone: '',
    officeEmail: '',
    officePhone: '',
    addressLine1: '',
    addressLine2: '',
    postalCode: '',
    city: '',
    state: '',
    country: '',
    verifyWithGoogle: false,
    hireDate: '',
    laborBurdenTypeId: '',
    laborBurdenValue: '',
    regularRate: '',
    isTechnician: false,
    techCode: '',
    mobileAccess: false,
    maskedPhone: '',
    bio: '',
    dispatchZoneId: '',
    truckId: '',
    techTradeId: '',
    techSkillId: '',
    startTime: '',
    dailyCapacity: '',
    startLocationTypeId: String(START_LOCATION_OFFICE),
  };
}

export function toEmployeeCreateDto(
  values: EmployeeCreateForm,
): EmployeeCreateDto {
  const laborBurdenTypeId = parseOptionalNumber(values.laborBurdenTypeId);
  const laborBurdenValue = parseOptionalNumber(values.laborBurdenValue);
  const regularRate = parseOptionalNumber(values.regularRate);

  const employeeTypeId = values.isTechnician
    ? EMPLOYEE_TYPE_TECHNICIAN
    : EMPLOYEE_TYPE_OFFICE;

  const statusId = values.isActive
    ? EMPLOYEE_STATUS_ACTIVE
    : EMPLOYEE_STATUS_INACTIVE;
  const legalName = splitExternalName(values.externalName);

  return {
    userId: values.userId.trim() === '' ? null : values.userId.trim(),
    employeeTypeId,
    displayName: values.displayName.trim(),
    legalFirstName: legalName.legalFirstName,
    legalMiddleName: null,
    legalLastName: legalName.legalLastName,
    birthDate: toIsoDate(values.birthDate),
    hireDate: toIsoDate(values.hireDate),
    terminationDate: null,
    statusId,
    personalEmail:
      values.personalEmail.trim() === '' ? null : values.personalEmail.trim(),
    officeEmail: values.officeEmail.trim(),
    personalPhone: toOptionalApiPhone(values.personalPhone),
    officePhone: toApiPhoneDigits(values.officePhone),
    address: toAddressWrite(values),
    profilePhotoFileId: null,
    regularRate,
    laborBurdenTypeId,
    laborBurdenValue,
    isPurchaser: false,
    notes: null,
    technicianProfile: toTechnicianWrite(values),
  };
}

const ADDRESS_DIRTY_FIELDS = [
  'addressLine1',
  'addressLine2',
  'postalCode',
  'city',
  'state',
  'country',
] as const satisfies readonly (keyof EmployeeCreateForm)[];

const TECHNICIAN_DIRTY_FIELDS = [
  'mobileAccess',
  'maskedPhone',
  'bio',
  'dispatchZoneId',
  'truckId',
  'techTradeId',
  'techSkillId',
  'startTime',
  'dailyCapacity',
  'startLocationTypeId',
  'externalName',
] as const satisfies readonly (keyof EmployeeCreateForm)[];

function anyDirty(
  dirtyFields: EmployeeCreateFormDirtyFields,
  keys: readonly (keyof EmployeeCreateForm)[],
): boolean {
  return keys.some((key) => dirtyFields[key] === true);
}

export type EmployeeCreateFormDirtyFields = Partial<
  Record<keyof EmployeeCreateForm, boolean>
>;

export function employeeDetailToForm(
  detail: EmployeeDetailDto,
): EmployeeCreateForm {
  const profile = detail.technicianProfile;
  const address = detail.address;
  return {
    userId: detail.userId ?? '',
    roleName: detail.roleName ?? '',
    isActive: detail.statusId === EMPLOYEE_STATUS_ACTIVE,
    displayName: detail.displayName ?? '',
    externalName: joinExternalName(
      detail.legalFirstName,
      detail.legalLastName,
      profile?.techName,
    ),
    birthDate: detail.birthDate ?? '',
    personalEmail: detail.personalEmail ?? '',
    personalPhone: toFormPhone(detail.personalPhone),
    officeEmail: detail.officeEmail ?? '',
    officePhone: toFormPhone(detail.officePhone),
    addressLine1: address?.addressLine1 ?? '',
    addressLine2: address?.addressLine2 ?? '',
    postalCode: address?.postalCode ?? '',
    city: address?.city ?? '',
    state: address?.state ?? '',
    country: address?.country ?? '',
    verifyWithGoogle: false,
    hireDate: detail.hireDate ?? '',
    laborBurdenTypeId: toFormNumber(detail.laborBurdenTypeId),
    laborBurdenValue: toFormNumber(detail.laborBurdenValue),
    regularRate: toFormNumber(detail.regularRate),
    isTechnician: detail.employeeTypeId === EMPLOYEE_TYPE_TECHNICIAN,
    techCode: profile?.techCode ?? '',
    mobileAccess: profile != null,
    maskedPhone: toFormPhone(profile?.customerFacingPhone),
    bio: profile?.notes ?? '',
    dispatchZoneId: toFormNumber(profile?.dispatchZoneId),
    truckId: toFormNumber(profile?.truckId),
    techTradeId: toFormNumber(profile?.techTradeId),
    techSkillId: toFormNumber(profile?.techSkillId),
    startTime: toFormTime(profile?.startTime),
    dailyCapacity: toFormNumber(profile?.dailyCapacityHours),
    startLocationTypeId: String(
      profile?.startLocationTypeId ?? START_LOCATION_OFFICE,
    ),
  };
}

export function toEmployeePatchDto(
  values: EmployeeCreateForm,
  dirtyFields: EmployeeCreateFormDirtyFields,
): EmployeePatchDto {
  const patch: EmployeePatchDto = {};

  if (dirtyFields.userId) {
    patch.userId = values.userId.trim() === '' ? null : values.userId.trim();
  }
  if (dirtyFields.displayName) {
    patch.displayName = values.displayName.trim();
  }
  if (dirtyFields.externalName) {
    const legalName = splitExternalName(values.externalName);
    patch.legalFirstName = legalName.legalFirstName;
    patch.legalLastName = legalName.legalLastName;
  }
  if (dirtyFields.birthDate) patch.birthDate = toIsoDate(values.birthDate);
  if (dirtyFields.personalEmail) {
    patch.personalEmail =
      values.personalEmail.trim() === '' ? null : values.personalEmail.trim();
  }
  if (dirtyFields.personalPhone) {
    patch.personalPhone = toOptionalApiPhone(values.personalPhone);
  }
  if (dirtyFields.officeEmail) patch.officeEmail = values.officeEmail.trim();
  if (dirtyFields.officePhone) {
    patch.officePhone = toApiPhoneDigits(values.officePhone);
  }
  if (dirtyFields.hireDate) patch.hireDate = toIsoDate(values.hireDate);
  if (dirtyFields.laborBurdenTypeId) {
    patch.laborBurdenTypeId = parseOptionalNumber(values.laborBurdenTypeId);
  }
  if (dirtyFields.laborBurdenValue) {
    patch.laborBurdenValue = parseOptionalNumber(values.laborBurdenValue);
  }
  if (dirtyFields.regularRate) {
    patch.regularRate = parseOptionalNumber(values.regularRate);
  }
  if (dirtyFields.isTechnician) {
    patch.employeeTypeId = values.isTechnician
      ? EMPLOYEE_TYPE_TECHNICIAN
      : EMPLOYEE_TYPE_OFFICE;
  }
  if (dirtyFields.isActive) {
    patch.statusId = values.isActive
      ? EMPLOYEE_STATUS_ACTIVE
      : EMPLOYEE_STATUS_INACTIVE;
    patch.isActive = values.isActive;
  }
  if (anyDirty(dirtyFields, ADDRESS_DIRTY_FIELDS)) {
    patch.address = toAddressWrite(values);
  }
  if (dirtyFields.mobileAccess && !values.mobileAccess) {
    patch.technicianProfile = null;
  } else if (
    values.mobileAccess &&
    anyDirty(dirtyFields, TECHNICIAN_DIRTY_FIELDS)
  ) {
    patch.technicianProfile = toTechnicianWrite(values);
  }

  return patch;
}
