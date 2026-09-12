import { http } from 'msw';
import {
  zoneCreateDtoSchema,
  zonePatchDtoSchema,
  zoneUpdateDtoSchema,
  type ZoneCreateDto,
  type ZoneDetailDto,
  type ZoneLookupDto,
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

function seedZones(): ZoneDetailDto[] {
  return [
    {
      id: 31,
      code: 'NORTH',
      name: 'North Zone',
      description: 'Harris County -North',
      isActive: true,
    },
    {
      id: 32,
      code: 'SOUTH',
      name: 'South Zone',
      description: 'Harris County -South',
      isActive: true,
    },
    {
      id: 34,
      code: 'EAST',
      name: 'East Zone',
      description: 'Harris County -East',
      isActive: true,
    },
    {
      id: 35,
      code: 'WEST',
      name: 'West Zone',
      description: 'Harris County -West',
      isActive: true,
    },
    {
      id: 33,
      code: 'CENTRAL',
      name: 'Central Zone',
      description: 'Harris County -Central',
      isActive: true,
    },
    {
      id: 36,
      code: 'OUTER',
      name: 'Outer Zone',
      description: 'Outer-ring coverage',
      isActive: false,
    },
    {
      id: 37,
      code: 'RURAL',
      name: 'Rural Zone',
      description: 'Rural coverage',
      isActive: false,
    },
  ];
}

const zones = seedZones();

function toLookup(record: ZoneDetailDto): ZoneLookupDto {
  return {
    id: record.id,
    code: record.code,
    name: record.name,
  };
}

function findZone(id: number | undefined): ZoneDetailDto | undefined {
  return id === undefined ? undefined : zones.find((record) => record.id === id);
}

function filterZones(url: URL): ZoneDetailDto[] {
  const isActive = readOptionalBoolean(url, 'isActive');
  const code = url.searchParams.get('code');
  const name = url.searchParams.get('name');
  const search = url.searchParams.get('search');
  return zones.filter((record) => {
    if (isActive !== undefined && record.isActive !== isActive) return false;
    if (code && (record.code ?? '').toLowerCase() !== code.toLowerCase()) {
      return false;
    }
    if (name && !(record.name ?? '').toLowerCase().includes(name.toLowerCase())) {
      return false;
    }
    return matchesSearch(search, [record.code, record.name, record.description]);
  });
}

function createFromBody(body: ZoneCreateDto): ZoneDetailDto {
  return {
    id: nextId(zones),
    code: body.code ?? null,
    name: body.name ?? null,
    description: body.description ?? null,
    isActive: true,
  };
}

/**
 * In-memory `/zone` catalog. Mutations persist for the session so a follow-up
 * GET after invalidation shows the saved values. Request/response shapes come
 * from `@cms/settings-contract`.
 */
export const zoneHandlers = [
  http.get('/api/v1/zone/lookup', ({ request }) => {
    const url = new URL(request.url);
    const activeOnly = readOptionalBoolean(url, 'activeOnly') ?? true;
    const items = zones
      .filter((record) => (activeOnly ? record.isActive : true))
      .map(toLookup);
    return setupOk(items);
  }),

  http.get('/api/v1/zone/:id', ({ params }) => {
    const record = findZone(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Zone not found.');
    return setupOk(record);
  }),

  http.get('/api/v1/zone', ({ request }) => {
    const url = new URL(request.url);
    return setupOk(pagedResult(filterZones(url), url));
  }),

  http.post('/api/v1/zone', async ({ request }) => {
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = zoneCreateDtoSchema.safeParse(body.value);
    if (!parsed.success) return setupError(400, firstIssueMessage(parsed.error));
    const created = createFromBody(parsed.data);
    zones.push(created);
    return setupOk(created, 201);
  }),

  http.put('/api/v1/zone/:id', async ({ params, request }) => {
    const record = findZone(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Zone not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = zoneUpdateDtoSchema.safeParse(body.value);
    if (!parsed.success) return setupError(400, firstIssueMessage(parsed.error));
    assignDefined(record, parsed.data);
    return setupOk(record);
  }),

  http.patch('/api/v1/zone/:id', async ({ params, request }) => {
    const record = findZone(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Zone not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = zonePatchDtoSchema.safeParse(body.value);
    if (!parsed.success) return setupError(400, firstIssueMessage(parsed.error));
    assignDefined(record, parsed.data);
    return setupOk(record);
  }),
];
