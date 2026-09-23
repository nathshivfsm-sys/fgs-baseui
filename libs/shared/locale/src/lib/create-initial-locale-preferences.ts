import type { LocalePreferences } from './locale-preferences.types';

/**
 * Bootstrap values until an API hydrates the store. Uses the browser environment when
 * available; safe to call in SSR/tests (falls back to `en-US` / `UTC`).
 */
export const createInitialLocalePreferences = (): LocalePreferences => {
  const locale =
    typeof navigator !== 'undefined' && navigator.language
      ? navigator.language
      : 'en-US';

  let timeZone = 'UTC';
  if (typeof Intl !== 'undefined') {
    try {
      timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || timeZone;
    } catch {
      // Keep UTC when the runtime cannot resolve a zone.
    }
  }

  return {
    locale,
    timeZone,
    dateFormat: {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    },
    currencyCode: 'USD',
    mobileFormat: {
      region: locale.endsWith('-CA') ? 'CA' : 'US',
    },
  };
};
