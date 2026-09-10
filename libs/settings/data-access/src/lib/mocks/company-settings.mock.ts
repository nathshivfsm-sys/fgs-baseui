import {
  companySettingsSchema,
  type CompanySettings,
} from '../schemas/company-settings.schema';

const store = new Map<string, CompanySettings>();

export function resetCompanySettingsStore(): void {
  store.clear();
}

export function seedCompanySettings(
  companyId: string,
  settings: CompanySettings,
): CompanySettings {
  const parsed = companySettingsSchema.parse({ ...settings, companyId });
  store.set(companyId, parsed);
  return parsed;
}

export function defaultCompanySettings(companyId: string): CompanySettings {
  return companySettingsSchema.parse({
    companyId,
    companyName: 'Graceful Cleaning',
    contactEmail: 'office@gracefulcleaning.example',
    phone: '(555) 010-0142',
    address: '1840 Market Street, Suite 200',
    ptos: [
      {
        id: 'pto-vac',
        code: 'VAC',
        label: 'Vacation',
        annualAllowance: 15,
      },
      {
        id: 'pto-sick',
        code: 'SICK',
        label: 'Sick Leave',
        annualAllowance: 8,
      },
    ],
    taxCodes: [
      {
        id: 'tax-gst',
        code: 'GST',
        description: 'Goods and Services Tax',
        rate: 5,
      },
    ],
    businessUnits: [
      {
        id: 'bu-res',
        name: 'Residential',
        code: 'RES',
        active: true,
      },
      {
        id: 'bu-com',
        name: 'Commercial',
        code: 'COM',
        active: true,
      },
    ],
  });
}

export function readCompanySettingsStore(
  companyId: string,
): CompanySettings | undefined {
  return store.get(companyId);
}

export function writeCompanySettingsStore(
  companyId: string,
  settings: CompanySettings,
): CompanySettings {
  const parsed = companySettingsSchema.parse({ ...settings, companyId });
  store.set(companyId, parsed);
  return parsed;
}
