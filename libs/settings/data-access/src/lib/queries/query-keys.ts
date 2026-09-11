export const companySettingsKeys = {
  all: ['company-settings'] as const,
  detail: (companyId: string) =>
    [...companySettingsKeys.all, companyId] as const,
} as const;
