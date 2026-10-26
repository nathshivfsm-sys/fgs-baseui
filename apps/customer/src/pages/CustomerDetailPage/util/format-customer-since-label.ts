import { formatLocaleDateTime } from '@cms/shared-locale';

export const formatCustomerSinceDate = (
  createdOn: string | null | undefined,
): string => formatLocaleDateTime(createdOn);
