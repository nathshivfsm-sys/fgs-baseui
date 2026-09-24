import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createCmsQueryClient,
  disposeCmsQueryClient,
} from '@cms/platform-contract';
import {
  businessTypeKeys,
  businessTypeListQueryOptions,
  businessTypeLookupQueryOptions,
  createBusinessTypeMutationOptions,
  createGlBreakMutationOptions,
  createPostalCodeMutationOptions,
  createNonWorkingDateMutationOptions,
  createTaxMutationOptions,
  createTechSkillLevelMutationOptions,
  createTechTradeMutationOptions,
  createZoneMutationOptions,
  deleteNonWorkingDateMutationOptions,
  glBreakDetailQueryOptions,
  glBreakKeys,
  glBreakListQueryOptions,
  glBreakLookupQueryOptions,
  deleteTechTradeMutationOptions,
  deleteTechSkillLevelMutationOptions,
  nonWorkingDateDetailQueryOptions,
  nonWorkingDateKeys,
  nonWorkingDateListQueryOptions,
  nonWorkingDateLookupQueryOptions,
  patchTaxAuthorityMutationOptions,
  postalCodeKeys,
  postalCodeListQueryOptions,
  postalCodeLookupQueryOptions,
  taxAuthorityKeys,
  taxAuthorityListQueryOptions,
  techSkillLevelKeys,
  techSkillLevelListQueryOptions,
  techSkillLevelLookupQueryOptions,
  taxDetailQueryOptions,
  taxKeys,
  taxListQueryOptions,
  taxLookupQueryOptions,
  techTradeKeys,
  techTradeListQueryOptions,
  techTradeLookupQueryOptions,
  zoneKeys,
  zoneListQueryOptions,
  zoneLookupQueryOptions,
} from '@cms/settings-data-access';
import { ApiError, configureCustomFetch } from '@cms/shared-api';
import {
  businessTypeDetailResponseFixture,
  businessTypeListResponseFixture,
  businessTypeLookupResponseFixture,
  glBreakDetailResponseFixture,
  glBreakListResponseFixture,
  glBreakLookupResponseFixture,
  postalCodeDetailResponseFixture,
  postalCodeListResponseFixture,
  postalCodeLookupResponseFixture,
  nonWorkingDateDetailResponseFixture,
  nonWorkingDateListResponseFixture,
  nonWorkingDateLookupResponseFixture,
  taxAuthorityDetailResponseFixture,
  taxAuthorityListResponseFixture,
  taxDetailResponseFixture,
  taxListResponseFixture,
  taxLookupResponseFixture,
  techSkillLevelDetailResponseFixture,
  techSkillLevelListResponseFixture,
  techSkillLevelLookupResponseFixture,
  techTradeDetailResponseFixture,
  techTradeListResponseFixture,
  techTradeLookupResponseFixture,
  zoneDetailResponseFixture,
  zoneListResponseFixture,
  zoneLookupResponseFixture,
  userDetailResponseFixture,
  userListResponseFixture,
  userRoleDetailResponseFixture,
  userRoleListResponseFixture,
  userRoleLookupResponseFixture,
  roleDetailResponseFixture,
  roleListResponseFixture,
  roleLookupResponseFixture,
} from './fixtures/setup-catalog-response';
import {
  createRoleMutationOptions,
  createUserRoleMutationOptions,
  createUsersMutationOptions,
  roleDetailQueryOptions,
  roleKeys,
  roleListQueryOptions,
  roleLookupQueryOptions,
  userDetailQueryOptions,
  userKeys,
  userListQueryOptions,
  userRoleDetailQueryOptions,
  userRoleKeys,
  userRoleLookupQueryOptions,
  userRolesByUserQueryOptions,
} from '@cms/user-data-access';

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

describe('tax through customFetch', () => {
  it('GETs the paged list with filters and maps a null items array to []', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({
        ...taxListResponseFixture,
        data: { ...taxListResponseFixture.data, items: null },
      }),
    );
    const client = createCmsQueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const page = await client.fetchQuery(
      taxListQueryOptions({ page: 2, search: 'std', isActive: true }),
    );

    expect(page).toEqual({
      items: [],
      page: 1,
      pageSize: 25,
      totalCount: 1,
    });
    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(url).toBe('/api/v1/tax?page=2&search=std&isActive=true');
    expect(init?.signal).toBeInstanceOf(AbortSignal);
    expect(init?.headers).toMatchObject({ Authorization: 'Bearer test-token' });
    disposeCmsQueryClient(client);
  });

  it('GETs a detail record including tax line items', async () => {
    fetchMock.mockResolvedValue(jsonResponse(taxDetailResponseFixture));
    const client = createCmsQueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const tax = await client.fetchQuery(taxDetailQueryOptions(11));

    expect(tax.id).toBe(11);
    expect(tax.taxDetails?.[0]?.taxAuthorityCode).toBe('TX-STATE');
    expect(fetchMock.mock.calls[0]?.[0]).toBe('/api/v1/tax/11');
    disposeCmsQueryClient(client);
  });

  it('GETs lookup options', async () => {
    fetchMock.mockResolvedValue(jsonResponse(taxLookupResponseFixture));
    const client = createCmsQueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const options = await client.fetchQuery(taxLookupQueryOptions(true));

    expect(options).toHaveLength(1);
    expect(fetchMock.mock.calls[0]?.[0]).toBe('/api/v1/tax/lookup?activeOnly=true');
    disposeCmsQueryClient(client);
  });

  it('POSTs a create body and invalidates tax queries', async () => {
    fetchMock.mockResolvedValue(jsonResponse(taxDetailResponseFixture, 201));
    const client = createCmsQueryClient();
    client.setQueryData(taxKeys.list({}), { items: [], page: 1 });

    const mutation = client
      .getMutationCache()
      .build(client, createTaxMutationOptions(client));
    const created = await mutation.execute({
      taxCode: 'TX-STD',
      name: 'Standard Tax',
      isExternalSystemRecord: false,
      externalSystemId: null,
      syncToken: null,
      showTaxDetail: true,
      description: 'State plus local',
      taxRate: 8.25,
    });

    expect(created.id).toBe(11);
    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(url).toBe('/api/v1/tax');
    expect(init?.method).toBe('POST');
    expect(client.getQueryState(taxKeys.list({}))?.isInvalidated).toBe(true);
    disposeCmsQueryClient(client);
  });

  it('lets ApiError propagate out of the query function', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ message: 'Forbidden' }, 403));
    const client = createCmsQueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const failure = client.fetchQuery(taxListQueryOptions());

    await expect(failure).rejects.toBeInstanceOf(ApiError);
    await expect(failure).rejects.toMatchObject({ status: 403 });
    disposeCmsQueryClient(client);
  });
});

describe('tax authority through customFetch', () => {
  it('GETs the paged list', async () => {
    fetchMock.mockResolvedValue(jsonResponse(taxAuthorityListResponseFixture));
    const client = createCmsQueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const page = await client.fetchQuery(
      taxAuthorityListQueryOptions({ code: 'TX-STATE' }),
    );

    expect(page.items[0]?.name).toBe('Texas State');
    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      '/api/v1/taxauthority?code=TX-STATE',
    );
    disposeCmsQueryClient(client);
  });

  it('PATCHes a record and invalidates the module keys', async () => {
    fetchMock.mockResolvedValue(jsonResponse(taxAuthorityDetailResponseFixture));
    const client = createCmsQueryClient();
    client.setQueryData(taxAuthorityKeys.detail(21), { code: 'stale' });

    const mutation = client
      .getMutationCache()
      .build(client, patchTaxAuthorityMutationOptions(client));
    await mutation.execute({ id: 21, body: { isActive: false } });

    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(url).toBe('/api/v1/taxauthority/21');
    expect(init?.method).toBe('PATCH');
    expect(JSON.parse(String(init?.body))).toEqual({ isActive: false });
    expect(client.getQueryState(taxAuthorityKeys.detail(21))?.isInvalidated).toBe(
      true,
    );
    disposeCmsQueryClient(client);
  });
});

describe('non-working date through customFetch', () => {
  it('GETs the paged list, detail, and lookup', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(nonWorkingDateListResponseFixture))
      .mockResolvedValueOnce(jsonResponse(nonWorkingDateDetailResponseFixture))
      .mockResolvedValueOnce(jsonResponse(nonWorkingDateLookupResponseFixture));
    const client = createCmsQueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const page = await client.fetchQuery(
      nonWorkingDateListQueryOptions({
        page: 1,
        name: 'Year',
        nonWorkingDate: '2025-01-01',
        isActive: true,
      }),
    );
    const detail = await client.fetchQuery(
      nonWorkingDateDetailQueryOptions(41),
    );
    const lookup = await client.fetchQuery(
      nonWorkingDateLookupQueryOptions(true),
    );

    expect(page.items[0]?.name).toBe("New Year's Day");
    expect(detail.nonWorkingDate).toBe('2025-01-01');
    expect(lookup).toHaveLength(1);
    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      '/api/v1/nonworkingdate?page=1&name=Year&nonWorkingDate=2025-01-01&isActive=true',
    );
    expect(fetchMock.mock.calls[1]?.[0]).toBe('/api/v1/nonworkingdate/41');
    expect(fetchMock.mock.calls[2]?.[0]).toBe(
      '/api/v1/nonworkingdate/lookup?activeOnly=true',
    );
    disposeCmsQueryClient(client);
  });

  it('POSTs a create body and upserts the list cache without invalidating', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(nonWorkingDateDetailResponseFixture, 201),
    );
    const client = createCmsQueryClient();
    const listKey = nonWorkingDateKeys.list({});
    client.setQueryData(listKey, {
      items: [],
      page: 1,
      pageSize: 10,
      totalCount: 0,
    });

    const mutation = client
      .getMutationCache()
      .build(client, createNonWorkingDateMutationOptions(client));
    const created = await mutation.execute({
      nonWorkingDate: '2025-01-01',
      name: "New Year's Day",
    });

    expect(created.id).toBe(41);
    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(url).toBe('/api/v1/nonworkingdate');
    expect(init?.method).toBe('POST');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(client.getQueryState(listKey)?.isInvalidated).toBe(false);
    expect(client.getQueryData(listKey)).toEqual({
      items: [created],
      page: 1,
      pageSize: 10,
      totalCount: 1,
    });
    disposeCmsQueryClient(client);
  });

  it('DELETEs by id and removes the row from the list cache', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));
    const client = createCmsQueryClient();
    const listKey = nonWorkingDateKeys.list({});
    const existing = nonWorkingDateDetailResponseFixture.data;
    client.setQueryData(listKey, {
      items: [existing],
      page: 1,
      pageSize: 10,
      totalCount: 1,
    });

    const mutation = client
      .getMutationCache()
      .build(client, deleteNonWorkingDateMutationOptions(client));
    await mutation.execute(existing.id);

    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(url).toBe('/api/v1/nonworkingdate/41');
    expect(init?.method).toBe('DELETE');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(client.getQueryState(listKey)?.isInvalidated).toBe(false);
    expect(client.getQueryData(listKey)).toEqual({
      items: [],
      page: 1,
      pageSize: 10,
      totalCount: 0,
    });
    disposeCmsQueryClient(client);
  });
});

describe('zone through customFetch', () => {
  it('GETs the paged list and lookup', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(zoneListResponseFixture))
      .mockResolvedValueOnce(jsonResponse(zoneLookupResponseFixture));
    const client = createCmsQueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const page = await client.fetchQuery(zoneListQueryOptions({ name: 'North' }));
    const lookup = await client.fetchQuery(zoneLookupQueryOptions(false));

    expect(page.items[0]?.code).toBe('NORTH');
    expect(lookup[0]?.name).toBe('North Zone');
    expect(fetchMock.mock.calls[0]?.[0]).toBe('/api/v1/zone?name=North');
    expect(fetchMock.mock.calls[1]?.[0]).toBe(
      '/api/v1/zone/lookup?activeOnly=false',
    );
    disposeCmsQueryClient(client);
  });

  it('POSTs a create body and invalidates zone queries', async () => {
    fetchMock.mockResolvedValue(jsonResponse(zoneDetailResponseFixture, 201));
    const client = createCmsQueryClient();
    client.setQueryData(zoneKeys.list({}), { items: [], page: 1 });

    const mutation = client
      .getMutationCache()
      .build(client, createZoneMutationOptions(client));
    await mutation.execute({
      code: 'NORTH',
      name: 'North Zone',
      description: 'North service territory',
    });

    expect(fetchMock.mock.calls[0]?.[0]).toBe('/api/v1/zone');
    expect(fetchMock.mock.calls[0]?.[1]?.method).toBe('POST');
    expect(client.getQueryState(zoneKeys.list({}))?.isInvalidated).toBe(true);
    disposeCmsQueryClient(client);
  });
});

describe('postal code through customFetch', () => {
  it('GETs the paged list and lookup', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(postalCodeListResponseFixture))
      .mockResolvedValueOnce(jsonResponse(postalCodeLookupResponseFixture));
    const client = createCmsQueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const page = await client.fetchQuery(
      postalCodeListQueryOptions({ city: 'Houston' }),
    );
    const lookup = await client.fetchQuery(postalCodeLookupQueryOptions(false));

    expect(page.items[0]?.postalCode).toBe('NORTH');
    expect(page.items[0]?.stateProvinceCode).toBe('TX');
    expect(page.items[0]?.tripChargeAmount).toBe(10);
    expect(page.items[0]?.fgsSetupZoneId).toBe(31);
    expect(lookup[0]?.city).toBe('Houston');
    expect(fetchMock.mock.calls[0]?.[0]).toBe('/api/v1/postalcode?city=Houston');
    expect(fetchMock.mock.calls[1]?.[0]).toBe(
      '/api/v1/postalcode/lookup?activeOnly=false',
    );
    disposeCmsQueryClient(client);
  });

  it('POSTs a create body and invalidates postal code queries', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(postalCodeDetailResponseFixture, 201),
    );
    const client = createCmsQueryClient();
    client.setQueryData(postalCodeKeys.list({}), { items: [], page: 1 });

    const mutation = client
      .getMutationCache()
      .build(client, createPostalCodeMutationOptions(client));
    await mutation.execute({
      postalCode: '77099',
      countryCode: 'US',
      stateProvinceCode: 'TX',
      city: 'Houston',
      tripChargeAmount: 10,
      fgsSetupZoneId: 31,
      fgsSetupTaxId: 11,
    });

    expect(fetchMock.mock.calls[0]?.[0]).toBe('/api/v1/postalcode');
    expect(fetchMock.mock.calls[0]?.[1]?.method).toBe('POST');
    expect(
      client.getQueryState(postalCodeKeys.list({}))?.isInvalidated,
    ).toBe(true);
    disposeCmsQueryClient(client);
  });
});

describe('tech trade through customFetch', () => {
  it('GETs the paged list and lookup', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(techTradeListResponseFixture))
      .mockResolvedValueOnce(jsonResponse(techTradeLookupResponseFixture));
    const client = createCmsQueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const page = await client.fetchQuery(
      techTradeListQueryOptions({ tradeCode: 'HVAC' }),
    );
    const lookup = await client.fetchQuery(techTradeLookupQueryOptions(false));

    expect(page.items[0]?.tradeCode).toBe('HVAC');
    expect(lookup[0]?.name).toBe('HVAC');
    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      '/api/v1/techtrade?tradeCode=HVAC',
    );
    expect(fetchMock.mock.calls[1]?.[0]).toBe(
      '/api/v1/techtrade/lookup?activeOnly=false',
    );
    disposeCmsQueryClient(client);
  });

  it('POSTs a create body and invalidates tech trade queries', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(techTradeDetailResponseFixture, 201),
    );
    const client = createCmsQueryClient();
    client.setQueryData(techTradeKeys.list({}), { items: [], page: 1 });

    const mutation = client
      .getMutationCache()
      .build(client, createTechTradeMutationOptions(client));
    await mutation.execute({
      tradeCode: 'HVAC',
      name: 'HVAC',
      description: 'Heating, ventilation, and air conditioning',
      sortOrder: 1,
    });

    expect(fetchMock.mock.calls[0]?.[0]).toBe('/api/v1/techtrade');
    expect(fetchMock.mock.calls[0]?.[1]?.method).toBe('POST');
    expect(client.getQueryState(techTradeKeys.list({}))?.isInvalidated).toBe(
      true,
    );
    disposeCmsQueryClient(client);
  });

  it('DELETEs a trade and invalidates tech trade queries', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));
    const client = createCmsQueryClient();
    client.setQueryData(techTradeKeys.list({}), { items: [], page: 1 });

    const mutation = client
      .getMutationCache()
      .build(client, deleteTechTradeMutationOptions(client));
    await mutation.execute(51);

    expect(fetchMock.mock.calls[0]?.[0]).toBe('/api/v1/techtrade/51');
    expect(fetchMock.mock.calls[0]?.[1]?.method).toBe('DELETE');
    expect(client.getQueryState(techTradeKeys.list({}))?.isInvalidated).toBe(
      true,
    );
    disposeCmsQueryClient(client);
  });
});

describe('GL break through customFetch', () => {
  it('GETs the paged list, detail, and lookup', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(glBreakListResponseFixture))
      .mockResolvedValueOnce(jsonResponse(glBreakDetailResponseFixture))
      .mockResolvedValueOnce(jsonResponse(glBreakLookupResponseFixture));
    const client = createCmsQueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const page = await client.fetchQuery(
      glBreakListQueryOptions({ code: 'HQ', breakLevel: 1 }),
    );
    const detail = await client.fetchQuery(glBreakDetailQueryOptions(61));
    const lookup = await client.fetchQuery(glBreakLookupQueryOptions(false));

    expect(page.items[0]?.code).toBe('HQ');
    expect(detail.trades?.[0]?.tradeCode).toBe('HVAC');
    expect(lookup[0]?.breakLevel).toBe(1);
    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      '/api/v1/glbreak?code=HQ&breakLevel=1',
    );
    expect(fetchMock.mock.calls[1]?.[0]).toBe('/api/v1/glbreak/61');
    expect(fetchMock.mock.calls[2]?.[0]).toBe(
      '/api/v1/glbreak/lookup?activeOnly=false',
    );
    disposeCmsQueryClient(client);
  });

  it('POSTs a create body and invalidates GL break queries', async () => {
    fetchMock.mockResolvedValue(jsonResponse(glBreakDetailResponseFixture, 201));
    const client = createCmsQueryClient();
    client.setQueryData(glBreakKeys.list({}), { items: [], page: 1 });

    const mutation = client
      .getMutationCache()
      .build(client, createGlBreakMutationOptions(client));
    await mutation.execute({
      code: 'HQ',
      name: 'Headquarters',
      breakLabel: 'Company HQ',
      breakLevel: 1,
      logoFileId: null,
      address: {
        addressLine1: '100 Main St',
        city: 'Houston',
        state: 'TX',
        country: 'US',
        postalCode: '77002',
      },
      tradeCodes: ['HVAC', 'PLUMB'],
    });

    expect(fetchMock.mock.calls[0]?.[0]).toBe('/api/v1/glbreak');
    expect(fetchMock.mock.calls[0]?.[1]?.method).toBe('POST');
    expect(client.getQueryState(glBreakKeys.list({}))?.isInvalidated).toBe(true);
    disposeCmsQueryClient(client);
  });
});

describe('tech skill level through customFetch', () => {
  it('GETs the paged list and lookup', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(techSkillLevelListResponseFixture))
      .mockResolvedValueOnce(jsonResponse(techSkillLevelLookupResponseFixture));
    const client = createCmsQueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const page = await client.fetchQuery(
      techSkillLevelListQueryOptions({ name: 'Master' }),
    );
    const lookup = await client.fetchQuery(
      techSkillLevelLookupQueryOptions(false),
    );

    expect(page.items[0]?.code).toBe('MAST');
    expect(lookup[0]?.name).toBe('Master');
    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      '/api/v1/techskilllevel?name=Master',
    );
    expect(fetchMock.mock.calls[1]?.[0]).toBe(
      '/api/v1/techskilllevel/lookup?activeOnly=false',
    );
    disposeCmsQueryClient(client);
  });

  it('POSTs a create body and invalidates tech skill level queries', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(techSkillLevelDetailResponseFixture, 201),
    );
    const client = createCmsQueryClient();
    client.setQueryData(techSkillLevelKeys.list({}), { items: [], page: 1 });

    const mutation = client
      .getMutationCache()
      .build(client, createTechSkillLevelMutationOptions(client));
    await mutation.execute({
      code: 'MAST',
      name: 'Master',
      description: 'Senior technician',
      sortOrder: 3,
    });

    expect(fetchMock.mock.calls[0]?.[0]).toBe('/api/v1/techskilllevel');
    expect(fetchMock.mock.calls[0]?.[1]?.method).toBe('POST');
    expect(
      client.getQueryState(techSkillLevelKeys.list({}))?.isInvalidated,
    ).toBe(true);
    disposeCmsQueryClient(client);
  });

  it('DELETEs a skill level and invalidates tech skill level queries', async () => {
    const client = createCmsQueryClient();
    client.setQueryData(techSkillLevelKeys.list({}), { items: [], page: 1 });

    const mutation = client
      .getMutationCache()
      .build(client, deleteTechSkillLevelMutationOptions(client));
    await mutation.execute(61);

    expect(fetchMock.mock.calls[0]?.[0]).toBe('/api/v1/techskilllevel/61');
    expect(fetchMock.mock.calls[0]?.[1]?.method).toBe('DELETE');
    expect(
      client.getQueryState(techSkillLevelKeys.list({}))?.isInvalidated,
    ).toBe(true);
    disposeCmsQueryClient(client);
  });
});

describe('business type through customFetch', () => {
  it('GETs the paged list and lookup', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(businessTypeListResponseFixture))
      .mockResolvedValueOnce(jsonResponse(businessTypeLookupResponseFixture));
    const client = createCmsQueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const page = await client.fetchQuery(
      businessTypeListQueryOptions({ code: 'RES', name: 'Residential' }),
    );
    const lookup = await client.fetchQuery(
      businessTypeLookupQueryOptions(false),
    );

    expect(page.items[0]?.code).toBe('RES');
    expect(lookup[0]?.name).toBe('Residential');
    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      '/api/v1/businesstype?code=RES&name=Residential',
    );
    expect(fetchMock.mock.calls[1]?.[0]).toBe(
      '/api/v1/businesstype/lookup?activeOnly=false',
    );
    disposeCmsQueryClient(client);
  });

  it('POSTs a create body and invalidates business type queries', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(businessTypeDetailResponseFixture, 201),
    );
    const client = createCmsQueryClient();
    client.setQueryData(businessTypeKeys.list({}), { items: [], page: 1 });

    const mutation = client
      .getMutationCache()
      .build(client, createBusinessTypeMutationOptions(client));
    await mutation.execute({
      code: 'RES',
      name: 'Residential',
      description: 'Homes and apartments',
      displayOrder: 1,
    });

    expect(fetchMock.mock.calls[0]?.[0]).toBe('/api/v1/businesstype');
    expect(fetchMock.mock.calls[0]?.[1]?.method).toBe('POST');
    expect(
      client.getQueryState(businessTypeKeys.list({}))?.isInvalidated,
    ).toBe(true);
    disposeCmsQueryClient(client);
  });

  it('requests the full catalog in one page of 1000', async () => {
    fetchMock.mockResolvedValue(jsonResponse(businessTypeListResponseFixture));
    const client = createCmsQueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    await client.fetchQuery(
      businessTypeListQueryOptions({ page: 1, pageSize: 1000 }),
    );

    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      '/api/v1/businesstype?page=1&pageSize=1000',
    );
    disposeCmsQueryClient(client);
  });
});

describe('user through customFetch', () => {
  it('GETs the paged list with filters and optional summary', async () => {
    fetchMock.mockResolvedValue(jsonResponse(userListResponseFixture));
    const client = createCmsQueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const page = await client.fetchQuery(
      userListQueryOptions({
        page: 2,
        search: 'alex',
        isActive: true,
        includeSummary: true,
      }),
    );

    expect(page.items).toHaveLength(1);
    expect(page.summary?.admins).toBe(1);
    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      '/api/v1/user?page=2&search=alex&isActive=true&includeSummary=true',
    );
    disposeCmsQueryClient(client);
  });

  it('GETs a detail record', async () => {
    fetchMock.mockResolvedValue(jsonResponse(userDetailResponseFixture));
    const client = createCmsQueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const user = await client.fetchQuery(
      userDetailQueryOptions('a1111111-1111-4111-8111-111111111101'),
    );

    expect(user.hasAcceptedInvitation).toBe(true);
    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      '/api/v1/user/a1111111-1111-4111-8111-111111111101',
    );
    disposeCmsQueryClient(client);
  });

  it('POSTs invite payloads and invalidates user queries', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(
        {
          success: true,
          statusCode: 201,
          data: [userDetailResponseFixture.data],
        },
        201,
      ),
    );
    const client = createCmsQueryClient();
    client.setQueryData(userKeys.list({}), { items: [], page: 1 });

    const mutation = client
      .getMutationCache()
      .build(client, createUsersMutationOptions(client));
    const created = await mutation.execute([
      {
        displayName: 'New User',
        email: 'new@example.com',
        phoneNumber: null,
        roleIds: [2],
        authenticationMethod: 'password',
      },
    ]);

    expect(created).toHaveLength(1);
    expect(fetchMock.mock.calls[0]?.[0]).toBe('/api/v1/user');
    expect(fetchMock.mock.calls[0]?.[1]?.method).toBe('POST');
    expect(client.getQueryState(userKeys.list({}))?.isInvalidated).toBe(true);
    disposeCmsQueryClient(client);
  });
});

describe('user role through customFetch', () => {
  it('GETs roles for a user', async () => {
    fetchMock.mockResolvedValue(jsonResponse(userRoleListResponseFixture));
    const client = createCmsQueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const roles = await client.fetchQuery(
      userRolesByUserQueryOptions('a1111111-1111-4111-8111-111111111101'),
    );

    expect(roles[0]?.fgsRoleId).toBe(1);
    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      '/api/v1/userrole/a1111111-1111-4111-8111-111111111101',
    );
    disposeCmsQueryClient(client);
  });

  it('GETs lookup rows', async () => {
    fetchMock.mockResolvedValue(jsonResponse(userRoleLookupResponseFixture));
    const client = createCmsQueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    await client.fetchQuery(
      userRoleLookupQueryOptions({
        userId: 'a1111111-1111-4111-8111-111111111101',
      }),
    );

    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      '/api/v1/userrole/lookup?userId=a1111111-1111-4111-8111-111111111101',
    );
    disposeCmsQueryClient(client);
  });

  it('GETs a user role item', async () => {
    fetchMock.mockResolvedValue(jsonResponse(userRoleDetailResponseFixture));
    const client = createCmsQueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const item = await client.fetchQuery(userRoleDetailQueryOptions(501));

    expect(item.id).toBe(501);
    expect(fetchMock.mock.calls[0]?.[0]).toBe('/api/v1/userrole/item/501');
    disposeCmsQueryClient(client);
  });

  it('POSTs a user role and invalidates user role queries', async () => {
    fetchMock.mockResolvedValue(jsonResponse(userRoleDetailResponseFixture, 201));
    const client = createCmsQueryClient();
    client.setQueryData(userRoleKeys.lookup({}), []);

    const mutation = client
      .getMutationCache()
      .build(client, createUserRoleMutationOptions(client));
    await mutation.execute({
      userId: 'a1111111-1111-4111-8111-111111111102',
      fgsRoleId: 2,
    });

    expect(fetchMock.mock.calls[0]?.[0]).toBe('/api/v1/userrole');
    expect(fetchMock.mock.calls[0]?.[1]?.method).toBe('POST');
    expect(client.getQueryState(userRoleKeys.lookup({}))?.isInvalidated).toBe(
      true,
    );
    disposeCmsQueryClient(client);
  });
});

describe('role through customFetch', () => {
  it('GETs the paged list', async () => {
    fetchMock.mockResolvedValue(jsonResponse(roleListResponseFixture));
    const client = createCmsQueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const page = await client.fetchQuery(
      roleListQueryOptions({ roleCode: 'ADMIN', isBuiltIn: true }),
    );

    expect(page.items[0]?.roleCode).toBe('ADMIN');
    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      '/api/v1/role?roleCode=ADMIN&isBuiltIn=true',
    );
    disposeCmsQueryClient(client);
  });

  it('GETs lookup options', async () => {
    fetchMock.mockResolvedValue(jsonResponse(roleLookupResponseFixture));
    const client = createCmsQueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    await client.fetchQuery(roleLookupQueryOptions(true));

    expect(fetchMock.mock.calls[0]?.[0]).toBe('/api/v1/role/lookup?activeOnly=true');
    disposeCmsQueryClient(client);
  });

  it('GETs a detail record', async () => {
    fetchMock.mockResolvedValue(jsonResponse(roleDetailResponseFixture));
    const client = createCmsQueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const role = await client.fetchQuery(roleDetailQueryOptions(1));

    expect(role.isBuiltIn).toBe(true);
    expect(fetchMock.mock.calls[0]?.[0]).toBe('/api/v1/role/1');
    disposeCmsQueryClient(client);
  });

  it('POSTs a create body and invalidates role queries', async () => {
    fetchMock.mockResolvedValue(jsonResponse(roleDetailResponseFixture, 201));
    const client = createCmsQueryClient();
    client.setQueryData(roleKeys.list({}), { items: [], page: 1 });

    const mutation = client
      .getMutationCache()
      .build(client, createRoleMutationOptions(client));
    await mutation.execute({
      roleCode: 'DISPATCH',
      name: 'Dispatcher',
      description: 'Dispatch queue',
      parentRoleId: null,
      displayOrder: 4,
    });

    expect(fetchMock.mock.calls[0]?.[0]).toBe('/api/v1/role');
    expect(fetchMock.mock.calls[0]?.[1]?.method).toBe('POST');
    expect(client.getQueryState(roleKeys.list({}))?.isInvalidated).toBe(true);
    disposeCmsQueryClient(client);
  });
});
