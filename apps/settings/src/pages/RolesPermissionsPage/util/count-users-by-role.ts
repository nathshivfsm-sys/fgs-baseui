type RoleAssignment = {
  roleId?: number | null;
};

export const countUsersByRole = (
  users: readonly RoleAssignment[],
): Map<number, number> => {
  const counts = new Map<number, number>();
  for (const user of users) {
    const roleId = user.roleId;
    if (roleId == null) continue;
    counts.set(roleId, (counts.get(roleId) ?? 0) + 1);
  }
  return counts;
};
