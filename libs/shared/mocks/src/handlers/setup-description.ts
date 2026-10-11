import { http } from 'msw';
import {
  setupDescriptionCreateDtoSchema,
  setupDescriptionPatchDtoSchema,
  setupDescriptionUpdateDtoSchema,
  type SetupDescriptionCreateDto,
  type SetupDescriptionDetailDto,
  type SetupDescriptionLookupDto,
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

function record(
  id: number,
  descriptionTypeCode: string,
  shortNote: string,
  body: string,
  sortOrder: number,
  fgsSetupTechTradeId: number | null = null,
  isActive = true,
): SetupDescriptionDetailDto {
  return {
    id,
    descriptionTypeCode,
    shortNote,
    body,
    fgsSetupTechTradeId,
    sortOrder,
    isActive,
  };
}

function seedSetupDescriptions(): SetupDescriptionDetailDto[] {
  return [
    record(
      501,
      'REASON_FOR_CALL',
      'No power',
      'Customer reported complete loss of power.',
      1,
      12,
    ),
    record(
      502,
      'REASON_FOR_CALL',
      'Not cooling',
      'Air conditioning is running but not cooling the space.',
      2,
      12,
    ),
    record(
      503,
      'WORK_DESCRIPTION',
      'Preventive maintenance',
      'Performed system inspection and diagnostics.',
      1,
      12,
    ),
    record(
      504,
      'WORK_DESCRIPTION',
      'Filter replacement',
      'Replaced air filters and verified airflow.',
      2,
      12,
    ),
    record(
      505,
      'CANCELLATION_REASON',
      'Customer rescheduled',
      'Customer requested to reschedule the appointment.',
      1,
    ),
    record(
      506,
      'LEAD_DISQUALIFICATION',
      'Out of service area',
      'Lead location is outside the company service territory.',
      1,
      null,
      false,
    ),
  ];
}

const setupDescriptions = seedSetupDescriptions();

function toLookup(item: SetupDescriptionDetailDto): SetupDescriptionLookupDto {
  return {
    id: item.id,
    descriptionTypeCode: item.descriptionTypeCode,
    body: item.body,
    sortOrder: item.sortOrder,
  };
}

function findSetupDescription(
  id: number | undefined,
): SetupDescriptionDetailDto | undefined {
  return id === undefined
    ? undefined
    : setupDescriptions.find((item) => item.id === id);
}

function filterSetupDescriptions(url: URL): SetupDescriptionDetailDto[] {
  const isActive = readOptionalBoolean(url, 'isActive');
  const descriptionTypeCode = url.searchParams.get('descriptionTypeCode');
  const search = url.searchParams.get('search');
  return setupDescriptions.filter((item) => {
    if (isActive !== undefined && item.isActive !== isActive) return false;
    if (
      descriptionTypeCode &&
      (item.descriptionTypeCode ?? '').toLowerCase() !==
        descriptionTypeCode.toLowerCase()
    ) {
      return false;
    }
    return matchesSearch(search, [
      item.descriptionTypeCode,
      item.shortNote,
      item.body,
    ]);
  });
}

function createFromBody(
  body: SetupDescriptionCreateDto,
): SetupDescriptionDetailDto {
  return {
    id: nextId(setupDescriptions),
    descriptionTypeCode: body.descriptionTypeCode ?? null,
    shortNote: body.shortNote ?? null,
    body: body.body ?? null,
    fgsSetupTechTradeId: body.fgsSetupTechTradeId ?? null,
    sortOrder: body.sortOrder,
    isActive: true,
  };
}

/**
 * In-memory `/setupdescription` catalog. Mutations persist for the session so a
 * follow-up GET after invalidation shows the saved values. Request/response
 * shapes come from `@cms/settings-contract`.
 */
export const setupDescriptionHandlers = [
  http.get('/api/v1/setupdescription/lookup', ({ request }) => {
    const url = new URL(request.url);
    const activeOnly = readOptionalBoolean(url, 'activeOnly') ?? true;
    const items = setupDescriptions
      .filter((item) => !activeOnly || item.isActive)
      .map(toLookup);
    return setupOk(items);
  }),

  http.get('/api/v1/setupdescription/:id', ({ params }) => {
    const item = findSetupDescription(parseRouteId(params['id']));
    if (!item) return setupError(404, 'Setup description not found.');
    return setupOk(item);
  }),

  http.put('/api/v1/setupdescription/:id', async ({ params, request }) => {
    const item = findSetupDescription(parseRouteId(params['id']));
    if (!item) return setupError(404, 'Setup description not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = setupDescriptionUpdateDtoSchema.safeParse(body.value);
    if (!parsed.success)
      return setupError(400, firstIssueMessage(parsed.error));
    assignDefined(item, parsed.data);
    return setupOk(item);
  }),

  http.patch('/api/v1/setupdescription/:id', async ({ params, request }) => {
    const item = findSetupDescription(parseRouteId(params['id']));
    if (!item) return setupError(404, 'Setup description not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = setupDescriptionPatchDtoSchema.safeParse(body.value);
    if (!parsed.success)
      return setupError(400, firstIssueMessage(parsed.error));
    assignDefined(item, parsed.data);
    return setupOk(item);
  }),

  http.get('/api/v1/setupdescription', ({ request }) => {
    const url = new URL(request.url);
    return setupOk(pagedResult(filterSetupDescriptions(url), url));
  }),

  http.post('/api/v1/setupdescription', async ({ request }) => {
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = setupDescriptionCreateDtoSchema.safeParse(body.value);
    if (!parsed.success)
      return setupError(400, firstIssueMessage(parsed.error));
    const created = createFromBody(parsed.data);
    setupDescriptions.push(created);
    return setupOk(created, 201);
  }),
];
