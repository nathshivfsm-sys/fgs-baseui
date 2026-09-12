import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createCmsQueryClient,
  disposeCmsQueryClient,
} from '@cms/platform-contract';
import {
  createNonWorkingDateMutationOptions,
  createTaxMutationOptions,
  createZoneMutationOptions,
  nonWorkingDateDetailQueryOptions,
  nonWorkingDateKeys,
  nonWorkingDateListQueryOptions,
  nonWorkingDateLookupQueryOptions,
  patchTaxAuthorityMutationOptions,
  taxAuthorityKeys,
  taxAuthorityListQueryOptions,
  taxDetailQueryOptions,
  taxKeys,
  taxListQueryOptions,
  taxLookupQueryOptions,
  zoneKeys,
  zoneListQueryOptions,
  zoneLookupQueryOptions,
} from '@cms/settings-data-access';
import { ApiError, configureCustomFetch } from '@cms/shared-api';
import {
  nonWorkingDateDetailResponseFixture,
  nonWorkingDateListResponseFixture,
  nonWorkingDateLookupResponseFixture,
  taxAuthorityDetailResponseFixture,
  taxAuthorityListResponseFixture,
  taxDetailResponseFixture,
  taxListResponseFixture,
  taxLookupResponseFixture,
  zoneDetailResponseFixture,
  zoneListResponseFixture,
  zoneLookupResponseFixture,
} from './fixtures/setup-catalog-response';

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

  it('POSTs a create body and invalidates non-working date queries', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(nonWorkingDateDetailResponseFixture, 201),
    );
    const client = createCmsQueryClient();
    client.setQueryData(nonWorkingDateKeys.list({}), { items: [], page: 1 });

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
    expect(
      client.getQueryState(nonWorkingDateKeys.list({}))?.isInvalidated,
    ).toBe(true);
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
