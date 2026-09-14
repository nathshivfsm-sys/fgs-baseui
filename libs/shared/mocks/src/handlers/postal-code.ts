import { http } from 'msw';
import {
  postalCodeCreateDtoSchema,
  postalCodePatchDtoSchema,
  postalCodeUpdateDtoSchema,
  type PostalCodeCreateDto,
  type PostalCodeDetailDto,
  type PostalCodeLookupDto,
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

const zonesById: Record<number, { code: string; name: string }> = {
  31: { code: 'NORTH', name: 'Harris County -North' },
  32: { code: 'SOUTH', name: 'Harris County -South' },
  34: { code: 'EAST', name: 'Harris County -East' },
  35: { code: 'WEST', name: 'Harris County -West' },
  33: { code: 'CENTRAL', name: 'Harris County -Central' },
  36: { code: 'OUTER', name: 'Outer Zone' },
  37: { code: 'RURAL', name: 'Rural Zone' },
};

const taxesById: Record<number, { taxCode: string; taxRate: number }> = {
  11: { taxCode: 'TX-STD', taxRate: 8.7 },
  12: { taxCode: 'TX-LABOR', taxRate: 6.2 },
  13: { taxCode: 'TX-EXEMPT', taxRate: 0 },
};

function seedPostalCodes(): PostalCodeDetailDto[] {
  return [
    {
      id: 41,
      postalCode: 'NORTH',
      city: 'Houston',
      state: 'TX',
      fgsSetupZoneId: 31,
      zoneCode: 'NORTH',
      zoneName: 'Harris County -North',
      fgsSetupTaxId: 11,
      taxCode: 'TX-STD',
      taxRate: 8.7,
      tripCharge: 10,
      isActive: true,
    },
    {
      id: 42,
      postalCode: 'SOUTH',
      city: 'Houston',
      state: 'TX',
      fgsSetupZoneId: 32,
      zoneCode: 'SOUTH',
      zoneName: 'Harris County -South',
      fgsSetupTaxId: 12,
      taxCode: 'TX-LABOR',
      taxRate: 6.2,
      tripCharge: 10,
      isActive: true,
    },
    {
      id: 43,
      postalCode: 'EAST',
      city: 'Dallas',
      state: 'TX',
      fgsSetupZoneId: 34,
      zoneCode: 'EAST',
      zoneName: 'Harris County -East',
      fgsSetupTaxId: 11,
      taxCode: 'TX-STD',
      taxRate: 8.7,
      tripCharge: 10,
      isActive: true,
    },
    {
      id: 44,
      postalCode: 'WEST',
      city: 'Chicago',
      state: 'TX',
      fgsSetupZoneId: 35,
      zoneCode: 'WEST',
      zoneName: 'Harris County -West',
      fgsSetupTaxId: 11,
      taxCode: 'TX-STD',
      taxRate: 8.7,
      tripCharge: 10,
      isActive: true,
    },
    {
      id: 45,
      postalCode: 'CENTRAL',
      city: 'Dallas',
      state: 'TX',
      fgsSetupZoneId: 33,
      zoneCode: 'CENTRAL',
      zoneName: 'Harris County -Central',
      fgsSetupTaxId: 11,
      taxCode: 'TX-STD',
      taxRate: 8.7,
      tripCharge: 10,
      isActive: true,
    },
    {
      id: 46,
      postalCode: 'OUTER',
      city: 'Houston',
      state: 'TX',
      fgsSetupZoneId: 36,
      zoneCode: 'OUTER',
      zoneName: 'Outer Zone',
      fgsSetupTaxId: 11,
      taxCode: 'TX-STD',
      taxRate: 8.7,
      tripCharge: 10,
      isActive: false,
    },
    {
      id: 47,
      postalCode: 'RURAL',
      city: 'Houston',
      state: 'TX',
      fgsSetupZoneId: 37,
      zoneCode: 'RURAL',
      zoneName: 'Rural Zone',
      fgsSetupTaxId: 11,
      taxCode: 'TX-STD',
      taxRate: 8.7,
      tripCharge: 10,
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
      (record.state ?? '').toLowerCase() !== state.toLowerCase()
    ) {
      return false;
    }
    return matchesSearch(search, [
      record.postalCode,
      record.city,
      record.state,
      record.zoneName,
      record.taxCode,
    ]);
  });
}

function denormalizedFromIds(
  fgsSetupZoneId: number | null | undefined,
  fgsSetupTaxId: number | null | undefined,
) {
  const zone =
    fgsSetupZoneId == null ? undefined : zonesById[fgsSetupZoneId];
  const tax = fgsSetupTaxId == null ? undefined : taxesById[fgsSetupTaxId];
  return {
    zoneCode: zone?.code ?? null,
    zoneName: zone?.name ?? null,
    taxCode: tax?.taxCode ?? null,
    taxRate: tax?.taxRate ?? null,
  };
}

function createFromBody(body: PostalCodeCreateDto): PostalCodeDetailDto {
  const linked = denormalizedFromIds(body.fgsSetupZoneId, body.fgsSetupTaxId);
  return {
    id: nextId(postalCodes),
    postalCode: body.postalCode ?? null,
    city: body.city ?? null,
    state: body.state ?? null,
    fgsSetupZoneId: body.fgsSetupZoneId ?? null,
    zoneCode: linked.zoneCode,
    zoneName: linked.zoneName,
    fgsSetupTaxId: body.fgsSetupTaxId ?? null,
    taxCode: linked.taxCode,
    taxRate: linked.taxRate,
    tripCharge: body.tripCharge ?? null,
    isActive: true,
  };
}

function applyWrite(
  record: PostalCodeDetailDto,
  body: PostalCodeCreateDto,
): void {
  assignDefined(record, body);
  Object.assign(
    record,
    denormalizedFromIds(record.fgsSetupZoneId, record.fgsSetupTaxId),
  );
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
    assignDefined(record, parsed.data);
    Object.assign(
      record,
      denormalizedFromIds(record.fgsSetupZoneId, record.fgsSetupTaxId),
    );
    return setupOk(record);
  }),
];
