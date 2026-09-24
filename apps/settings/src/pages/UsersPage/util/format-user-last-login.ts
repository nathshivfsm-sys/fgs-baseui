import { formatLocaleDateTime } from '@cms/shared-locale';

export const formatUserLastLogin = (
  lastLoginOn: string | null | undefined,
): string => {
  if (!lastLoginOn) return '—';
  const formatted = formatLocaleDateTime(lastLoginOn);
  return formatted || '—';
};
