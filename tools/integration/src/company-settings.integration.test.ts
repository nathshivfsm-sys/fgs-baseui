import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createCmsQueryClient,
  disposeCmsQueryClient,
} from '@cms/platform-contract';
import {
  companyResponseSchema,
  companySettingsKeys,
  companySettingsQueryOptions,
  formatPhoneNumber,
  normalizePhoneNumber,
  saveCompanySettings,
  toCompanyPatch,
  toCompanyProfile,
  type CompanyGeneralInfo,
} from '@cms/settings-data-access';
import { ApiError, configureCustomFetch } from '@cms/shared-api';
import { companyResponseFixture } from './fixtures/company-response';

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
  configureCustomFetch({
    baseUrl: '/api/v1',
    getAuthToken: () => 'test-token',
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  configureCustomFetch({ baseUrl: '' });
});

describe('company response mapping', () => {
  it('parses the captured API response and maps it to the screen model', () => {
    const dto = companyResponseSchema.parse(companyResponseFixture).data;
    const profile = toCompanyProfile(dto);

    expect(profile.companyNumber).toBe('1');
    expect(profile.code).toBe('acme-field-services-ae23b1');
    expect(profile.generalInfo).toEqual({
      name: 'Acme Field Services',
      legalName: 'Acme Field Services',
      companySize: '11-50',
      taxId: '',
      email: 'owner@acme.example.com',
      phoneNumber: '+1 (555) 123-4567',
      website: 'https://acme.example.com',
      timeZone: 'America/Chicago',
      isActive: true,
    });
    expect(profile.physicalAddress).toEqual({
      lines: ['100 Main St'],
      city: 'Austin',
      state: 'TX',
      postalCode: '78701',
      country: 'US',
    });
  });

  it('tolerates a missing address and nullable text', () => {
    const dto = companyResponseSchema.parse({
      ...companyResponseFixture,
      data: {
        ...companyResponseFixture.data,
        website: null,
        billingAddress: null,
      },
    }).data;
    const profile = toCompanyProfile(dto);

    expect(profile.generalInfo.website).toBe('');
    expect(profile.billingAddress).toBeNull();
  });
});

describe('phone formatting', () => {
  it('round-trips the API format', () => {
    expect(formatPhoneNumber('15551234567')).toBe('+1 (555) 123-4567');
    expect(normalizePhoneNumber('+1 (555) 123-4567')).toBe('15551234567');
  });

  it('adds the country code to a bare 10-digit number', () => {
    expect(normalizePhoneNumber('(832) 555-0198')).toBe('18325550198');
  });

  it('leaves non-North-American numbers as returned', () => {
    expect(formatPhoneNumber('447911123456')).toBe('447911123456');
  });
});

describe('toCompanyPatch', () => {
  const values: CompanyGeneralInfo = {
    name: 'Acme Field Services',
    legalName: 'Acme Field Services LLC',
    companySize: '11-50',
    taxId: '',
    email: 'owner@acme.example.com',
    phoneNumber: '+1 (555) 123-4567',
    website: '',
    timeZone: 'America/Chicago',
    isActive: true,
  };

  it('sends only dirty fields', () => {
    expect(toCompanyPatch(values, { legalName: true })).toEqual({
      legalName: 'Acme Field Services LLC',
    });
  });

  it('sends a cleared optional field as null and normalises the phone', () => {
    expect(
      toCompanyPatch(values, { website: true, taxId: true, phoneNumber: true }),
    ).toEqual({ website: null, taxId: null, phoneNumber: '15551234567' });
  });

  it('sends nothing when nothing is dirty', () => {
    expect(toCompanyPatch(values, {})).toEqual({});
  });
});

describe('company settings through customFetch', () => {
  it('GETs the company by id, forwarding the bearer token and abort signal', async () => {
    fetchMock.mockResolvedValue(jsonResponse(companyResponseFixture));
    const client = createCmsQueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const profile = await client.fetchQuery(companySettingsQueryOptions('1'));

    expect(profile.generalInfo.name).toBe('Acme Field Services');
    expect(client.getQueryData(companySettingsKeys.detail('1'))).toBe(profile);
    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(url).toBe('/api/v1/company/1');
    expect(init?.signal).toBeInstanceOf(AbortSignal);
    expect(init?.headers).toMatchObject({ Authorization: 'Bearer test-token' });
    disposeCmsQueryClient(client);
  });

  it('lets ApiError propagate out of the query function', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ message: 'Forbidden' }, 403));
    const client = createCmsQueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const failure = client.fetchQuery(companySettingsQueryOptions('1'));

    await expect(failure).rejects.toBeInstanceOf(ApiError);
    await expect(failure).rejects.toMatchObject({ status: 403 });
    disposeCmsQueryClient(client);
  });

  it('PATCHes only the given fields as JSON', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ success: true, statusCode: 200 }),
    );

    await saveCompanySettings('1', { website: 'www.acme.example.com' });

    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(url).toBe('/api/v1/company/1');
    expect(init?.method).toBe('PATCH');
    expect(JSON.parse(String(init?.body))).toEqual({
      website: 'www.acme.example.com',
    });
  });
});
