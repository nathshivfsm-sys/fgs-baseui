import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createCmsQueryClient,
  disposeCmsQueryClient,
} from '@cms/platform-contract';
import {
  createCustomerMutationOptions,
  createServiceLocationMutationOptions,
  customerDetailQueryOptions,
  customerFinancialSummaryQueryOptions,
  customerKeys,
  customerListQueryOptions,
  customerLookupQueryOptions,
  emptyCustomerCreateForm,
  patchCustomerMutationOptions,
  serviceLocationDetailQueryOptions,
  serviceLocationListQueryOptions,
  toCustomerCreateDto,
  toServiceLocationCreateDto,
  emptyServiceLocationOnlyForm,
} from '@cms/customer-data-access';
import { configureCustomFetch } from '@cms/shared-api';
import {
  customerCreateResponseFixture,
  customerDetailResponseFixture,
  customerFinancialSummaryResponseFixture,
  customerListResponseFixture,
  customerLookupResponseFixture,
} from './fixtures/crm-customer-response';
import {
  serviceLocationCreateResponseFixture,
  serviceLocationDetailResponseFixture,
  serviceLocationListResponseFixture,
} from './fixtures/crm-service-location-response';

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

const sampleAddress = {
  addressLine1: '100 Main St',
  addressLine2: '',
  city: 'Austin',
  state: 'TX',
  postalCode: '78701',
  country: 'US',
};

describe('customer create form mapper', () => {
  it('omits serviceLocation for bill to only even when SL values remain in form state', () => {
    const values = emptyCustomerCreateForm();
    values.creationOption = 'billToOnly';
    values.name = 'Bill To Only Co';
    values.displayName = 'Bill To Only Co';
    values.address = sampleAddress;
    values.defaultPaymentTermId = '2';
    values.serviceLocation.name = 'Hidden SL';

    const dto = toCustomerCreateDto(values);

    expect(dto.creationOption).toBe('billToOnly');
    expect(dto).not.toHaveProperty('serviceLocation');
    expect(dto.customerNumber).toBeNull();
    expect(dto.defaultPORequired).toBe(false);
  });

  it('resolves same-as service location into separate AR fields on the wire', () => {
    const values = emptyCustomerCreateForm();
    values.sameAsServiceLocation = true;
    values.serviceLocation.name = 'SL Name';
    values.serviceLocation.displayName = 'SL Display';
    values.serviceLocation.address = sampleAddress;
    values.serviceLocation.primaryContactEmail = 'sl@example.com';
    values.defaultPaymentTermId = '2';

    const dto = toCustomerCreateDto(values);

    expect(dto.name).toBe('SL Name');
    expect(dto.displayName).toBe('SL Display');
    expect(dto.primaryContactEmail).toBe('sl@example.com');
    expect(dto.serviceLocation?.name).toBe('SL Name');
    expect(dto.serviceLocation?.customerType).toBe('residential');
    expect(dto.serviceLocation).not.toHaveProperty('serviceLocationType');
  });
});

describe('customer through customFetch', () => {
  it('GETs the paged list with filters and preserves list summary', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({
        ...customerListResponseFixture,
        data: { ...customerListResponseFixture.data, items: null },
      }),
    );
    const client = createCmsQueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const page = await client.fetchQuery(
      customerListQueryOptions({
        page: 2,
        search: 'rivera',
        isActive: true,
        isPreferred: true,
      }),
    );

    expect(page.items).toEqual([]);
    expect(page.summary?.totalCustomers).toBe(1);
    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(url).toBe(
      '/api/v1/customer?page=2&search=rivera&isActive=true&isPreferred=true',
    );
    expect(init?.signal).toBeInstanceOf(AbortSignal);
    expect(init?.headers).toMatchObject({ Authorization: 'Bearer test-token' });
    disposeCmsQueryClient(client);
  });

  it('GETs a detail record', async () => {
    fetchMock.mockResolvedValue(jsonResponse(customerDetailResponseFixture));
    const client = createCmsQueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const customer = await client.fetchQuery(customerDetailQueryOptions(501));

    expect(customer.id).toBe(501);
    expect(customer.primaryContactEmail).toBe('maria@rivera.example.com');
    expect(fetchMock.mock.calls[0]?.[0]).toBe('/api/v1/customer/501');
    disposeCmsQueryClient(client);
  });

  it('GETs a financial summary for the detail header tiles', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(customerFinancialSummaryResponseFixture),
    );
    const client = createCmsQueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const summary = await client.fetchQuery(
      customerFinancialSummaryQueryOptions(501),
    );

    expect(summary.arBalance).toBe(23_000);
    expect(summary.activeCardsOnFile).toBe(4);
    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      '/api/v1/customer/501/financialsummary',
    );
    disposeCmsQueryClient(client);
  });

  it('GETs lookup values', async () => {
    fetchMock.mockResolvedValue(jsonResponse(customerLookupResponseFixture));
    const client = createCmsQueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const items = await client.fetchQuery(customerLookupQueryOptions(false));

    expect(items[0]?.displayName).toBe('Rivera Home Services');
    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      '/api/v1/customer/lookup?activeOnly=false',
    );
    disposeCmsQueryClient(client);
  });

  it('POSTs a create payload and invalidates module keys', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(customerCreateResponseFixture, 201),
    );
    const client = createCmsQueryClient();
    client.setQueryData(customerKeys.list({}), {
      items: [],
      page: 1,
      pageSize: 25,
      totalCount: 0,
      summary: null,
    });

    const mutation = client
      .getMutationCache()
      .build(client, createCustomerMutationOptions(client));
    await mutation.execute({
      creationOption: 'billToOnly',
      defaultPORequired: false,
      taxExempt: false,
      name: 'New Customer',
    });

    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(url).toBe('/api/v1/customer');
    expect(init?.method).toBe('POST');
    expect(JSON.parse(String(init?.body))).toEqual({
      creationOption: 'billToOnly',
      defaultPORequired: false,
      taxExempt: false,
      name: 'New Customer',
    });
    expect(client.getQueryState(customerKeys.list({}))?.isInvalidated).toBe(
      true,
    );
    disposeCmsQueryClient(client);
  });

  it('PATCHes a record and invalidates the module keys', async () => {
    fetchMock.mockResolvedValue(jsonResponse(customerDetailResponseFixture));
    const client = createCmsQueryClient();
    client.setQueryData(customerKeys.detail(501), { name: 'stale' });

    const mutation = client
      .getMutationCache()
      .build(client, patchCustomerMutationOptions(client));
    await mutation.execute({ id: 501, body: { isActive: false } });

    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(url).toBe('/api/v1/customer/501');
    expect(init?.method).toBe('PATCH');
    expect(JSON.parse(String(init?.body))).toEqual({ isActive: false });
    expect(client.getQueryState(customerKeys.detail(501))?.isInvalidated).toBe(
      true,
    );
    disposeCmsQueryClient(client);
  });
});

describe('service locations through customFetch', () => {
  it('GETs the paged list under a customer with search and summary', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(serviceLocationListResponseFixture),
    );
    const client = createCmsQueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const page = await client.fetchQuery(
      serviceLocationListQueryOptions(501, {
        page: 1,
        pageSize: 10,
        search: 'main',
        isActive: true,
        includeSummary: true,
        customerType: 'commercial',
      }),
    );

    expect(page.items[0]?.name).toBe('Main Office');
    expect(page.summary?.activeCount).toBe(6);
    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      '/api/v1/customer/501/servicelocation?page=1&pageSize=10&search=main&isActive=true&includeSummary=true&customerType=commercial',
    );
    disposeCmsQueryClient(client);
  });

  it('GETs a service location detail record', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(serviceLocationDetailResponseFixture),
    );
    const client = createCmsQueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const location = await client.fetchQuery(
      serviceLocationDetailQueryOptions(501, 9001),
    );

    expect(location.locationNumber).toBe('ID-2345');
    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      '/api/v1/customer/501/servicelocation/9001',
    );
    disposeCmsQueryClient(client);
  });

  it('POSTs a service location under a customer', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(serviceLocationCreateResponseFixture, 201),
    );
    const client = createCmsQueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const values = emptyServiceLocationOnlyForm();
    values.serviceLocation.name = 'New Site';
    values.serviceLocation.displayName = 'New Site Display';
    values.serviceLocation.address = {
      addressLine1: '1 Main St',
      addressLine2: '',
      city: 'Springfield',
      state: 'IL',
      postalCode: '62701',
      country: 'US',
    };

    const mutation = client
      .getMutationCache()
      .build(client, createServiceLocationMutationOptions(client, 501));
    const result = await mutation.execute(toServiceLocationCreateDto(values));

    expect(result.serviceLocationId).toBe(9010);
    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(url).toBe('/api/v1/customer/501/servicelocation');
    expect(init?.method).toBe('POST');
    disposeCmsQueryClient(client);
  });
});
