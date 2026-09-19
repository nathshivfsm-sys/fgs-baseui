import type { SelectOption } from '@cms/ui';

/**
 * Keeps a value the API returned selectable even when it is not in the static list,
 * so an unrecognised city or tax code shows as itself instead of a blank.
 */
export const withCurrentOption = (
  options: readonly SelectOption[],
  value: string,
): readonly SelectOption[] => {
  if (!value || options.some((option) => option.value === value)) {
    return options;
  }
  return [...options, { value, label: value }];
};

export const withCurrentOptions = (
  options: readonly SelectOption[],
  values: readonly string[],
): readonly SelectOption[] => {
  const missing = values.filter(
    (value) => value && !options.some((option) => option.value === value),
  );
  if (missing.length === 0) {
    return options;
  }
  return [
    ...options,
    ...missing.map((value) => ({ value, label: value })),
  ];
};
