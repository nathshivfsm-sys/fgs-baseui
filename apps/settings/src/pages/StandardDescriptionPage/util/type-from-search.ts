import { DESCRIPTION_TYPE_NAV } from '../constant';

const DEFAULT_TYPE = DESCRIPTION_TYPE_NAV[0]?.code ?? 'REASON_FOR_CALL';

export const descriptionTypeFromSearch = (value: string | null): string => {
  if (!value) return DEFAULT_TYPE;
  const match = DESCRIPTION_TYPE_NAV.find(
    (item) => item.code.toLowerCase() === value.toLowerCase(),
  );
  return match?.code ?? DEFAULT_TYPE;
};
