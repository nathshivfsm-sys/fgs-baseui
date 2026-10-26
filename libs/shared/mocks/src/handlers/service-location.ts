import { http } from 'msw';
import {
  customerTypeSchema,
  serviceLocationCreateDtoSchema,
  type ServiceLocationDetailDto,
  type ServiceLocationSummaryDto,
} from '@cms/customer-contract';
import {
  matchesSearch,
  pagedResult,
  parseRouteId,
  readJsonBody,
  readOptionalBoolean,
  setupError,
  setupOk,
} from './util';

type ServiceLocationRecord = ServiceLocationSummaryDto & {
  customerId: number;
  locationSequence: number;
  serviceLocationType:
    | 'residential'
    | 'commercial'
    | 'industrial'
    | 'government'
    | 'other';
  addressLine1: string | null;
  state: string | null;
  county: string | null;
  country: string | null;
  primaryContactName: string | null;
  primaryContactEmail: string | null;
  primaryContactPhone: string | null;
};

function seedServiceLocations(): ServiceLocationRecord[] {
  const base = (
    overrides: Partial<ServiceLocationRecord>,
  ): ServiceLocationRecord => ({
    id: 9001,
    customerId: 501,
    locationSequence: 1,
    locationNumber: 'ID-2345',
    name: 'Main Office',
    displayName: 'Joe Prit',
    formattedAddress: '124 Oak Street, Springfield, IL, USA',
    email: 'joeprit@gmail.com',
    phone: '+1 (217) 555-0192',
    isActive: true,
    customerType: 'commercial',
    city: 'Springfield',
    postalCode: '62701',
    createdOn: '2026-01-20T10:00:00Z',
    createdBy: 'system',
    serviceLocationType: 'commercial',
    addressLine1: '124 Oak Street',
    state: 'IL',
    county: null,
    country: 'US',
    primaryContactName: 'Joe Prit',
    primaryContactEmail: 'joeprit@gmail.com',
    primaryContactPhone: '+1 (217) 555-0192',
    ...overrides,
  });

  return [
    base({ id: 9001, locationSequence: 1, locationNumber: 'ID-2345' }),
    base({
      id: 9002,
      locationSequence: 2,
      locationNumber: 'ID-2346',
      name: 'Warehouse North',
      displayName: 'Rivera WH',
      customerType: 'commercial',
    }),
    base({
      id: 9003,
      locationSequence: 3,
      locationNumber: 'ID-2347',
      name: 'South Campus',
      displayName: 'South Campus',
      customerType: 'residential',
    }),
    base({
      id: 9004,
      locationSequence: 4,
      locationNumber: 'ID-2348',
      name: 'East Service Yard',
      customerType: 'builder',
    }),
    base({
      id: 9005,
      locationSequence: 5,
      locationNumber: 'ID-2349',
      name: 'West Annex',
      customerType: 'propertyManagement',
    }),
    base({
      id: 9006,
      locationSequence: 6,
      locationNumber: 'ID-2350',
      name: 'Training Facility',
      customerType: 'hoa',
    }),
    base({
      id: 9007,
      locationSequence: 7,
      locationNumber: 'ID-2351',
      name: 'Closed Depot',
      isActive: false,
      customerType: 'commercial',
    }),
    base({
      id: 9008,
      locationSequence: 8,
      locationNumber: 'ID-2352',
      name: 'Legacy Site',
      isActive: false,
      customerType: 'other',
    }),
  ];
}

const serviceLocations = seedServiceLocations();

function findCustomerExists(customerId: number): boolean {
  return customerId === 501 || customerId === 502;
}

function summaryForCustomer(customerId: number) {
  const rows = serviceLocations.filter((row) => row.customerId === customerId);
  return {
    activeCount: rows.filter((row) => row.isActive).length,
    inactiveCount: rows.filter((row) => !row.isActive).length,
  };
}

function filterLocations(
  url: URL,
  customerId: number,
): ServiceLocationSummaryDto[] {
  const isActive = readOptionalBoolean(url, 'isActive');
  const search = url.searchParams.get('search');
  const customerTypeParam = url.searchParams.get('customerType');

  return serviceLocations
    .filter((row) => row.customerId === customerId)
    .filter((row) => isActive === undefined || row.isActive === isActive)
    .filter((row) => {
      if (!customerTypeParam) return true;
      const parsed = customerTypeSchema.safeParse(customerTypeParam);
      if (!parsed.success) return true;
      return row.customerType === parsed.data;
    })
    .filter((row) =>
      matchesSearch(search, [
        row.locationNumber,
        row.name,
        row.displayName,
        row.formattedAddress,
        row.email,
        row.phone,
        row.city,
        row.postalCode,
      ]),
    )
    .map(toSummary);
}

function toSummary(row: ServiceLocationRecord): ServiceLocationSummaryDto {
  const {
    customerId: _customerId,
    locationSequence: _locationSequence,
    serviceLocationType: _serviceLocationType,
    addressLine1: _addressLine1,
    state: _state,
    county: _county,
    country: _country,
    primaryContactName: _primaryContactName,
    primaryContactEmail: _primaryContactEmail,
    primaryContactPhone: _primaryContactPhone,
    ...summary
  } = row;
  return summary;
}

function toDetail(row: ServiceLocationRecord): ServiceLocationDetailDto {
  return {
    id: row.id,
    customerId: row.customerId,
    locationSequence: row.locationSequence,
    locationNumber: row.locationNumber,
    isActive: row.isActive,
    serviceLocationType: row.serviceLocationType,
    name: row.name,
    displayName: row.displayName,
    addressLine1: row.addressLine1,
    addressLine2: null,
    addressLine3: null,
    addressLine4: null,
    city: row.city,
    state: row.state,
    county: row.county,
    country: row.country,
    postalCode: row.postalCode,
    formattedAddress: row.formattedAddress,
    latitude: null,
    longitude: null,
    placeId: null,
    primaryContactName: row.primaryContactName,
    primaryContactEmail: row.primaryContactEmail ?? row.email,
    primaryContactPhone: row.primaryContactPhone ?? row.phone,
    customerType: row.customerType,
    createdOn: row.createdOn,
    createdBy: row.createdBy,
  };
}

export const serviceLocationHandlers = [
  http.get(
    '/api/v1/customer/:customerId/servicelocation',
    ({ params, request }) => {
      const customerId = parseRouteId(params['customerId']);
      if (customerId === undefined) {
        return setupError(404, 'Customer not found.');
      }
      if (!findCustomerExists(customerId)) {
        return setupError(404, 'Customer not found.');
      }

      const url = new URL(request.url);
      const filtered = filterLocations(url, customerId);
      const includeSummary = readOptionalBoolean(url, 'includeSummary') ?? true;
      const page = pagedResult(filtered, url);

      return setupOk({
        ...page,
        ...(includeSummary ? { summary: summaryForCustomer(customerId) } : {}),
      });
    },
  ),

  http.get(
    '/api/v1/customer/:customerId/servicelocation/:locationId',
    ({ params }) => {
      const customerId = parseRouteId(params['customerId']);
      const locationId = parseRouteId(params['locationId']);
      if (customerId === undefined || !findCustomerExists(customerId)) {
        return setupError(404, 'Customer not found.');
      }
      const record = serviceLocations.find(
        (row) => row.customerId === customerId && row.id === locationId,
      );
      if (!record) {
        return setupError(404, 'Service location not found.');
      }
      return setupOk(toDetail(record));
    },
  ),

  http.post(
    '/api/v1/customer/:customerId/servicelocation',
    async ({ params, request }) => {
      const customerId = parseRouteId(params['customerId']);
      if (customerId === undefined || !findCustomerExists(customerId)) {
        return setupError(404, 'Customer not found.');
      }

      const body = await readJsonBody(request);
      if (!body.ok) return body.response;
      const parsed = serviceLocationCreateDtoSchema.safeParse(body.value);
      if (!parsed.success) {
        const issue = parsed.error.issues[0];
        const path =
          issue?.path && issue.path.length > 0
            ? `${issue.path.join('.')}: `
            : '';
        return setupError(400, `${path}${issue?.message ?? 'Invalid body.'}`);
      }

      const dto = parsed.data;
      if (!dto.name?.trim() || !dto.displayName?.trim()) {
        return setupError(400, 'Location name and display name are required.');
      }
      if (!dto.addressLine1?.trim() || !dto.city?.trim()) {
        return setupError(400, 'Address is required.');
      }

      const forCustomer = serviceLocations.filter(
        (row) => row.customerId === customerId,
      );
      const nextSequence =
        forCustomer.reduce(
          (max, row) => Math.max(max, row.locationSequence),
          0,
        ) + 1;
      const nextId =
        serviceLocations.reduce((max, row) => Math.max(max, row.id), 9000) + 1;
      const locationNumber = `ID-${2340 + nextId}`;

      const record: ServiceLocationRecord = {
        id: nextId,
        customerId,
        locationSequence: nextSequence,
        locationNumber,
        name: dto.name,
        displayName: dto.displayName,
        formattedAddress:
          dto.formattedAddress ??
          [dto.addressLine1, dto.city, dto.state, dto.postalCode]
            .filter(Boolean)
            .join(', '),
        email: dto.primaryContactEmail,
        phone: dto.primaryContactPhone,
        isActive: true,
        customerType: dto.customerType,
        city: dto.city,
        postalCode: dto.postalCode,
        createdOn: new Date().toISOString(),
        createdBy: 'system',
        serviceLocationType: 'residential',
        addressLine1: dto.addressLine1,
        state: dto.state,
        county: dto.county ?? null,
        country: dto.country,
        primaryContactName: dto.primaryContactName,
        primaryContactEmail: dto.primaryContactEmail,
        primaryContactPhone: dto.primaryContactPhone,
      };

      serviceLocations.push(record);

      return setupOk(
        {
          serviceLocationId: record.id,
          customerId,
          locationSequence: nextSequence,
          locationNumber,
        },
        201,
      );
    },
  ),
];
