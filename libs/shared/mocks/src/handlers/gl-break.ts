import { http } from 'msw';
import {
  glBreakCreateDtoSchema,
  glBreakPatchDtoSchema,
  glBreakUpdateDtoSchema,
  type GlBreakAddressDetailDto,
  type GlBreakCreateDto,
  type GlBreakDetailDto,
  type GlBreakLocationWriteDto,
  type GlBreakLookupDto,
  type GlBreakPatchDto,
  type GlBreakSummaryDto,
  type GlBreakTradeDto,
  type GlBreakUpdateDto,
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

const locationAddress = (
  id: string,
  line1: string,
  line2: string | null,
  city: string,
  state: string,
  postalCode: string,
): GlBreakAddressDetailDto => ({
  id,
  addressLine1: line1,
  addressLine2: line2,
  addressLine3: null,
  addressLine4: null,
  city,
  state,
  country: 'US',
  postalCode,
  formattedAddress: [line1, line2, `${city}, ${state} ${postalCode}`]
    .filter(Boolean)
    .join(', '),
  latitude: null,
  longitude: null,
});

function seedGlBreaks(): GlBreakDetailDto[] {
  return [
    {
      id: 61,
      code: 'LOC-1001',
      name: 'Facility Maintenance',
      breakLabel: 'Template 1',
      breakLevel: 1,
      logoFileId: null,
      isActive: true,
      address: locationAddress(
        'aaaaaaaa-bbbb-cccc-dddd-000000000061',
        '124 Oak Street',
        'Suite 78',
        'Industrial City',
        'IL',
        '62701',
      ),
      trades: [
        { id: 601, tradeCode: 'HVAC' },
        { id: 602, tradeCode: 'PLUMB' },
      ],
    },
    {
      id: 62,
      code: 'LOC-1002',
      name: 'Facility Maintenance',
      breakLabel: 'Template 2',
      breakLevel: 1,
      logoFileId: null,
      isActive: true,
      address: locationAddress(
        'aaaaaaaa-bbbb-cccc-dddd-000000000062',
        '124 Oak Street',
        'Suite 78',
        'Industrial City',
        'IL',
        '62701',
      ),
      trades: [{ id: 603, tradeCode: 'ELEC' }],
    },
    {
      id: 63,
      code: 'LOC-1003',
      name: 'Facility Maintenance',
      breakLabel: 'Template 3',
      breakLevel: 1,
      logoFileId: null,
      isActive: true,
      address: locationAddress(
        'aaaaaaaa-bbbb-cccc-dddd-000000000063',
        '500 Pine Avenue',
        null,
        'Springfield',
        'IL',
        '62702',
      ),
      trades: [],
    },
    {
      id: 64,
      code: 'LOC-1004',
      name: 'Warehouse Operations',
      breakLabel: 'Template 1',
      breakLevel: 1,
      logoFileId: null,
      isActive: true,
      address: locationAddress(
        'aaaaaaaa-bbbb-cccc-dddd-000000000064',
        '890 North Drive',
        null,
        'Normal',
        'IL',
        '61761',
      ),
      trades: [],
    },
    {
      id: 65,
      code: 'LOC-1005',
      name: 'Facility Maintenance',
      breakLabel: 'Template 1',
      breakLevel: 1,
      logoFileId: null,
      isActive: true,
      address: locationAddress(
        'aaaaaaaa-bbbb-cccc-dddd-000000000065',
        '75 South Main St.',
        null,
        'Decatur',
        'IL',
        '62523',
      ),
      trades: [],
    },
    {
      id: 66,
      code: 'LOC-1008',
      name: 'Closed Branch',
      breakLabel: 'Template 1',
      breakLevel: 1,
      logoFileId: null,
      isActive: false,
      address: null,
      trades: [],
    },
    {
      id: 67,
      code: 'LOC-1009',
      name: 'Retired Unit',
      breakLabel: 'Template 2',
      breakLevel: 1,
      logoFileId: null,
      isActive: false,
      address: null,
      trades: [],
    },
    {
      id: 71,
      code: 'BR2-2001',
      name: 'North Region',
      breakLabel: 'Template 1',
      breakLevel: 2,
      logoFileId: null,
      isActive: true,
      address: locationAddress(
        'aaaaaaaa-bbbb-cccc-dddd-000000000071',
        '300 Central Plaza',
        null,
        'Champaign',
        'IL',
        '61820',
      ),
      trades: [],
    },
    {
      id: 72,
      code: 'BR2-2002',
      name: 'South Region',
      breakLabel: 'Template 2',
      breakLevel: 2,
      logoFileId: null,
      isActive: true,
      address: locationAddress(
        'aaaaaaaa-bbbb-cccc-dddd-000000000072',
        '10 Market Street',
        null,
        'Peoria',
        'IL',
        '61602',
      ),
      trades: [],
    },
    {
      id: 73,
      code: 'BR2-2003',
      name: 'Service Division',
      breakLabel: 'Template 1',
      breakLevel: 2,
      logoFileId: null,
      isActive: true,
      address: locationAddress(
        'aaaaaaaa-bbbb-cccc-dddd-000000000073',
        '500 Pine Avenue',
        null,
        'Springfield',
        'IL',
        '62702',
      ),
      trades: [],
    },
    {
      id: 74,
      code: 'BR2-2004',
      name: 'Operations',
      breakLabel: 'Template 3',
      breakLevel: 2,
      logoFileId: null,
      isActive: true,
      address: locationAddress(
        'aaaaaaaa-bbbb-cccc-dddd-000000000074',
        '890 North Drive',
        null,
        'Normal',
        'IL',
        '61761',
      ),
      trades: [],
    },
    {
      id: 75,
      code: 'BR2-2005',
      name: 'Field Support',
      breakLabel: 'Template 1',
      breakLevel: 2,
      logoFileId: null,
      isActive: true,
      address: locationAddress(
        'aaaaaaaa-bbbb-cccc-dddd-000000000075',
        '75 South Main St.',
        null,
        'Decatur',
        'IL',
        '62523',
      ),
      trades: [],
    },
    {
      id: 76,
      code: 'BR2-2008',
      name: 'Legacy Division',
      breakLabel: 'Template 1',
      breakLevel: 2,
      logoFileId: null,
      isActive: false,
      address: null,
      trades: [],
    },
    {
      id: 77,
      code: 'BR2-2009',
      name: 'Archived Region',
      breakLabel: 'Template 2',
      breakLevel: 2,
      logoFileId: null,
      isActive: false,
      address: null,
      trades: [],
    },
  ];
}

const glBreaks = seedGlBreaks();

function toSummary(record: GlBreakDetailDto): GlBreakSummaryDto {
  return {
    id: record.id,
    code: record.code,
    name: record.name,
    breakLabel: record.breakLabel,
    breakLevel: record.breakLevel,
    logoFileId: record.logoFileId,
    isActive: record.isActive,
    address: record.address,
  };
}

function toLookup(record: GlBreakDetailDto): GlBreakLookupDto {
  return {
    id: record.id,
    code: record.code,
    name: record.name,
    breakLevel: record.breakLevel,
  };
}

function findGlBreak(id: number | undefined): GlBreakDetailDto | undefined {
  return id === undefined
    ? undefined
    : glBreaks.find((record) => record.id === id);
}

function nextTradeId(): number {
  const trades = glBreaks.flatMap((record) => record.trades ?? []);
  return nextId(trades);
}

function toAddressDetail(
  write: GlBreakLocationWriteDto,
  existingId?: string,
): GlBreakAddressDetailDto {
  return {
    id: existingId ?? `aaaaaaaa-bbbb-cccc-dddd-${String(Date.now()).padStart(12, '0').slice(-12)}`,
    addressLine1: write.addressLine1 ?? null,
    addressLine2: write.addressLine2 ?? null,
    addressLine3: write.addressLine3 ?? null,
    addressLine4: write.addressLine4 ?? null,
    city: write.city ?? null,
    state: write.state ?? null,
    country: write.country ?? null,
    postalCode: write.postalCode ?? null,
    formattedAddress: write.formattedAddress ?? null,
    latitude: write.latitude ?? null,
    longitude: write.longitude ?? null,
  };
}

function toTrades(
  tradeCodes: readonly string[],
  existing: readonly GlBreakTradeDto[] | null | undefined,
): GlBreakTradeDto[] {
  return tradeCodes.map((tradeCode, index) => ({
    id: existing?.[index]?.id ?? nextTradeId() + index,
    tradeCode,
  }));
}

function applyWrite(
  record: GlBreakDetailDto,
  body: GlBreakCreateDto | GlBreakUpdateDto | GlBreakPatchDto,
): void {
  const { address, tradeCodes, ...scalars } = body;
  assignDefined(record, scalars);
  if (address !== undefined) {
    record.address = address
      ? toAddressDetail(address, record.address?.id)
      : null;
  }
  if (tradeCodes !== undefined) {
    record.trades = tradeCodes ? toTrades(tradeCodes, record.trades) : [];
  }
}

function filterGlBreaks(url: URL): GlBreakDetailDto[] {
  const isActive = readOptionalBoolean(url, 'isActive');
  const code = url.searchParams.get('code');
  const name = url.searchParams.get('name');
  const tradeCode = url.searchParams.get('tradeCode');
  const search = url.searchParams.get('search');
  const breakLevelRaw = url.searchParams.get('breakLevel');
  const breakLevel =
    breakLevelRaw === null || breakLevelRaw === ''
      ? undefined
      : Number(breakLevelRaw);
  return glBreaks.filter((record) => {
    if (isActive !== undefined && record.isActive !== isActive) return false;
    if (code && (record.code ?? '').toLowerCase() !== code.toLowerCase()) {
      return false;
    }
    if (name && !(record.name ?? '').toLowerCase().includes(name.toLowerCase())) {
      return false;
    }
    if (breakLevel !== undefined && record.breakLevel !== breakLevel) {
      return false;
    }
    if (
      tradeCode &&
      !(record.trades ?? []).some(
        (trade) => (trade.tradeCode ?? '').toLowerCase() === tradeCode.toLowerCase(),
      )
    ) {
      return false;
    }
    return matchesSearch(search, [record.code, record.name, record.breakLabel]);
  });
}

function createFromBody(body: GlBreakCreateDto): GlBreakDetailDto {
  const record: GlBreakDetailDto = {
    id: nextId(glBreaks),
    code: body.code ?? null,
    name: body.name ?? null,
    breakLabel: body.breakLabel ?? null,
    breakLevel: body.breakLevel,
    logoFileId: body.logoFileId ?? null,
    isActive: true,
    address: null,
    trades: [],
  };
  applyWrite(record, body);
  return record;
}

/**
 * In-memory `/glbreak` catalog. Mutations persist for the session so a
 * follow-up GET after invalidation shows the saved values. Request/response
 * shapes come from `@cms/settings-contract`.
 */
export const glBreakHandlers = [
  http.get('/api/v1/glbreak/lookup', ({ request }) => {
    const url = new URL(request.url);
    const activeOnly = readOptionalBoolean(url, 'activeOnly') ?? true;
    const items = glBreaks
      .filter((record) => (activeOnly ? record.isActive : true))
      .map(toLookup);
    return setupOk(items);
  }),

  http.get('/api/v1/glbreak/:id', ({ params }) => {
    const record = findGlBreak(parseRouteId(params['id']));
    if (!record) return setupError(404, 'GL break not found.');
    return setupOk(record);
  }),

  http.get('/api/v1/glbreak', ({ request }) => {
    const url = new URL(request.url);
    return setupOk(pagedResult(filterGlBreaks(url).map(toSummary), url));
  }),

  http.post('/api/v1/glbreak', async ({ request }) => {
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = glBreakCreateDtoSchema.safeParse(body.value);
    if (!parsed.success) return setupError(400, firstIssueMessage(parsed.error));
    const created = createFromBody(parsed.data);
    glBreaks.push(created);
    return setupOk(created, 201);
  }),

  http.put('/api/v1/glbreak/:id', async ({ params, request }) => {
    const record = findGlBreak(parseRouteId(params['id']));
    if (!record) return setupError(404, 'GL break not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = glBreakUpdateDtoSchema.safeParse(body.value);
    if (!parsed.success) return setupError(400, firstIssueMessage(parsed.error));
    applyWrite(record, parsed.data);
    return setupOk(record);
  }),

  http.patch('/api/v1/glbreak/:id', async ({ params, request }) => {
    const record = findGlBreak(parseRouteId(params['id']));
    if (!record) return setupError(404, 'GL break not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = glBreakPatchDtoSchema.safeParse(body.value);
    if (!parsed.success) return setupError(400, firstIssueMessage(parsed.error));
    applyWrite(record, parsed.data);
    return setupOk(record);
  }),
];
