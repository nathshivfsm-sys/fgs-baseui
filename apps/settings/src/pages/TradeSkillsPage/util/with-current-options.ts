import type { SelectOption } from '@cms/ui';

/**
 * Keeps values the API returned selectable even when they are missing from the
 * active lookup, so an inactive associated skill still shows in the trigger.
 */
export const withCurrentOptions = (
  options: readonly SelectOption[],
  values: readonly string[],
): readonly SelectOption[] => {
  const missing = values.filter(
    (value) =>
      value !== '' && !options.some((option) => option.value === value),
  );
  if (missing.length === 0) {
    return options;
  }
  return [
    ...options,
    ...missing.map((value) => ({ label: value, value })),
  ];
};
