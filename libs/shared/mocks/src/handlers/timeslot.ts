import { http } from 'msw';
import {
  timeslotCreateDtoSchema,
  timeslotPatchDtoSchema,
  timeslotUpdateDtoSchema,
  type TimeslotCreateDto,
  type TimeslotDetailDto,
  type TimeslotLookupDto,
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

function slot(
  id: number,
  code: string,
  name: string,
  zoneId: number,
  beginTime: string,
  endTime: string,
  lateAfter: string,
  delayedAfter: string,
  isActive = true,
): TimeslotDetailDto {
  return {
    id,
    fgsSetupZoneId: zoneId,
    code,
    name,
    beginTime,
    endTime,
    markTechArrivedLateAfter: lateAfter,
    markWorkOrderDelayedCompletionAfter: delayedAfter,
    isMobileVisible: isActive,
    isCustomerPortalVisible: isActive,
    includeInCapacityPlanning: true,
    showToExternalSystem: true,
    isActive,
  };
}

/** Zone ids match the zone mock: 31 North, 32 South, 35 West, 34 East. */
function seedTimeslots(): TimeslotDetailDto[] {
  return [
    slot(
      201,
      'AM_08_12',
      '8:00 AM – 12:00 PM',
      31,
      '08:00:00',
      '12:00:00',
      '00:15:00',
      '00:30:00',
    ),
    slot(
      202,
      'PM_12_04',
      '12:00 PM – 4:00 PM',
      31,
      '12:00:00',
      '16:00:00',
      '00:15:00',
      '00:30:00',
    ),
    slot(
      203,
      'PM_04_08',
      '4:00 PM – 8:00 PM',
      31,
      '16:00:00',
      '20:00:00',
      '00:15:00',
      '00:30:00',
    ),
    slot(
      204,
      'AM_08_11',
      '8:00 AM – 11:00 AM',
      32,
      '08:00:00',
      '11:00:00',
      '00:10:00',
      '00:20:00',
    ),
    slot(
      205,
      'AM_11_02',
      '11:00 AM – 2:00 PM',
      32,
      '11:00:00',
      '14:00:00',
      '00:10:00',
      '00:20:00',
    ),
    slot(
      206,
      'PM_02_05',
      '2:00 PM – 5:00 PM',
      32,
      '14:00:00',
      '17:00:00',
      '00:15:00',
      '00:30:00',
    ),
    slot(
      207,
      'AM_07_10',
      '7:00 AM – 10:00 AM',
      35,
      '07:00:00',
      '10:00:00',
      '00:15:00',
      '00:30:00',
    ),
    slot(
      208,
      'AM_10_01',
      '10:00 AM – 1:00 PM',
      35,
      '10:00:00',
      '13:00:00',
      '00:15:00',
      '00:30:00',
    ),
    slot(
      209,
      'PM_01_05',
      '1:00 PM – 5:00 PM',
      35,
      '13:00:00',
      '17:00:00',
      '00:15:00',
      '00:30:00',
    ),
    slot(
      210,
      'EV_05_09',
      '5:00 PM – 9:00 PM',
      35,
      '17:00:00',
      '21:00:00',
      '00:15:00',
      '00:30:00',
    ),
    slot(
      211,
      'AM_09_12',
      '9:00 AM – 12:00 PM',
      34,
      '09:00:00',
      '12:00:00',
      '00:15:00',
      '00:30:00',
    ),
    slot(
      212,
      'PM_12_03',
      '12:00 PM – 3:00 PM',
      34,
      '12:00:00',
      '15:00:00',
      '00:15:00',
      '00:30:00',
    ),
    slot(
      213,
      'IN_06_09',
      '6:00 AM – 9:00 AM',
      31,
      '06:00:00',
      '09:00:00',
      '00:15:00',
      '00:30:00',
      false,
    ),
    slot(
      214,
      'IN_03_06',
      '3:00 PM – 6:00 PM',
      32,
      '15:00:00',
      '18:00:00',
      '00:15:00',
      '00:30:00',
      false,
    ),
    slot(
      215,
      'IN_08_11',
      '8:00 PM – 11:00 PM',
      35,
      '20:00:00',
      '23:00:00',
      '00:10:00',
      '00:20:00',
      false,
    ),
    slot(
      216,
      'IN_09_12',
      '9:00 PM – 12:00 AM',
      34,
      '21:00:00',
      '00:00:00',
      '00:15:00',
      '00:30:00',
      false,
    ),
  ];
}

const timeslots = seedTimeslots();

function toLookup(record: TimeslotDetailDto): TimeslotLookupDto {
  return {
    id: record.id,
    code: record.code,
    name: record.name,
  };
}

function findTimeslot(id: number | undefined): TimeslotDetailDto | undefined {
  return id === undefined
    ? undefined
    : timeslots.find((record) => record.id === id);
}

function filterTimeslots(url: URL): TimeslotDetailDto[] {
  const isActive = readOptionalBoolean(url, 'isActive');
  const code = url.searchParams.get('code');
  const name = url.searchParams.get('name');
  const search = url.searchParams.get('search');
  const sortBy = url.searchParams.get('sortBy');
  const direction = url.searchParams.get('sortDirection') === 'desc' ? -1 : 1;
  const filtered = timeslots.filter((record) => {
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
    return matchesSearch(search, [record.code, record.name]);
  });
  if (sortBy !== 'beginTime') return filtered;
  return [...filtered].sort(
    (left, right) => left.beginTime.localeCompare(right.beginTime) * direction,
  );
}

function createFromBody(body: TimeslotCreateDto): TimeslotDetailDto {
  return {
    id: nextId(timeslots),
    fgsSetupZoneId: body.fgsSetupZoneId ?? null,
    code: body.code ?? null,
    name: body.name ?? null,
    beginTime: body.beginTime,
    endTime: body.endTime,
    markTechArrivedLateAfter: body.markTechArrivedLateAfter ?? null,
    markWorkOrderDelayedCompletionAfter:
      body.markWorkOrderDelayedCompletionAfter ?? null,
    isMobileVisible: body.isMobileVisible,
    isCustomerPortalVisible: body.isCustomerPortalVisible,
    includeInCapacityPlanning: body.includeInCapacityPlanning,
    showToExternalSystem: body.showToExternalSystem,
    isActive: true,
  };
}

/**
 * In-memory `/timeslot` catalog. Mutations persist for the session so a
 * follow-up GET after invalidation shows the saved values. Request/response
 * shapes come from `@cms/settings-contract`.
 */
export const timeslotHandlers = [
  http.get('/api/v1/timeslot/lookup', ({ request }) => {
    const url = new URL(request.url);
    const activeOnly = readOptionalBoolean(url, 'activeOnly') ?? true;
    const isMobileVisible = readOptionalBoolean(url, 'isMobileVisible');
    const isCustomerPortalVisible = readOptionalBoolean(
      url,
      'isCustomerPortalVisible',
    );
    const items = timeslots
      .filter((record) => {
        if (activeOnly && !record.isActive) return false;
        if (
          isMobileVisible !== undefined &&
          record.isMobileVisible !== isMobileVisible
        ) {
          return false;
        }
        if (
          isCustomerPortalVisible !== undefined &&
          record.isCustomerPortalVisible !== isCustomerPortalVisible
        ) {
          return false;
        }
        return true;
      })
      .map(toLookup);
    return setupOk(items);
  }),

  http.get('/api/v1/timeslot/:id', ({ params }) => {
    const record = findTimeslot(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Timeslot not found.');
    return setupOk(record);
  }),

  http.put('/api/v1/timeslot/:id', async ({ params, request }) => {
    const record = findTimeslot(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Timeslot not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = timeslotUpdateDtoSchema.safeParse(body.value);
    if (!parsed.success)
      return setupError(400, firstIssueMessage(parsed.error));
    assignDefined(record, parsed.data);
    return setupOk(record);
  }),

  http.patch('/api/v1/timeslot/:id', async ({ params, request }) => {
    const record = findTimeslot(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Timeslot not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = timeslotPatchDtoSchema.safeParse(body.value);
    if (!parsed.success)
      return setupError(400, firstIssueMessage(parsed.error));
    assignDefined(record, parsed.data);
    return setupOk(record);
  }),

  http.get('/api/v1/timeslot', ({ request }) => {
    const url = new URL(request.url);
    return setupOk(pagedResult(filterTimeslots(url), url));
  }),

  http.post('/api/v1/timeslot', async ({ request }) => {
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = timeslotCreateDtoSchema.safeParse(body.value);
    if (!parsed.success)
      return setupError(400, firstIssueMessage(parsed.error));
    const created = createFromBody(parsed.data);
    timeslots.push(created);
    return setupOk(created, 201);
  }),
];
