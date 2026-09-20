import { http } from 'msw';
import {
  postalCodeCreateDtoSchema,
  postalCodePatchDtoSchema,
  postalCodeUpdateDtoSchema,
  type PostalCodeCreateDto,
  type PostalCodeDetailDto,
  type PostalCodeLookupDto,
  type PostalCodePatchDto,
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

function seedPostalCodes(): PostalCodeDetailDto[] {
  return [
    {
      id: 41,
      postalCode: 'NORTH',
      countryCode: 'US',
      stateProvinceCode: 'TX',
      city: 'Houston',
      tripChargeAmount: 10,
      fgsSetupZoneId: 31,
      fgsSetupTaxId: 11,
      isActive: true,
    },
    {
      id: 42,
      postalCode: 'SOUTH',
      countryCode: 'US',
      stateProvinceCode: 'TX',
      city: 'Houston',
      tripChargeAmount: 10,
      fgsSetupZoneId: 32,
      fgsSetupTaxId: 12,
      isActive: true,
    },
    {
      id: 43,
      postalCode: 'EAST',
      countryCode: 'US',
      stateProvinceCode: 'TX',
      city: 'Dallas',
      tripChargeAmount: 10,
      fgsSetupZoneId: 34,
      fgsSetupTaxId: 11,
      isActive: true,
    },
    {
      id: 44,
      postalCode: 'WEST',
      countryCode: 'US',
      stateProvinceCode: 'TX',
      city: 'Chicago',
      tripChargeAmount: 10,
      fgsSetupZoneId: 35,
      fgsSetupTaxId: 11,
      isActive: true,
    },
    {
      id: 45,
      postalCode: 'CENTRAL',
      countryCode: 'US',
      stateProvinceCode: 'TX',
      city: 'Dallas',
      tripChargeAmount: 10,
      fgsSetupZoneId: 33,
      fgsSetupTaxId: 11,
      isActive: true,
    },
    {
      id: 46,
      postalCode: 'OUTER',
      countryCode: 'US',
      stateProvinceCode: 'TX',
      city: 'Houston',
      tripChargeAmount: 10,
      fgsSetupZoneId: 36,
      fgsSetupTaxId: 11,
      isActive: false,
    },
    {
      id: 47,
      postalCode: 'RURAL',
      countryCode: 'US',
      stateProvinceCode: 'TX',
      city: 'Houston',
      tripChargeAmount: 10,
      fgsSetupZoneId: 37,
      fgsSetupTaxId: 11,
      isActive: false,
    },
  ];
}

const postalCodes = seedPostalCodes();

function toLookup(record: PostalCodeDetailDto): PostalCodeLookupDto {
  return {
    id: record.id,
    postalCode: record.postalCode,
    city: record.city,
  };
}

function findPostalCode(
  id: number | undefined,
): PostalCodeDetailDto | undefined {
  return id === undefined
    ? undefined
    : postalCodes.find((record) => record.id === id);
}

function filterPostalCodes(url: URL): PostalCodeDetailDto[] {
  const isActive = readOptionalBoolean(url, 'isActive');
  const postalCode = url.searchParams.get('postalCode');
  const city = url.searchParams.get('city');
  const state = url.searchParams.get('state');
  const search = url.searchParams.get('search');
  return postalCodes.filter((record) => {
    if (isActive !== undefined && record.isActive !== isActive) return false;
    if (
      postalCode &&
      (record.postalCode ?? '').toLowerCase() !== postalCode.toLowerCase()
    ) {
      return false;
    }
    if (city && !(record.city ?? '').toLowerCase().includes(city.toLowerCase())) {
      return false;
    }
    if (
      state &&
      (record.stateProvinceCode ?? '').toLowerCase() !== state.toLowerCase()
    ) {
      return false;
    }
    return matchesSearch(search, [
      record.postalCode,
      record.city,
      record.stateProvinceCode,
      record.countryCode,
    ]);
  });
}

function summaryFieldsFromWrite(
  body: PostalCodeCreateDto | PostalCodePatchDto,
): Partial<PostalCodeDetailDto> {
  const fields: Partial<PostalCodeDetailDto> = {
    postalCode: body.postalCode,
    countryCode: body.countryCode,
    stateProvinceCode: body.stateProvinceCode,
    city: body.city,
    tripChargeAmount: body.tripChargeAmount,
    fgsSetupZoneId: body.fgsSetupZoneId,
    fgsSetupTaxId: body.fgsSetupTaxId,
  };
  if ('isActive' in body && typeof body.isActive === 'boolean') {
    fields.isActive = body.isActive;
  }
  return fields;
}

function createFromBody(body: PostalCodeCreateDto): PostalCodeDetailDto {
  return {
    id: nextId(postalCodes),
    postalCode: body.postalCode ?? null,
    countryCode: body.countryCode ?? null,
    stateProvinceCode: body.stateProvinceCode ?? null,
    city: body.city ?? null,
    tripChargeAmount: body.tripChargeAmount ?? null,
    fgsSetupZoneId: body.fgsSetupZoneId ?? null,
    fgsSetupTaxId: body.fgsSetupTaxId ?? null,
    isActive: true,
  };
}

function applyWrite(
  record: PostalCodeDetailDto,
  body: PostalCodeCreateDto,
): void {
  assignDefined(record, summaryFieldsFromWrite(body));
}

/**
 * In-memory `/postalcode` catalog. Mutations persist for the session so a
 * follow-up GET after invalidation shows the saved values. Request/response
 * shapes come from `@cms/settings-contract`.
 */
export const postalCodeHandlers = [
  http.get('/api/v1/postalcode/lookup', ({ request }) => {
    const url = new URL(request.url);
    const activeOnly = readOptionalBoolean(url, 'activeOnly') ?? true;
    const items = postalCodes
      .filter((record) => (activeOnly ? record.isActive : true))
      .map(toLookup);
    return setupOk(items);
  }),

  http.get('/api/v1/postalcode/:id', ({ params }) => {
    const record = findPostalCode(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Postal code not found.');
    return setupOk(record);
  }),

  http.get('/api/v1/postalcode', ({ request }) => {
    const url = new URL(request.url);
    return setupOk(pagedResult(filterPostalCodes(url), url));
  }),

  http.post('/api/v1/postalcode', async ({ request }) => {
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = postalCodeCreateDtoSchema.safeParse(body.value);
    if (!parsed.success) return setupError(400, firstIssueMessage(parsed.error));
    const created = createFromBody(parsed.data);
    postalCodes.push(created);
    return setupOk(created, 201);
  }),

  http.put('/api/v1/postalcode/:id', async ({ params, request }) => {
    const record = findPostalCode(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Postal code not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = postalCodeUpdateDtoSchema.safeParse(body.value);
    if (!parsed.success) return setupError(400, firstIssueMessage(parsed.error));
    applyWrite(record, parsed.data);
    return setupOk(record);
  }),

  http.patch('/api/v1/postalcode/:id', async ({ params, request }) => {
    const record = findPostalCode(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Postal code not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = postalCodePatchDtoSchema.safeParse(body.value);
    if (!parsed.success) return setupError(400, firstIssueMessage(parsed.error));
    assignDefined(record, summaryFieldsFromWrite(parsed.data));
    return setupOk(record);
  }),
];
