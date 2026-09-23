import type { LocalePreferences } from './locale-preferences.types';
import { getLocalePreferences } from './locale-store';

const digitsOnly = (value: string): string => value.replace(/\D/g, '');

const formatUsNational = (digits: string): string => {
  const normalized =
    digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits;
  if (normalized.length !== 10) return digits;
  return `(${normalized.slice(0, 3)}) ${normalized.slice(3, 6)}-${normalized.slice(6)}`;
};

const formatCaNational = (digits: string): string => {
  const normalized =
    digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits;
  if (normalized.length !== 10) return digits;
  return `${normalized.slice(0, 3)}-${normalized.slice(3, 6)}-${normalized.slice(6)}`;
};

export const formatLocaleMobile = (
  value: string | null | undefined,
  preferences: LocalePreferences = getLocalePreferences(),
): string => {
  const trimmed = (value ?? '').trim();
  if (!trimmed) return '';

  const digits = digitsOnly(trimmed);
  if (!digits) return trimmed;

  const region = preferences.mobileFormat.region.toUpperCase();
  if (region === 'CA') {
    return formatCaNational(digits);
  }
  if (region === 'US') {
    return formatUsNational(digits);
  }

  return trimmed;
};
