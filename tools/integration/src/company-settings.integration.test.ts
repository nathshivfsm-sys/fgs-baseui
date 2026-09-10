import { describe, expect, it } from 'vitest';
import { createCmsQueryClient, disposeCmsQueryClient } from '@cms/platform-contract';
import {
  companySettingsKeys,
  companySettingsQueryOptions,
  companySettingsSchema,
  resetCompanySettingsStore,
  saveCompanySettings,
  seedCompanySettings,
} from '@cms/settings-data-access';

const validSettings = {
  companyId: 'northwind',
  companyName: 'Test Inc',
  contactEmail: 'test@example.com',
  ptos: [{ code: 'VAC', label: 'Vacation', annualAllowance: 20 }],
  taxCodes: [],
  businessUnits: [],
};

describe('companySettingsSchema', () => {
  it('accepts a complete payload', () => {
    expect(() => companySettingsSchema.parse(validSettings)).not.toThrow();
  });

  it('rejects an invalid email', () => {
    expect(() =>
      companySettingsSchema.parse({
        ...validSettings,
        contactEmail: 'not-an-email',
      }),
    ).toThrow();
  });
});

describe('company settings query cache', () => {
  it('loads seeded settings and writes an update into the cache', async () => {
    resetCompanySettingsStore();
    const client = createCmsQueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const seeded = seedCompanySettings(
      'northwind',
      companySettingsSchema.parse(validSettings),
    );

    const loaded = await client.fetchQuery(
      companySettingsQueryOptions('northwind'),
    );
    expect(loaded.companyName).toBe(seeded.companyName);

    const saved = await saveCompanySettings('northwind', {
      ...loaded,
      companyName: 'Updated Inc',
    });
    client.setQueryData(companySettingsKeys.detail('northwind'), saved);

    expect(client.getQueryData(companySettingsKeys.detail('northwind'))).toEqual(
      saved,
    );

    disposeCmsQueryClient(client);
    resetCompanySettingsStore();
  });
});
