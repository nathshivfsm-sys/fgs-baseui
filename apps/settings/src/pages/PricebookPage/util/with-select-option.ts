import type { SelectOption } from '@cms/ui';

export const withCurrentOption = (
  options: readonly SelectOption[],
  value: string,
): SelectOption[] => {
  if (value === '') return [...options];
  if (options.some((option) => option.value === value)) return [...options];
  return [{ label: value, value }, ...options];
};
