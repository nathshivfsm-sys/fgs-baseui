import type { SelectOption } from '@cms/ui';

/**
 * Keeps a value the API returned selectable even when it is not in the static list,
 * so an unrecognised city or tax code shows as itself instead of a blank.
 */
export function withCurrentOption(
  options: readonly SelectOption[],
  value: string,
): readonly SelectOption[] {
  if (!value || options.some((option) => option.value === value)) {
    return options;
  }
  return [...options, { value, label: value }];
}
