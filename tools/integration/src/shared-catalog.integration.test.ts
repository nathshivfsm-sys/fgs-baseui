import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createCmsQueryClient,
  disposeCmsQueryClient,
} from '@cms/platform-contract';
import { configureCustomFetch } from '@cms/shared-api';
import {
  createPaymentTermMutationOptions,
  createTagMutationOptions,
  paymentTermDetailQueryOptions,
  paymentTermKeys,
  paymentTermListQueryOptions,
  paymentTermLookupQueryOptions,
  patchTagMutationOptions,
  tagDetailQueryOptions,
  tagKeys,
  tagListQueryOptions,
  tagLookupQueryOptions,
} from '@cms/shared-data-access';
import {
  paymentTermDetailResponseFixture,
  paymentTermListResponseFixture,
  paymentTermLookupResponseFixture,
  tagDetailResponseFixture,
  tagListResponseFixture,
  tagLookupResponseFixture,
} from './fixtures/shared-catalog-response';

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

describe('tag through customFetch', () => {
  it('GETs the paged list, detail, and lookup', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(tagListResponseFixture))
      .mockResolvedValueOnce(jsonResponse(tagDetailResponseFixture))
      .mockResolvedValueOnce(jsonResponse(tagLookupResponseFixture));
    const client = createCmsQueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const page = await client.fetchQuery(
      tagListQueryOptions({ name: 'VIP', isActive: true }),
    );
    const detail = await client.fetchQuery(tagDetailQueryOptions(1));
    const lookup = await client.fetchQuery(tagLookupQueryOptions(false));

    expect(page.items[0]?.tagCode).toBe('VIP');
    expect(detail.usageCount).toBe(4);
    expect(lookup[0]?.name).toBe('VIP');
    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      '/api/v1/tag?name=VIP&isActive=true',
    );
    expect(fetchMock.mock.calls[1]?.[0]).toBe('/api/v1/tag/1');
    expect(fetchMock.mock.calls[2]?.[0]).toBe(
      '/api/v1/tag/lookup?activeOnly=false',
    );
    disposeCmsQueryClient(client);
  });

  it('POSTs a create body and invalidates tag queries', async () => {
    fetchMock.mockResolvedValue(jsonResponse(tagDetailResponseFixture, 201));
    const client = createCmsQueryClient();
    client.setQueryData(tagKeys.list({}), { items: [], page: 1 });

    const mutation = client
      .getMutationCache()
      .build(client, createTagMutationOptions(client));
    await mutation.execute({ tagCode: 'VIP', name: 'VIP' });

    expect(fetchMock.mock.calls[0]?.[0]).toBe('/api/v1/tag');
    expect(fetchMock.mock.calls[0]?.[1]?.method).toBe('POST');
    expect(client.getQueryState(tagKeys.list({}))?.isInvalidated).toBe(true);
    disposeCmsQueryClient(client);
  });

  it('PATCHes a tag and invalidates tag queries', async () => {
    fetchMock.mockResolvedValue(jsonResponse(tagDetailResponseFixture));
    const client = createCmsQueryClient();
    client.setQueryData(tagKeys.list({}), { items: [], page: 1 });

    const mutation = client
      .getMutationCache()
      .build(client, patchTagMutationOptions(client));
    await mutation.execute({ id: 1, body: { isActive: false } });

    expect(fetchMock.mock.calls[0]?.[0]).toBe('/api/v1/tag/1');
    expect(fetchMock.mock.calls[0]?.[1]?.method).toBe('PATCH');
    expect(client.getQueryState(tagKeys.list({}))?.isInvalidated).toBe(true);
    disposeCmsQueryClient(client);
  });
});

describe('payment term through customFetch', () => {
  it('GETs the paged list, detail, and lookup', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(paymentTermListResponseFixture))
      .mockResolvedValueOnce(jsonResponse(paymentTermDetailResponseFixture))
      .mockResolvedValueOnce(jsonResponse(paymentTermLookupResponseFixture));
    const client = createCmsQueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const page = await client.fetchQuery(
      paymentTermListQueryOptions({ name: 'Net' }),
    );
    const detail = await client.fetchQuery(paymentTermDetailQueryOptions(2));
    const lookup = await client.fetchQuery(paymentTermLookupQueryOptions());

    expect(page.items[0]?.name).toBe('Net 30');
    expect(detail.numberOfDays).toBe(30);
    expect(lookup[0]?.id).toBe(2);
    expect(fetchMock.mock.calls[0]?.[0]).toBe('/api/v1/paymentterm?name=Net');
    expect(fetchMock.mock.calls[1]?.[0]).toBe('/api/v1/paymentterm/2');
    expect(fetchMock.mock.calls[2]?.[0]).toBe(
      '/api/v1/paymentterm/lookup?activeOnly=true',
    );
    disposeCmsQueryClient(client);
  });

  it('POSTs a create body and invalidates payment term queries', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(paymentTermDetailResponseFixture, 201),
    );
    const client = createCmsQueryClient();
    client.setQueryData(paymentTermKeys.list({}), { items: [], page: 1 });

    const mutation = client
      .getMutationCache()
      .build(client, createPaymentTermMutationOptions(client));
    await mutation.execute({
      name: 'Net 30',
      dueDateMethod: 'daysAfterInvoice',
      numberOfDays: 30,
      isAccountsReceivable: true,
      isAccountsPayable: true,
      isMobileVisible: true,
    });

    expect(fetchMock.mock.calls[0]?.[0]).toBe('/api/v1/paymentterm');
    expect(fetchMock.mock.calls[0]?.[1]?.method).toBe('POST');
    expect(client.getQueryState(paymentTermKeys.list({}))?.isInvalidated).toBe(
      true,
    );
    disposeCmsQueryClient(client);
  });
});
