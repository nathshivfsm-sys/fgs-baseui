import type { EmployeeSummaryDto } from '@cms/settings-contract';

export const countEmployeesByRole = (
  employees: readonly EmployeeSummaryDto[],
): Map<number, number> => {
  const counts = new Map<number, number>();
  for (const employee of employees) {
    const roleId = employee.roleId;
    if (roleId == null) continue;
    counts.set(roleId, (counts.get(roleId) ?? 0) + 1);
  }
  return counts;
};
