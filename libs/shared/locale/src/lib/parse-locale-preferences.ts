import type {
  LocaleDateFormat,
  LocalePreferences,
} from './locale-preferences.types';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isLocaleDateFormat = (value: unknown): value is LocaleDateFormat => {
  if (!isRecord(value)) return false;
  return Object.keys(value).every((key) => typeof value[key] !== 'undefined');
};

export const parseLocalePreferences = (
  input: unknown,
): LocalePreferences | null => {
  if (!isRecord(input)) return null;

  const timeZone = input.timeZone;
  const locale = input.locale;
  const dateFormat = input.dateFormat;
  const currencyCode = input.currencyCode;
  const mobileFormat = input.mobileFormat;

  if (typeof timeZone !== 'string' || !timeZone.trim()) return null;
  if (typeof locale !== 'string' || !locale.trim()) return null;
  if (!isLocaleDateFormat(dateFormat)) return null;
  if (typeof currencyCode !== 'string' || currencyCode.length !== 3) {
    return null;
  }
  if (!isRecord(mobileFormat) || typeof mobileFormat.region !== 'string') {
    return null;
  }
  if (!mobileFormat.region.trim()) return null;

  return {
    timeZone: timeZone.trim(),
    locale: locale.trim(),
    dateFormat,
    currencyCode: currencyCode.toUpperCase(),
    mobileFormat: { region: mobileFormat.region.trim() },
  };
};
