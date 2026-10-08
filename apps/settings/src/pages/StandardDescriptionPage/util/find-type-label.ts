import type { GloSetupDescriptionTypeLookupDto } from '@cms/shared-contract';
import { DESCRIPTION_TYPE_NAV } from '../constant';

export const findDescriptionTypeLabel = (
  code: string | null | undefined,
  typeOptions: readonly GloSetupDescriptionTypeLookupDto[] | undefined,
): string => {
  if (!code) return '—';
  const fromLookup = typeOptions?.find(
    (option) => option.code?.toLowerCase() === code.toLowerCase(),
  );
  if (fromLookup?.name) return fromLookup.name;
  const fromNav = DESCRIPTION_TYPE_NAV.find(
    (item) => item.code.toLowerCase() === code.toLowerCase(),
  );
  return fromNav?.title ?? code;
};
