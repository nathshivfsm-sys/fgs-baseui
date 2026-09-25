import { http } from 'msw';
import {
  businessTypeCreateDtoSchema,
  businessTypePatchDtoSchema,
  businessTypeUpdateDtoSchema,
  type BusinessTypeCreateDto,
  type BusinessTypeDetailDto,
  type BusinessTypeLookupDto,
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

function seedBusinessTypes(): BusinessTypeDetailDto[] {
  return [
    {
      id: 71,
      code: 'HVAC',
      name: 'HVAC',
      description: 'Heating and cooling',
      displayOrder: 1,
      isActive: true,
    },
    {
      id: 72,
      code: 'PLMB',
      name: 'Plumbing',
      description: 'Pipes and fixtures',
      displayOrder: 2,
      isActive: true,
    },
    {
      id: 73,
      code: 'PEST',
      name: 'Pest Control',
      description: 'Pest inspection and treatment',
      displayOrder: 3,
      isActive: true,
    },
    {
      id: 74,
      code: 'ELEC',
      name: 'Electrical',
      description: 'Electrical service',
      displayOrder: 4,
      isActive: true,
    },
    {
      id: 75,
      code: 'CLEAN',
      name: 'Home Cleaning',
      description: 'Residential cleaning',
      displayOrder: 5,
      isActive: true,
    },
    {
      id: 76,
      code: 'JUNK',
      name: 'Junk Removal',
      description: 'Haul-away and cleanup',
      displayOrder: 6,
      isActive: true,
    },
    {
      id: 77,
      code: 'GARDEN',
      name: 'Garden Management',
      description: 'Lawn and garden (not yet enabled)',
      displayOrder: 7,
      isActive: false,
    },
  ];
}

const businessTypes = seedBusinessTypes();

function toLookup(record: BusinessTypeDetailDto): BusinessTypeLookupDto {
  return {
    id: record.id,
    code: record.code,
    name: record.name,
    displayOrder: record.displayOrder,
  };
}

function findBusinessType(
  id: number | undefined,
): BusinessTypeDetailDto | undefined {
  return id === undefined
    ? undefined
    : businessTypes.find((record) => record.id === id);
}

function filterBusinessTypes(url: URL): BusinessTypeDetailDto[] {
  const isActive = readOptionalBoolean(url, 'isActive');
  const code = url.searchParams.get('code');
  const name = url.searchParams.get('name');
  const search = url.searchParams.get('search');
  return businessTypes.filter((record) => {
    if (isActive !== undefined && record.isActive !== isActive) return false;
    if (code && (record.code ?? '').toLowerCase() !== code.toLowerCase()) {
      return false;
    }
    if (
      name &&
      !(record.name ?? '').toLowerCase().includes(name.toLowerCase())
    ) {
      return false;
    }
    return matchesSearch(search, [record.code, record.name, record.description]);
  });
}

function createFromBody(body: BusinessTypeCreateDto): BusinessTypeDetailDto {
  return {
    id: nextId(businessTypes),
    code: body.code ?? null,
    name: body.name ?? null,
    description: body.description ?? null,
    displayOrder: body.displayOrder ?? null,
    isActive: true,
  };
}

/**
 * In-memory `/businesstype` catalog. Mutations persist for the session so a
 * follow-up GET after invalidation shows the saved values. Request/response
 * shapes come from `@cms/settings-contract`.
 */
export const businessTypeHandlers = [
  http.get('/api/v1/businesstype/lookup', ({ request }) => {
    const url = new URL(request.url);
    const activeOnly = readOptionalBoolean(url, 'activeOnly') ?? true;
    const items = businessTypes
      .filter((record) => (activeOnly ? record.isActive : true))
      .map(toLookup);
    return setupOk(items);
  }),

  http.get('/api/v1/businesstype/:id', ({ params }) => {
    const record = findBusinessType(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Business type not found.');
    return setupOk(record);
  }),

  http.put('/api/v1/businesstype/:id', async ({ params, request }) => {
    const record = findBusinessType(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Business type not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = businessTypeUpdateDtoSchema.safeParse(body.value);
    if (!parsed.success) return setupError(400, firstIssueMessage(parsed.error));
    assignDefined(record, parsed.data);
    return setupOk(record);
  }),

  http.patch('/api/v1/businesstype/:id', async ({ params, request }) => {
    const record = findBusinessType(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Business type not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = businessTypePatchDtoSchema.safeParse(body.value);
    if (!parsed.success) return setupError(400, firstIssueMessage(parsed.error));
    assignDefined(record, parsed.data);
    return setupOk(record);
  }),

  http.get('/api/v1/businesstype', ({ request }) => {
    const url = new URL(request.url);
    return setupOk(pagedResult(filterBusinessTypes(url), url));
  }),

  http.post('/api/v1/businesstype', async ({ request }) => {
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = businessTypeCreateDtoSchema.safeParse(body.value);
    if (!parsed.success) return setupError(400, firstIssueMessage(parsed.error));
    const created = createFromBody(parsed.data);
    businessTypes.push(created);
    return setupOk(created, 201);
  }),
];
