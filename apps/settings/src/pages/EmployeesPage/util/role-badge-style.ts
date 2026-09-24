const ROLE_BADGE_STYLES = {
  admin: 'bg-[#eff6ff] text-[#1d4ed8]',
  manager: 'bg-[#f5f3ff] text-[#6d28d9]',
  employee: 'bg-[#f0fdf4] text-[#15803d]',
  technician: 'bg-[#fff7ed] text-[#c2410c]',
  dispatcher: 'bg-[#fef9c3] text-[#a16207]',
  neutral: 'bg-secondary text-secondary-foreground',
} as const;

type RoleBadgeKey = keyof typeof ROLE_BADGE_STYLES;

const resolveRoleBadgeKey = (
  roleName: string | null | undefined,
): RoleBadgeKey => {
  const normalized = (roleName ?? '').toLowerCase();
  if (normalized.includes('admin')) return 'admin';
  if (normalized.includes('manager')) return 'manager';
  if (normalized.includes('employee')) return 'employee';
  if (normalized.includes('technician') || normalized.includes('tech')) {
    return 'technician';
  }
  if (normalized.includes('dispatcher') || normalized.includes('schedul')) {
    return 'dispatcher';
  }
  return 'neutral';
};

export const formatRoleLabel = (roleName: string | null | undefined): string => {
  const trimmed = (roleName ?? '').trim();
  if (!trimmed) return '—';
  if (/administrator/i.test(trimmed)) return 'Admin';
  return trimmed;
};

export const roleBadgeClassName = (
  roleName: string | null | undefined,
): string => ROLE_BADGE_STYLES[resolveRoleBadgeKey(roleName)];

export const isAdminRole = (
  role: { name?: string | null; roleCode?: string | null },
): boolean =>
  /admin/i.test(role.name ?? '') || /admin/i.test(role.roleCode ?? '');
