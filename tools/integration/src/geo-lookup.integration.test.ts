import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createCmsQueryClient,
  disposeCmsQueryClient,
} from '@cms/platform-contract';
import {
  gloCountryLookupQueryOptions,
  gloStateProvinceLookupQueryOptions,
  postalCodeCitiesQueryOptions,
} from '@cms/shared-data-access';
import { configureCustomFetch } from '@cms/shared-api';
import {
  gloCountryLookupResponseFixture,
  gloStateProvinceLookupResponseFixture,
  postalCodeCitiesResponseFixture,
} from './fixtures/geo-lookup-response';

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

describe('geo lookup through customFetch', () => {
  it('GETs country, state/province, and city lookups with filters', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(gloCountryLookupResponseFixture))
      .mockResolvedValueOnce(
        jsonResponse(gloStateProvinceLookupResponseFixture),
      )
      .mockResolvedValueOnce(jsonResponse(postalCodeCitiesResponseFixture));
    const client = createCmsQueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const countries = await client.fetchQuery(gloCountryLookupQueryOptions());
    const states = await client.fetchQuery(
      gloStateProvinceLookupQueryOptions({
        countryCode: 'US',
        activeOnly: false,
      }),
    );
    const cities = await client.fetchQuery(
      postalCodeCitiesQueryOptions({
        countryCode: 'US',
        stateProvinceCode: 'TX',
        activeOnly: false,
      }),
    );

    expect(countries[0]?.countryCode).toBe('US');
    expect(states[0]?.stateProvinceCode).toBe('TX');
    expect(cities[0]?.city).toBe('Houston');
    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      '/api/v1/glo/country/lookup?activeOnly=true',
    );
    expect(fetchMock.mock.calls[1]?.[0]).toBe(
      '/api/v1/glo/stateprovince/lookup?countryCode=US&activeOnly=false',
    );
    expect(fetchMock.mock.calls[2]?.[0]).toBe(
      '/api/v1/postalcode/cities?countryCode=US&stateProvinceCode=TX&activeOnly=false',
    );
    disposeCmsQueryClient(client);
  });
});
