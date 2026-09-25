import type { EmployeeSummaryDto } from '@cms/settings-contract';

export const employeeListEmail = (
  employee: Pick<EmployeeSummaryDto, 'officeEmail' | 'personalEmail'>,
): string | null | undefined => employee.officeEmail ?? employee.personalEmail;

export const employeeListPhone = (
  employee: Pick<EmployeeSummaryDto, 'officePhone' | 'personalPhone'>,
): string | null | undefined => employee.personalPhone ?? employee.officePhone;
