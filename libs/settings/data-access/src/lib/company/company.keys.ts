export const companyKeys = {
  all: ['company'] as const,
  details: () => [...companyKeys.all, 'detail'] as const,
  detail: (companyId: string) =>
    [...companyKeys.details(), companyId] as const,
} as const;
