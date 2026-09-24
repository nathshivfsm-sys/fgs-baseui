import { formatLocaleDateTime } from '@cms/shared-locale';
import { NEVER_LOGGED_IN } from '../constant';

export const formatEmployeeLastLogin = (
  lastLoginOn: string | null | undefined,
): string => {
  if (!lastLoginOn) return NEVER_LOGGED_IN;
  const formatted = formatLocaleDateTime(lastLoginOn);
  return formatted || NEVER_LOGGED_IN;
};
