import { z } from 'zod';
import type { EmployeeCreateDto } from '@cms/settings-contract';

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
  const dailyCapacity = parseOptionalNumber(values.dailyCapacity);
  const startLocationTypeId =
    parseOptionalNumber(values.startLocationTypeId) ?? START_LOCATION_OFFICE;

  const employeeTypeId = values.isTechnician
    ? EMPLOYEE_TYPE_TECHNICIAN
    : EMPLOYEE_TYPE_OFFICE;

  const statusId = values.isActive
    ? EMPLOYEE_STATUS_ACTIVE
    : EMPLOYEE_STATUS_INACTIVE;

  const technicianProfile = values.mobileAccess
    ? {
        techCode: null,
        techName: values.externalName.trim(),
        canBeScheduled: true,
        dailyCapacityHours: dailyCapacity,
        dispatchZoneId: parseOptionalNumber(values.dispatchZoneId),
        startLocationTypeId,
        startTime: toApiTime(values.startTime),
        techTradeId: parseOptionalNumber(values.techTradeId),
        techSkillId: parseOptionalNumber(values.techSkillId),
        truckId: parseOptionalNumber(values.truckId),
        customerFacingPhone: toOptionalApiPhone(values.maskedPhone),
        notes: values.bio.trim() === '' ? null : values.bio.trim(),
      }
    : null;

  return {
    userId: values.userId.trim() === '' ? null : values.userId.trim(),
    employeeTypeId,
    displayName: values.displayName.trim(),
    legalFirstName: null,
    legalMiddleName: null,
    legalLastName: null,
    birthDate: toIsoDate(values.birthDate),
    hireDate: toIsoDate(values.hireDate),
    terminationDate: null,
    statusId,
    personalEmail:
      values.personalEmail.trim() === '' ? null : values.personalEmail.trim(),
    officeEmail: values.officeEmail.trim(),
    personalPhone: toOptionalApiPhone(values.personalPhone),
    officePhone: toApiPhoneDigits(values.officePhone),
    address: {
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
    },
    profilePhotoFileId: null,
    regularRate,
    laborBurdenTypeId,
    laborBurdenValue,
    isPurchaser: false,
    notes: null,
    technicianProfile,
  };
}
