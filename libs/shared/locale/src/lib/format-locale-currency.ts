import type { LocalePreferences } from './locale-preferences.types';
import { getLocalePreferences } from './locale-store';

export const formatLocaleCurrency = (
  amount: number | null | undefined,
  preferences: LocalePreferences = getLocalePreferences(),
): string => {
  if (amount == null || Number.isNaN(amount)) return '';

  return new Intl.NumberFormat(preferences.locale, {
    style: 'currency',
    currency: preferences.currencyCode,
  }).format(amount);
};
