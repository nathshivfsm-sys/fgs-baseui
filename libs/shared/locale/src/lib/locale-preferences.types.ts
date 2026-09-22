/** Serializable subset of `Intl.DateTimeFormatOptions` for API-driven date display. */
export type LocaleDateFormat = Pick<
  Intl.DateTimeFormatOptions,
  | 'year'
  | 'month'
  | 'day'
  | 'weekday'
  | 'hour'
  | 'minute'
  | 'second'
  | 'hour12'
  | 'timeZoneName'
>;

/** Phone display rules; extend when the API returns richer masks. */
export interface LocaleMobileFormat {
  /** CLDR region, e.g. `US`, `CA`. */
  region: string;
}

/**
 * Tenant/company locale preferences. Designed to match a future API payload — update via
 * `hydrateLocalePreferences` or `localeStore.getState().replacePreferences`.
 */
export interface LocalePreferences {
  timeZone: string;
  /** BCP 47 tag used by Intl formatters, e.g. `en-US`. */
  locale: string;
  dateFormat: LocaleDateFormat;
  /** ISO 4217 code, e.g. `USD`. */
  currencyCode: string;
  mobileFormat: LocaleMobileFormat;
}

export interface LocaleStoreState {
  preferences: LocalePreferences;
  setPreferences: (patch: Partial<LocalePreferences>) => void;
  replacePreferences: (preferences: LocalePreferences) => void;
  resetPreferences: () => void;
}
