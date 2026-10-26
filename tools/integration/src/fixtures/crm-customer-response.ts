/** Wire envelopes shaped from the FGS CRM Service customer DTOs. */

export const customerListResponseFixture = {
  success: true,
  statusCode: 200,
  data: {
    items: [
      {
        id: 501,
        customerNumber: 'C-1001',
        name: 'Rivera Home Services',
        displayName: 'Rivera Home Services',
        city: 'Austin',
        state: 'TX',
        postalCode: '78701',
        country: 'US',
        customerAccountNumber: 'ACCT-501',
        isActive: true,
        formattedAddress: '1200 Oak St, Austin, TX 78701',
        primaryContactName: 'Maria Rivera',
        email: 'maria@rivera.example.com',
        phone: '+1-555-1001',
        tagIds: [1, 2],
        createdOn: '2026-01-15T10:00:00Z',
        isPreferredCustomer: true,
      },
    ],
    page: 1,
    pageSize: 25,
    totalCount: 1,
    summary: {
      totalCustomers: 1,
      activeCustomers: 1,
      inactiveCustomers: 0,
      newThisMonth: 1,
      previousMonthNewCustomers: 0,
      newCustomerPercentChange: null,
    },
  },
  errors: [] as string[],
};

export const customerDetailResponseFixture = {
  success: true,
  statusCode: 200,
  data: {
    id: 501,
    customerNumber: 'C-1001',
    name: 'Rivera Home Services',
    displayName: 'Rivera Home Services',
    addressLine1: '1200 Oak St',
    addressLine2: null,
    addressLine3: null,
    addressLine4: null,
    city: 'Austin',
    state: 'TX',
    county: 'Travis',
    country: 'US',
    postalCode: '78701',
    formattedAddress: '1200 Oak St, Austin, TX 78701',
    latitude: 30.2672,
    longitude: -97.7431,
    placeId: null,
    defaultPaymentTermId: null,
    defaultMaterialPricingMatrixId: null,
    defaultLaborPricingMatrixId: null,
    defaultOtherPricingMatrixId: null,
    defaultPORequired: false,
    taxExempt: false,
    taxExemptNumber: null,
    customerAccountNumber: 'ACCT-501',
    externalEntityId: null,
    externalVersion: null,
    isActive: true,
    website: 'https://rivera.example.com',
    primaryContactName: 'Maria Rivera',
    primaryContactEmail: 'maria@rivera.example.com',
    primaryContactPhone: '+1-555-1001',
    createdOn: '2026-01-15T10:00:00Z',
    tagIds: [1, 2],
  },
  errors: [] as string[],
};

export const customerFinancialSummaryResponseFixture = {
  success: true,
  statusCode: 200,
  data: {
    arBalance: 23_000,
    totalSales: 48_320,
    activeCardsOnFile: 4,
    scheduledPaymentsCount: 5,
  },
  errors: [] as string[],
};

export const customerLookupResponseFixture = {
  success: true,
  statusCode: 200,
  data: [
    {
      id: 501,
      customerNumber: 'C-1001',
      displayName: 'Rivera Home Services',
    },
  ],
  errors: [] as string[],
};

export const customerCreateResponseFixture = {
  success: true,
  statusCode: 201,
  data: {
    customer: customerDetailResponseFixture.data,
    serviceLocationId: null,
  },
  errors: [] as string[],
};
