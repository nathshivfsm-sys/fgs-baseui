import { z } from 'zod';
import {
  nullableText,
  pagedResultSchema,
  setupResponseSchema,
  type SetupListParams,
} from './envelope.schema';

const nullableNumber = z.number().nullish();

/**
 * Wire shapes of `/employee` from the FGS Setup Service swagger
 * (`FgsEmployee*` DTOs plus `LocationWriteDto` on writes).
 */
export const employeeAddressDetailDtoSchema = z.object({
  id: z.uuid(),
  addressLine1: nullableText,
  addressLine2: nullableText,
  city: nullableText,
  state: nullableText,
  country: nullableText,
  postalCode: nullableText,
});

export const employeeLocationWriteDtoSchema = z.object({
  addressLine1: nullableText,
  addressLine2: nullableText,
  addressLine3: nullableText,
  addressLine4: nullableText,
  city: nullableText,
  state: nullableText,
  county: nullableText,
  country: nullableText,
  postalCode: nullableText,
  formattedAddress: nullableText,
  latitude: nullableNumber,
  longitude: nullableNumber,
  placeId: nullableText,
});

export const employeeTechnicianProfileDetailDtoSchema = z.object({
  id: z.number(),
  techCode: nullableText,
  techName: nullableText,
  canBeScheduled: z.boolean(),
  dailyCapacityHours: z.number(),
  dispatchZoneId: nullableNumber,
  startLocationTypeId: z.number(),
  startTime: nullableText,
  techTradeId: nullableNumber,
  techSkillId: nullableNumber,
  truckId: nullableNumber,
  customerFacingPhone: nullableText,
  notes: nullableText,
});

export const employeeTechnicianProfileWriteDtoSchema = z.object({
  techCode: nullableText,
  techName: nullableText,
  canBeScheduled: z.boolean(),
  dailyCapacityHours: nullableNumber,
  dispatchZoneId: nullableNumber,
  startLocationTypeId: z.number(),
  startTime: nullableText,
  techTradeId: nullableNumber,
  techSkillId: nullableNumber,
  truckId: nullableNumber,
  customerFacingPhone: nullableText,
  notes: nullableText,
});

const employeeIdentityFields = {
  id: z.number(),
  userId: z.uuid().nullish(),
  employeeNumber: nullableText,
  employeeTypeId: z.number(),
  displayName: nullableText,
  legalFirstName: nullableText,
  legalMiddleName: nullableText,
  legalLastName: nullableText,
  birthDate: nullableText,
  hireDate: nullableText,
  terminationDate: nullableText,
  statusId: z.number(),
  personalEmail: nullableText,
  officeEmail: nullableText,
  personalPhone: nullableText,
  officePhone: nullableText,
  profilePhotoFileId: nullableNumber,
  regularRate: nullableNumber,
  overtimeRate: nullableNumber,
  doubleTimeRate: nullableNumber,
  laborBurdenTypeId: nullableNumber,
  laborBurdenValue: nullableNumber,
  isPurchaser: z.boolean(),
  notes: nullableText,
  roleId: nullableNumber,
  roleName: nullableText,
  lastLoginOn: nullableText,
};

export const employeeSummaryDtoSchema = z.object({
  ...employeeIdentityFields,
  hasTechnicianProfile: z.boolean(),
});

export const employeeDetailDtoSchema = z.object({
  ...employeeIdentityFields,
  address: employeeAddressDetailDtoSchema.nullish(),
  technicianProfile: employeeTechnicianProfileDetailDtoSchema.nullish(),
});

export const employeeLookupDtoSchema = z.object({
  id: z.number(),
  employeeNumber: nullableText,
  displayName: nullableText,
});

export const employeeListSummaryDtoSchema = z.object({
  totalEmployees: z.number(),
  activeEmployees: z.number(),
  inactiveEmployees: z.number(),
});

const employeeCreateFields = {
  userId: z.uuid().nullish(),
  employeeNumber: nullableText,
  employeeTypeId: z.number(),
  displayName: nullableText,
  legalFirstName: nullableText,
  legalMiddleName: nullableText,
  legalLastName: nullableText,
  birthDate: nullableText,
  hireDate: nullableText,
  terminationDate: nullableText,
  statusId: z.number(),
  personalEmail: nullableText,
  officeEmail: nullableText,
  personalPhone: nullableText,
  officePhone: nullableText,
  address: employeeLocationWriteDtoSchema.nullish(),
  profilePhotoFileId: nullableNumber,
  regularRate: nullableNumber,
  laborBurdenTypeId: nullableNumber,
  laborBurdenValue: nullableNumber,
  isPurchaser: z.boolean(),
  notes: nullableText,
  technicianProfile: employeeTechnicianProfileWriteDtoSchema.nullish(),
};

export const employeeCreateDtoSchema = z.object(employeeCreateFields);

export const employeeUpdateDtoSchema = z.object({
  ...employeeCreateFields,
  overtimeRate: nullableNumber,
  doubleTimeRate: nullableNumber,
});

export const employeePatchDtoSchema = z.object({
  userId: z.uuid().nullish(),
  employeeNumber: nullableText,
  employeeTypeId: nullableNumber,
  displayName: nullableText,
  legalFirstName: nullableText,
  legalMiddleName: nullableText,
  legalLastName: nullableText,
  birthDate: nullableText,
  hireDate: nullableText,
  terminationDate: nullableText,
  statusId: nullableNumber,
  personalEmail: nullableText,
  officeEmail: nullableText,
  personalPhone: nullableText,
  officePhone: nullableText,
  address: employeeLocationWriteDtoSchema.nullish(),
  profilePhotoFileId: nullableNumber,
  regularRate: nullableNumber,
  overtimeRate: nullableNumber,
  doubleTimeRate: nullableNumber,
  laborBurdenTypeId: nullableNumber,
  laborBurdenValue: nullableNumber,
  isPurchaser: z.boolean().nullish(),
  notes: nullableText,
  isActive: z.boolean().nullish(),
  technicianProfile: employeeTechnicianProfileWriteDtoSchema.nullish(),
});

export const employeeListResultDtoSchema = pagedResultSchema(
  employeeSummaryDtoSchema,
).extend({
  summary: employeeListSummaryDtoSchema.nullish(),
});

export const employeeListResponseSchema = setupResponseSchema(
  employeeListResultDtoSchema,
);
export const employeeDetailResponseSchema = setupResponseSchema(
  employeeDetailDtoSchema,
);
export const employeeLookupResponseSchema = setupResponseSchema(
  z.array(employeeLookupDtoSchema),
);

export type EmployeeAddressDetailDto = z.infer<
  typeof employeeAddressDetailDtoSchema
>;
export type EmployeeLocationWriteDto = z.infer<
  typeof employeeLocationWriteDtoSchema
>;
export type EmployeeTechnicianProfileDetailDto = z.infer<
  typeof employeeTechnicianProfileDetailDtoSchema
>;
export type EmployeeTechnicianProfileWriteDto = z.infer<
  typeof employeeTechnicianProfileWriteDtoSchema
>;
export type EmployeeSummaryDto = z.infer<typeof employeeSummaryDtoSchema>;
export type EmployeeDetailDto = z.infer<typeof employeeDetailDtoSchema>;
export type EmployeeLookupDto = z.infer<typeof employeeLookupDtoSchema>;
export type EmployeeListSummaryDto = z.infer<
  typeof employeeListSummaryDtoSchema
>;
export type EmployeeCreateDto = z.infer<typeof employeeCreateDtoSchema>;
export type EmployeeUpdateDto = z.infer<typeof employeeUpdateDtoSchema>;
export type EmployeePatchDto = z.infer<typeof employeePatchDtoSchema>;

export type EmployeeListParams = SetupListParams & {
  employeeNumber?: string;
  employeeTypeId?: number;
  statusId?: number;
  techTradeIds?: number[];
  techSkillIds?: number[];
  dispatchZoneIds?: number[];
  roleIds?: number[];
  includeSummary?: boolean;
};

export type EmployeeListResult = {
  items: EmployeeSummaryDto[];
  page: number;
  pageSize: number;
  totalCount: number;
  summary?: EmployeeListSummaryDto | null;
};
