import { http } from 'msw';
import {
  nonWorkingDateCreateDtoSchema,
  nonWorkingDatePatchDtoSchema,
  nonWorkingDateUpdateDtoSchema,
  type NonWorkingDateCreateDto,
  type NonWorkingDateDetailDto,
  type NonWorkingDateLookupDto,
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

function seedNonWorkingDates(): NonWorkingDateDetailDto[] {
  return [
    {
      id: 41,
      nonWorkingDate: '2025-01-01',
      name: "New Year's Day",
      isActive: true,
    },
    {
      id: 42,
      nonWorkingDate: '2025-05-26',
      name: 'Memorial Day',
      isActive: true,
    },
    {
      id: 43,
      nonWorkingDate: '2025-07-04',
      name: 'Independence Day',
      isActive: true,
    },
    {
      id: 44,
      nonWorkingDate: '2025-09-01',
      name: 'Labor Day',
      isActive: true,
    },
    {
      id: 45,
      nonWorkingDate: '2025-11-27',
      name: 'Thanksgiving Day',
      isActive: true,
    },
    {
      id: 46,
      nonWorkingDate: '2025-12-25',
      name: 'Christmas Day',
      isActive: false,
    },
  ];
}

const nonWorkingDates = seedNonWorkingDates();

function toLookup(record: NonWorkingDateDetailDto): NonWorkingDateLookupDto {
  return {
    id: record.id,
    nonWorkingDate: record.nonWorkingDate,
    name: record.name,
  };
}

function findNonWorkingDate(
  id: number | undefined,
): NonWorkingDateDetailDto | undefined {
  return id === undefined
    ? undefined
    : nonWorkingDates.find((record) => record.id === id);
}

function filterNonWorkingDates(url: URL): NonWorkingDateDetailDto[] {
  const isActive = readOptionalBoolean(url, 'isActive');
  const nonWorkingDate = url.searchParams.get('nonWorkingDate');
  const name = url.searchParams.get('name');
  const search = url.searchParams.get('search');
  return nonWorkingDates.filter((record) => {
    if (isActive !== undefined && record.isActive !== isActive) return false;
    if (nonWorkingDate && record.nonWorkingDate !== nonWorkingDate) {
      return false;
    }
    if (name && !(record.name ?? '').toLowerCase().includes(name.toLowerCase())) {
      return false;
    }
    return matchesSearch(search, [record.nonWorkingDate, record.name]);
  });
}

function createFromBody(body: NonWorkingDateCreateDto): NonWorkingDateDetailDto {
  return {
    id: nextId(nonWorkingDates),
    nonWorkingDate: body.nonWorkingDate,
    name: body.name ?? null,
    isActive: true,
  };
}

/**
 * In-memory `/nonworkingdate` catalog. Mutations persist for the session so a
 * follow-up GET after invalidation shows the saved values. Request/response
 * shapes come from `@cms/settings-contract`.
 */
export const nonWorkingDateHandlers = [
  http.get('/api/v1/nonworkingdate/lookup', ({ request }) => {
    const url = new URL(request.url);
    const activeOnly = readOptionalBoolean(url, 'activeOnly') ?? true;
    const items = nonWorkingDates
      .filter((record) => (activeOnly ? record.isActive : true))
      .map(toLookup);
    return setupOk(items);
  }),

  http.get('/api/v1/nonworkingdate/:id', ({ params }) => {
    const record = findNonWorkingDate(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Non-working date not found.');
    return setupOk(record);
  }),

  http.get('/api/v1/nonworkingdate', ({ request }) => {
    const url = new URL(request.url);
    return setupOk(pagedResult(filterNonWorkingDates(url), url));
  }),

  http.post('/api/v1/nonworkingdate', async ({ request }) => {
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = nonWorkingDateCreateDtoSchema.safeParse(body.value);
    if (!parsed.success) return setupError(400, firstIssueMessage(parsed.error));
    const created = createFromBody(parsed.data);
    nonWorkingDates.push(created);
    return setupOk(created, 201);
  }),

  http.put('/api/v1/nonworkingdate/:id', async ({ params, request }) => {
    const record = findNonWorkingDate(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Non-working date not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = nonWorkingDateUpdateDtoSchema.safeParse(body.value);
    if (!parsed.success) return setupError(400, firstIssueMessage(parsed.error));
    assignDefined(record, parsed.data);
    return setupOk(record);
  }),

  http.patch('/api/v1/nonworkingdate/:id', async ({ params, request }) => {
    const record = findNonWorkingDate(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Non-working date not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = nonWorkingDatePatchDtoSchema.safeParse(body.value);
    if (!parsed.success) return setupError(400, firstIssueMessage(parsed.error));
    assignDefined(record, parsed.data);
    return setupOk(record);
  }),
];
