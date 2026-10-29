import { http } from 'msw';
import {
  paymentTermCreateDtoSchema,
  paymentTermPatchDtoSchema,
  paymentTermUpdateDtoSchema,
  type PaymentTermCreateDto,
  type PaymentTermDetailDto,
  type PaymentTermLookupDto,
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

function seedPaymentTerms(): PaymentTermDetailDto[] {
  return [
    {
      id: 701,
      name: 'Due on Receipt',
      dueDateMethod: 'DueOnReceipt',
      numberOfDays: 0,
      isAccountsReceivable: true,
      isAccountsPayable: false,
      isMobileVisible: true,
      isActive: true,
    },
    {
      id: 702,
      name: 'Net 15',
      dueDateMethod: 'NetDays',
      numberOfDays: 15,
      isAccountsReceivable: true,
      isAccountsPayable: true,
      isMobileVisible: true,
      isActive: true,
    },
    {
      id: 703,
      name: 'Net 30',
      dueDateMethod: 'NetDays',
      numberOfDays: 30,
      isAccountsReceivable: true,
      isAccountsPayable: true,
      isMobileVisible: true,
      isActive: true,
    },
    {
      id: 704,
      name: 'Net 60',
      dueDateMethod: 'NetDays',
      numberOfDays: 60,
      isAccountsReceivable: true,
      isAccountsPayable: false,
      isMobileVisible: false,
      isActive: true,
    },
    {
      id: 705,
      name: 'Legacy COD',
      dueDateMethod: 'DueOnReceipt',
      numberOfDays: null,
      isAccountsReceivable: false,
      isAccountsPayable: false,
      isMobileVisible: false,
      isActive: false,
    },
  ];
}

const paymentTerms = seedPaymentTerms();

function toLookup(record: PaymentTermDetailDto): PaymentTermLookupDto {
  return {
    id: record.id,
    name: record.name,
  };
}

function findPaymentTerm(
  id: number | undefined,
): PaymentTermDetailDto | undefined {
  return id === undefined
    ? undefined
    : paymentTerms.find((record) => record.id === id);
}

function filterPaymentTerms(url: URL): PaymentTermDetailDto[] {
  const isActive = readOptionalBoolean(url, 'isActive');
  const name = url.searchParams.get('name');
  const search = url.searchParams.get('search');
  return paymentTerms.filter((record) => {
    if (isActive !== undefined && record.isActive !== isActive) return false;
    if (
      name &&
      !(record.name ?? '').toLowerCase().includes(name.toLowerCase())
    ) {
      return false;
    }
    return matchesSearch(search, [record.name, record.dueDateMethod]);
  });
}

function createFromBody(body: PaymentTermCreateDto): PaymentTermDetailDto {
  return {
    id: nextId(paymentTerms),
    name: body.name ?? null,
    dueDateMethod: body.dueDateMethod ?? null,
    numberOfDays: body.numberOfDays ?? null,
    isAccountsReceivable: body.isAccountsReceivable,
    isAccountsPayable: body.isAccountsPayable,
    isMobileVisible: body.isMobileVisible,
    isActive: true,
  };
}

/**
 * In-memory `/paymentterm` catalog. Mutations persist for the session so a
 * follow-up GET after invalidation shows the saved values. Request/response
 * shapes come from `@cms/settings-contract`.
 */
export const paymentTermHandlers = [
  http.get('/api/v1/paymentterm/lookup', ({ request }) => {
    const url = new URL(request.url);
    const activeOnly = readOptionalBoolean(url, 'activeOnly') ?? true;
    const items = paymentTerms
      .filter((record) => (activeOnly ? record.isActive : true))
      .map(toLookup);
    return setupOk(items);
  }),

  http.get('/api/v1/paymentterm/:id', ({ params }) => {
    const record = findPaymentTerm(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Payment term not found.');
    return setupOk(record);
  }),

  http.put('/api/v1/paymentterm/:id', async ({ params, request }) => {
    const record = findPaymentTerm(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Payment term not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = paymentTermUpdateDtoSchema.safeParse(body.value);
    if (!parsed.success)
      return setupError(400, firstIssueMessage(parsed.error));
    assignDefined(record, parsed.data);
    return setupOk(record);
  }),

  http.patch('/api/v1/paymentterm/:id', async ({ params, request }) => {
    const record = findPaymentTerm(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Payment term not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = paymentTermPatchDtoSchema.safeParse(body.value);
    if (!parsed.success)
      return setupError(400, firstIssueMessage(parsed.error));
    assignDefined(record, parsed.data);
    return setupOk(record);
  }),

  http.get('/api/v1/paymentterm', ({ request }) => {
    const url = new URL(request.url);
    return setupOk(pagedResult(filterPaymentTerms(url), url));
  }),

  http.post('/api/v1/paymentterm', async ({ request }) => {
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = paymentTermCreateDtoSchema.safeParse(body.value);
    if (!parsed.success)
      return setupError(400, firstIssueMessage(parsed.error));
    const created = createFromBody(parsed.data);
    paymentTerms.push(created);
    return setupOk(created, 201);
  }),
];
