import type { LocalePreferences } from './locale-preferences.types';

export const mergeLocalePreferences = (
  current: LocalePreferences,
  patch: Partial<LocalePreferences>,
): LocalePreferences => ({
  ...current,
  ...patch,
  dateFormat: patch.dateFormat
    ? { ...current.dateFormat, ...patch.dateFormat }
    : current.dateFormat,
  mobileFormat: patch.mobileFormat
    ? { ...current.mobileFormat, ...patch.mobileFormat }
    : current.mobileFormat,
});
