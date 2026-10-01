import { http } from 'msw';
import {
  billingCategoryCreateDtoSchema,
  billingCategoryPatchDtoSchema,
  billingCategoryUpdateDtoSchema,
  type BillingCategoryCreateDto,
  type BillingCategoryDetailDto,
  type BillingCategoryLookupDto,
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

function seedBillingCategories(): BillingCategoryDetailDto[] {
  return [
    {
      id: 101,
      billingCategoryType: 'LABOR',
      billingCategoryName: 'Labor',
      description: 'Technician labor charges',
      displayOrder: 1,
      isSystemDefined: true,
      showToFieldTech: true,
      allowToPick: true,
      isActive: true,
    },
    {
      id: 102,
      billingCategoryType: 'MATERIAL',
      billingCategoryName: 'Materials',
      description: 'Parts and supplies',
      displayOrder: 2,
      isSystemDefined: true,
      showToFieldTech: true,
      allowToPick: true,
      isActive: true,
    },
    {
      id: 103,
      billingCategoryType: 'FEE',
      billingCategoryName: 'Service Fee',
      description: 'Trip and diagnostic fees',
      displayOrder: 3,
      isSystemDefined: false,
      showToFieldTech: false,
      allowToPick: true,
      isActive: true,
    },
    {
      id: 104,
      billingCategoryType: 'DISCOUNT',
      billingCategoryName: 'Discount',
      description: 'Legacy discount line (inactive)',
      displayOrder: 4,
      isSystemDefined: false,
      showToFieldTech: false,
      allowToPick: false,
      isActive: false,
    },
  ];
}

const billingCategories = seedBillingCategories();

function toLookup(record: BillingCategoryDetailDto): BillingCategoryLookupDto {
  return {
    id: record.id,
    billingCategoryType: record.billingCategoryType,
    billingCategoryName: record.billingCategoryName,
    displayOrder: record.displayOrder,
  };
}

function findBillingCategory(
  id: number | undefined,
): BillingCategoryDetailDto | undefined {
  return id === undefined
    ? undefined
    : billingCategories.find((record) => record.id === id);
}

function filterBillingCategories(url: URL): BillingCategoryDetailDto[] {
  const isActive = readOptionalBoolean(url, 'isActive');
  const billingCategoryType = url.searchParams.get('billingCategoryType');
  const billingCategoryName = url.searchParams.get('billingCategoryName');
  const showToFieldTech = readOptionalBoolean(url, 'showToFieldTech');
  const allowToPick = readOptionalBoolean(url, 'allowToPick');
  const isSystemDefined = readOptionalBoolean(url, 'isSystemDefined');
  const search = url.searchParams.get('search');
  return billingCategories.filter((record) => {
    if (isActive !== undefined && record.isActive !== isActive) return false;
    if (
      billingCategoryType &&
      (record.billingCategoryType ?? '').toLowerCase() !==
        billingCategoryType.toLowerCase()
    ) {
      return false;
    }
    if (
      billingCategoryName &&
      !(record.billingCategoryName ?? '')
        .toLowerCase()
        .includes(billingCategoryName.toLowerCase())
    ) {
      return false;
    }
    if (
      showToFieldTech !== undefined &&
      record.showToFieldTech !== showToFieldTech
    ) {
      return false;
    }
    if (allowToPick !== undefined && record.allowToPick !== allowToPick) {
      return false;
    }
    if (
      isSystemDefined !== undefined &&
      record.isSystemDefined !== isSystemDefined
    ) {
      return false;
    }
    return matchesSearch(search, [
      record.billingCategoryType,
      record.billingCategoryName,
      record.description,
    ]);
  });
}

function normalizeBillingCategoryKey(
  billingCategoryType: string | null | undefined,
  billingCategoryName: string | null | undefined,
): string {
  return `${(billingCategoryType ?? '').trim().toLowerCase()}::${(billingCategoryName ?? '').trim().toLowerCase()}`;
}

function findDuplicateBillingCategory(
  billingCategoryType: string | null | undefined,
  billingCategoryName: string | null | undefined,
  excludeId?: number,
): BillingCategoryDetailDto | undefined {
  const key = normalizeBillingCategoryKey(
    billingCategoryType,
    billingCategoryName,
  );
  return billingCategories.find(
    (record) =>
      record.id !== excludeId &&
      normalizeBillingCategoryKey(
        record.billingCategoryType,
        record.billingCategoryName,
      ) === key,
  );
}

function createFromBody(
  body: BillingCategoryCreateDto,
): BillingCategoryDetailDto {
  return {
    id: nextId(billingCategories),
    billingCategoryType: body.billingCategoryType ?? null,
    billingCategoryName: body.billingCategoryName ?? null,
    description: body.description ?? null,
    displayOrder: body.displayOrder ?? null,
    isSystemDefined: body.isSystemDefined,
    showToFieldTech: body.showToFieldTech,
    allowToPick: body.allowToPick,
    isActive: true,
  };
}

/**
 * In-memory `/billingcategory` catalog. Mutations persist for the session so a
 * follow-up GET after invalidation shows the saved values. Request/response
 * shapes come from `@cms/settings-contract`.
 */
export const billingCategoryHandlers = [
  http.get('/api/v1/billingcategory/lookup', ({ request }) => {
    const url = new URL(request.url);
    const activeOnly = readOptionalBoolean(url, 'activeOnly') ?? true;
    const showToFieldTech = readOptionalBoolean(url, 'showToFieldTech');
    const allowToPick = readOptionalBoolean(url, 'allowToPick');
    const items = billingCategories
      .filter((record) => {
        if (activeOnly && !record.isActive) return false;
        if (
          showToFieldTech !== undefined &&
          record.showToFieldTech !== showToFieldTech
        ) {
          return false;
        }
        if (allowToPick !== undefined && record.allowToPick !== allowToPick) {
          return false;
        }
        return true;
      })
      .map(toLookup);
    return setupOk(items);
  }),

  http.get('/api/v1/billingcategory/:id', ({ params }) => {
    const record = findBillingCategory(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Billing category not found.');
    return setupOk(record);
  }),

  http.put('/api/v1/billingcategory/:id', async ({ params, request }) => {
    const id = parseRouteId(params['id']);
    const record = findBillingCategory(id);
    if (!record) return setupError(404, 'Billing category not found.');
    if (record.isSystemDefined) {
      return setupError(
        403,
        'System defined billing categories cannot be edited.',
      );
    }
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = billingCategoryUpdateDtoSchema.safeParse(body.value);
    if (!parsed.success)
      return setupError(400, firstIssueMessage(parsed.error));
    const duplicate = findDuplicateBillingCategory(
      parsed.data.billingCategoryType,
      parsed.data.billingCategoryName,
      id,
    );
    if (duplicate) {
      return setupError(
        409,
        'A billing category with this type and name already exists.',
      );
    }
    assignDefined(record, parsed.data);
    return setupOk(record);
  }),

  http.patch('/api/v1/billingcategory/:id', async ({ params, request }) => {
    const id = parseRouteId(params['id']);
    const record = findBillingCategory(id);
    if (!record) return setupError(404, 'Billing category not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = billingCategoryPatchDtoSchema.safeParse(body.value);
    if (!parsed.success)
      return setupError(400, firstIssueMessage(parsed.error));
    if (record.isSystemDefined && parsed.data.isActive === false) {
      return setupError(
        403,
        'System defined billing categories cannot be deactivated.',
      );
    }
    if (
      parsed.data.billingCategoryType !== undefined ||
      parsed.data.billingCategoryName !== undefined
    ) {
      const duplicate = findDuplicateBillingCategory(
        parsed.data.billingCategoryType ?? record.billingCategoryType,
        parsed.data.billingCategoryName ?? record.billingCategoryName,
        id,
      );
      if (duplicate) {
        return setupError(
          409,
          'A billing category with this type and name already exists.',
        );
      }
    }
    assignDefined(record, parsed.data);
    return setupOk(record);
  }),

  http.get('/api/v1/billingcategory', ({ request }) => {
    const url = new URL(request.url);
    return setupOk(pagedResult(filterBillingCategories(url), url));
  }),

  http.post('/api/v1/billingcategory', async ({ request }) => {
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = billingCategoryCreateDtoSchema.safeParse(body.value);
    if (!parsed.success)
      return setupError(400, firstIssueMessage(parsed.error));
    const duplicate = findDuplicateBillingCategory(
      parsed.data.billingCategoryType,
      parsed.data.billingCategoryName,
    );
    if (duplicate) {
      return setupError(
        409,
        'A billing category with this type and name already exists.',
      );
    }
    const created = createFromBody(parsed.data);
    billingCategories.push(created);
    return setupOk(created, 201);
  }),
];
