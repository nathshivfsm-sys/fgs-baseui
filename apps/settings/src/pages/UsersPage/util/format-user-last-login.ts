import { formatLocaleDateTime } from '@cms/shared-locale';
import { NEVER_LOGGED_IN_LABEL } from '../constant';

export const formatUserLastLogin = (
  lastLoginOn: string | null | undefined,
): string => {
  if (!lastLoginOn) return NEVER_LOGGED_IN_LABEL;
  const formatted = formatLocaleDateTime(lastLoginOn);
  return formatted || NEVER_LOGGED_IN_LABEL;
};
