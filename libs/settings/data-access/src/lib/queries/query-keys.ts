export const companySettingsKeys = {
  all: ['company-settings'] as const,
  detail: (companyId: string) =>
    [...companySettingsKeys.all, companyId] as const,
} as const;

/** Guide name — same factory as `companySettingsKeys`. */
export const SETTINGS_QUERY_KEYS = companySettingsKeys;
