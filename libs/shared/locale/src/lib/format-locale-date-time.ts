import type { LocalePreferences } from './locale-preferences.types';
import { getLocalePreferences } from './locale-store';

export const formatLocaleDateTime = (
  value: string | number | Date | null | undefined,
  preferences: LocalePreferences = getLocalePreferences(),
): string => {
  if (value == null || value === '') return '';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat(preferences.locale, {
    ...preferences.dateFormat,
    timeZone: preferences.timeZone,
  }).format(date);
};
