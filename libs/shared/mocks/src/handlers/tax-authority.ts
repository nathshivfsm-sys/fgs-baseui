import { http } from 'msw';
import {
  taxAuthorityCreateDtoSchema,
  taxAuthorityPatchDtoSchema,
  taxAuthorityUpdateDtoSchema,
  type TaxAuthorityCreateDto,
  type TaxAuthorityDetailDto,
  type TaxAuthorityLookupDto,
} from '@cms/settings-contract';
import {
  assignDefined,
  firstIssueMessage,
  matchesSearch,
  nextId,
  pagedResult,
  parseRouteId,
  readJsonObject,
  readOptionalBoolean,
  setupError,
  setupOk,
} from './util';

function seedTaxAuthorities(): TaxAuthorityDetailDto[] {
  return [
    {
      id: 21,
      code: 'TX-STATE',
      name: 'Texas State',
      regionCode: 'TX',
      isExternalSystemRecord: false,
      taxPercent: 6.25,
      description: 'State sales tax',
      usageCount: 2,
      isActive: true,
    },
    {
      id: 22,
      code: 'AUS-CITY',
      name: 'Austin City',
      regionCode: 'TX',
      isExternalSystemRecord: false,
      taxPercent: 2,
      description: 'City sales tax',
      usageCount: 2,
      isActive: true,
    },
    {
      id: 23,
      code: 'OK-STATE',
      name: 'Oklahoma State',
      regionCode: 'OK',
      isExternalSystemRecord: false,
      taxPercent: 4.5,
      description: 'Inactive authority kept for history',
      usageCount: 0,
      isActive: false,
    },
  ];
}

const authorities = seedTaxAuthorities();

function toLookup(record: TaxAuthorityDetailDto): TaxAuthorityLookupDto {
  return {
    id: record.id,
    code: record.code,
    name: record.name,
    taxPercent: record.taxPercent,
  };
}

function findAuthority(id: number | undefined): TaxAuthorityDetailDto | undefined {
  return id === undefined
    ? undefined
    : authorities.find((record) => record.id === id);
}

function filterAuthorities(url: URL): TaxAuthorityDetailDto[] {
  const isActive = readOptionalBoolean(url, 'isActive');
  const code = url.searchParams.get('code');
  const name = url.searchParams.get('name');
  const search = url.searchParams.get('search');
  return authorities.filter((record) => {
    if (isActive !== undefined && record.isActive !== isActive) return false;
    if (code && (record.code ?? '').toLowerCase() !== code.toLowerCase()) {
      return false;
    }
    if (name && !(record.name ?? '').toLowerCase().includes(name.toLowerCase())) {
      return false;
    }
    return matchesSearch(search, [
      record.code,
      record.name,
      record.regionCode,
      record.description,
    ]);
  });
}

function createFromBody(body: TaxAuthorityCreateDto): TaxAuthorityDetailDto {
  return {
    id: nextId(authorities),
    code: body.code ?? null,
    name: body.name ?? null,
    regionCode: body.regionCode ?? null,
    isExternalSystemRecord: body.isExternalSystemRecord,
    taxPercent: body.taxPercent,
    description: body.description ?? null,
    usageCount: 0,
    isActive: true,
  };
}

/**
 * In-memory `/taxauthority` catalog. Mutations persist for the session so a
 * follow-up GET after invalidation shows the saved values. Request/response
 * shapes come from `@cms/settings-contract`.
 */
export const taxAuthorityHandlers = [
  http.get('/api/v1/taxauthority/lookup', ({ request }) => {
    const url = new URL(request.url);
    const activeOnly = readOptionalBoolean(url, 'activeOnly') ?? true;
    const items = authorities
      .filter((record) => (activeOnly ? record.isActive : true))
      .map(toLookup);
    return setupOk(items);
  }),

  http.get('/api/v1/taxauthority/:id', ({ params }) => {
    const record = findAuthority(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Tax authority not found.');
    return setupOk(record);
  }),

  http.get('/api/v1/taxauthority', ({ request }) => {
    const url = new URL(request.url);
    return setupOk(pagedResult(filterAuthorities(url), url));
  }),

  http.post('/api/v1/taxauthority', async ({ request }) => {
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = taxAuthorityCreateDtoSchema.safeParse(body.value);
    if (!parsed.success) return setupError(400, firstIssueMessage(parsed.error));
    const created = createFromBody(parsed.data);
    authorities.push(created);
    return setupOk(created, 201);
  }),

  http.put('/api/v1/taxauthority/:id', async ({ params, request }) => {
    const record = findAuthority(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Tax authority not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = taxAuthorityUpdateDtoSchema.safeParse(body.value);
    if (!parsed.success) return setupError(400, firstIssueMessage(parsed.error));
    assignDefined(record, parsed.data);
    return setupOk(record);
  }),

  http.patch('/api/v1/taxauthority/:id', async ({ params, request }) => {
    const record = findAuthority(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Tax authority not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = taxAuthorityPatchDtoSchema.safeParse(body.value);
    if (!parsed.success) return setupError(400, firstIssueMessage(parsed.error));
    assignDefined(record, parsed.data);
    return setupOk(record);
  }),
];
