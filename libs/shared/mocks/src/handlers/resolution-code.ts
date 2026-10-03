import { http } from 'msw';
import {
  resolutionCodeCreateDtoSchema,
  resolutionCodePatchDtoSchema,
  resolutionCodeUpdateDtoSchema,
  type ResolutionCodeCreateDto,
  type ResolutionCodeDetailDto,
  type ResolutionCodeLookupDto,
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

function code(
  id: number,
  typeId: number,
  resolutionCode: string,
  resolutionName: string,
  isMobileVisible = true,
  isActive = true,
): ResolutionCodeDetailDto {
  return {
    id,
    gloResolutionTypeId: typeId,
    resolutionCode,
    resolutionName,
    isMobileVisible,
    isActive,
  };
}

/** Type ids: 1 Complete, 2 Part Ordered, 3 Not Home, 4 General Resolution, 5 Incomplete, 6 Technical Resolution. */
function seedResolutionCodes(): ResolutionCodeDetailDto[] {
  return [
    code(301, 6, 'FIXED', 'Problem Fixed'),
    code(302, 1, 'COMPLETE', 'Completed Successfully'),
    code(303, 2, 'PARTS_REPLACED', 'Parts Replaced'),
    code(304, 4, 'ADJUSTED', 'Adjusted'),
    code(305, 3, 'NOT_HOME', 'Customer Not Home', false),
    code(306, 4, 'NOT_ISSUE', 'No Issue Found'),
    code(307, 5, 'INCOMPLETE', 'Incomplete - Return Visit'),
    code(308, 2, 'PART_ORDERED', 'Part Ordered'),
    code(309, 6, 'CLEANED', 'Cleaned and Serviced'),
    code(310, 4, 'REFERRED', 'Referred to Specialist', false),
    code(311, 1, 'INSTALLED', 'Installation Complete'),
    code(312, 6, 'CALIBRATED', 'Calibrated'),
    code(313, 3, 'NO_ACCESS', 'No Access', false, false),
    code(314, 5, 'CANCELLED', 'Cancelled by Customer', false, false),
    code(315, 4, 'DUPLICATE', 'Duplicate Request', false, false),
  ];
}

const resolutionCodes = seedResolutionCodes();

function toLookup(record: ResolutionCodeDetailDto): ResolutionCodeLookupDto {
  return {
    id: record.id,
    resolutionCode: record.resolutionCode,
    resolutionName: record.resolutionName,
  };
}

function findResolutionCode(
  id: number | undefined,
): ResolutionCodeDetailDto | undefined {
  return id === undefined
    ? undefined
    : resolutionCodes.find((record) => record.id === id);
}

function filterResolutionCodes(url: URL): ResolutionCodeDetailDto[] {
  const isActive = readOptionalBoolean(url, 'isActive');
  const resolutionCode = url.searchParams.get('resolutionCode');
  const resolutionName = url.searchParams.get('resolutionName');
  const search = url.searchParams.get('search');
  return resolutionCodes.filter((record) => {
    if (isActive !== undefined && record.isActive !== isActive) return false;
    if (
      resolutionCode &&
      (record.resolutionCode ?? '').toLowerCase() !==
        resolutionCode.toLowerCase()
    ) {
      return false;
    }
    if (
      resolutionName &&
      !(record.resolutionName ?? '')
        .toLowerCase()
        .includes(resolutionName.toLowerCase())
    ) {
      return false;
    }
    return matchesSearch(search, [
      record.resolutionCode,
      record.resolutionName,
    ]);
  });
}

function createFromBody(
  body: ResolutionCodeCreateDto,
): ResolutionCodeDetailDto {
  return {
    id: nextId(resolutionCodes),
    gloResolutionTypeId: body.gloResolutionTypeId,
    resolutionCode: body.resolutionCode ?? null,
    resolutionName: body.resolutionName ?? null,
    isMobileVisible: body.isMobileVisible,
    isActive: true,
  };
}

/**
 * In-memory `/resolutioncode` catalog. Mutations persist for the session so a
 * follow-up GET after invalidation shows the saved values. Request/response
 * shapes come from `@cms/settings-contract`.
 */
export const resolutionCodeHandlers = [
  http.get('/api/v1/resolutioncode/lookup', ({ request }) => {
    const url = new URL(request.url);
    const activeOnly = readOptionalBoolean(url, 'activeOnly') ?? true;
    const isMobileVisible = readOptionalBoolean(url, 'isMobileVisible');
    const items = resolutionCodes
      .filter((record) => {
        if (activeOnly && !record.isActive) return false;
        if (
          isMobileVisible !== undefined &&
          record.isMobileVisible !== isMobileVisible
        ) {
          return false;
        }
        return true;
      })
      .map(toLookup);
    return setupOk(items);
  }),

  http.get('/api/v1/resolutioncode/:id', ({ params }) => {
    const record = findResolutionCode(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Resolution code not found.');
    return setupOk(record);
  }),

  http.put('/api/v1/resolutioncode/:id', async ({ params, request }) => {
    const record = findResolutionCode(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Resolution code not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = resolutionCodeUpdateDtoSchema.safeParse(body.value);
    if (!parsed.success)
      return setupError(400, firstIssueMessage(parsed.error));
    assignDefined(record, parsed.data);
    return setupOk(record);
  }),

  http.patch('/api/v1/resolutioncode/:id', async ({ params, request }) => {
    const record = findResolutionCode(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Resolution code not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = resolutionCodePatchDtoSchema.safeParse(body.value);
    if (!parsed.success)
      return setupError(400, firstIssueMessage(parsed.error));
    assignDefined(record, parsed.data);
    return setupOk(record);
  }),

  http.get('/api/v1/resolutioncode', ({ request }) => {
    const url = new URL(request.url);
    return setupOk(pagedResult(filterResolutionCodes(url), url));
  }),

  http.post('/api/v1/resolutioncode', async ({ request }) => {
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = resolutionCodeCreateDtoSchema.safeParse(body.value);
    if (!parsed.success)
      return setupError(400, firstIssueMessage(parsed.error));
    const created = createFromBody(parsed.data);
    resolutionCodes.push(created);
    return setupOk(created, 201);
  }),
];
