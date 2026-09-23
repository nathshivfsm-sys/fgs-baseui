import { localeStore } from './locale-store';
import { parseLocalePreferences } from './parse-locale-preferences';

/**
 * Replace store values from an API payload. Returns `false` when validation fails so
 * callers can fall back or surface an error without throwing.
 */
export const hydrateLocalePreferences = (input: unknown): boolean => {
  const parsed = parseLocalePreferences(input);
  if (!parsed) {
    return false;
  }
  localeStore.getState().replacePreferences(parsed);
  return true;
};
