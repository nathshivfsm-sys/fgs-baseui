import { http } from 'msw';
import {
  paymentMethodCreateDtoSchema,
  paymentMethodPatchDtoSchema,
  paymentMethodUpdateDtoSchema,
  type PaymentMethodCreateDto,
  type PaymentMethodDetailDto,
  type PaymentMethodLookupDto,
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

function seedPaymentMethods(): PaymentMethodDetailDto[] {
  return [
    {
      id: 601,
      displayName: 'Cash',
      sortOrder: 1,
      isMobileVisible: true,
      isCustomerPortalVisible: true,
      isActive: true,
    },
    {
      id: 602,
      displayName: 'Check',
      sortOrder: 2,
      isMobileVisible: true,
      isCustomerPortalVisible: false,
      isActive: true,
    },
    {
      id: 603,
      displayName: 'Credit Card',
      sortOrder: 3,
      isMobileVisible: true,
      isCustomerPortalVisible: true,
      isActive: true,
    },
    {
      id: 604,
      displayName: 'ACH',
      sortOrder: 4,
      isMobileVisible: false,
      isCustomerPortalVisible: true,
      isActive: true,
    },
    {
      id: 605,
      displayName: 'Wire',
      sortOrder: 5,
      isMobileVisible: false,
      isCustomerPortalVisible: false,
      isActive: false,
    },
  ];
}

const paymentMethods = seedPaymentMethods();

function toLookup(record: PaymentMethodDetailDto): PaymentMethodLookupDto {
  return {
    id: record.id,
    displayName: record.displayName,
    sortOrder: record.sortOrder,
  };
}

function findPaymentMethod(
  id: number | undefined,
): PaymentMethodDetailDto | undefined {
  return id === undefined
    ? undefined
    : paymentMethods.find((record) => record.id === id);
}

function filterPaymentMethods(url: URL): PaymentMethodDetailDto[] {
  const isActive = readOptionalBoolean(url, 'isActive');
  const displayName = url.searchParams.get('displayName');
  const search = url.searchParams.get('search');
  return paymentMethods.filter((record) => {
    if (isActive !== undefined && record.isActive !== isActive) return false;
    if (
      displayName &&
      !(record.displayName ?? '')
        .toLowerCase()
        .includes(displayName.toLowerCase())
    ) {
      return false;
    }
    return matchesSearch(search, [record.displayName]);
  });
}

function createFromBody(body: PaymentMethodCreateDto): PaymentMethodDetailDto {
  return {
    id: nextId(paymentMethods),
    displayName: body.displayName ?? null,
    sortOrder: body.sortOrder,
    isMobileVisible: body.isMobileVisible,
    isCustomerPortalVisible: body.isCustomerPortalVisible,
    isActive: true,
  };
}

/**
 * In-memory `/paymentmethod` catalog. Mutations persist for the session so a
 * follow-up GET after invalidation shows the saved values. Request/response
 * shapes come from `@cms/settings-contract`.
 */
export const paymentMethodHandlers = [
  http.get('/api/v1/paymentmethod/lookup', ({ request }) => {
    const url = new URL(request.url);
    const activeOnly = readOptionalBoolean(url, 'activeOnly') ?? true;
    const isMobileVisible = readOptionalBoolean(url, 'isMobileVisible');
    const isCustomerPortalVisible = readOptionalBoolean(
      url,
      'isCustomerPortalVisible',
    );
    const items = paymentMethods
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

  http.get('/api/v1/paymentmethod/:id', ({ params }) => {
    const record = findPaymentMethod(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Payment method not found.');
    return setupOk(record);
  }),

  http.put('/api/v1/paymentmethod/:id', async ({ params, request }) => {
    const record = findPaymentMethod(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Payment method not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = paymentMethodUpdateDtoSchema.safeParse(body.value);
    if (!parsed.success)
      return setupError(400, firstIssueMessage(parsed.error));
    assignDefined(record, parsed.data);
    return setupOk(record);
  }),

  http.patch('/api/v1/paymentmethod/:id', async ({ params, request }) => {
    const record = findPaymentMethod(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Payment method not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = paymentMethodPatchDtoSchema.safeParse(body.value);
    if (!parsed.success)
      return setupError(400, firstIssueMessage(parsed.error));
    assignDefined(record, parsed.data);
    return setupOk(record);
  }),

  http.get('/api/v1/paymentmethod', ({ request }) => {
    const url = new URL(request.url);
    return setupOk(pagedResult(filterPaymentMethods(url), url));
  }),

  http.post('/api/v1/paymentmethod', async ({ request }) => {
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = paymentMethodCreateDtoSchema.safeParse(body.value);
    if (!parsed.success)
      return setupError(400, firstIssueMessage(parsed.error));
    const created = createFromBody(parsed.data);
    paymentMethods.push(created);
    return setupOk(created, 201);
  }),
];
