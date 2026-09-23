import type { SelectOption } from '@cms/ui';

export function withCurrentOption(
  options: readonly SelectOption[],
  value: string,
): readonly SelectOption[] {
  if (!value || options.some((option) => option.value === value)) {
    return options;
  }
  return [...options, { value, label: value }];
}
