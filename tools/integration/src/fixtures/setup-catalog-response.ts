/** Wire envelopes shaped from the FGS Setup Service swagger DTOs. */

export const taxListResponseFixture = {
  success: true,
  statusCode: 200,
  data: {
    items: [
      {
        id: 11,
        taxCode: 'TX-STD',
        name: 'Standard Tax',
        showTaxDetail: true,
        description: 'State plus local',
        taxRate: 8.25,
        isActive: true,
      },
    ],
    page: 1,
    pageSize: 25,
    totalCount: 1,
  },
  errors: [] as string[],
};

export const taxDetailResponseFixture = {
  success: true,
  statusCode: 200,
  data: {
    id: 11,
    taxCode: 'TX-STD',
    name: 'Standard Tax',
    showTaxDetail: true,
    description: 'State plus local',
    taxRate: 8.25,
    isActive: true,
    taxDetails: [
      {
        id: 101,
        fgsSetupTaxAuthorityId: 21,
        taxAuthorityCode: 'TX-STATE',
        taxAuthorityName: 'Texas State',
        taxPercent: 6.25,
        effectiveFromDate: '2026-01-01',
        effectiveToDate: null,
        isActive: true,
      },
    ],
  },
  errors: [] as string[],
};

export const taxLookupResponseFixture = {
  success: true,
  statusCode: 200,
  data: [
    {
      id: 11,
      taxCode: 'TX-STD',
      name: 'Standard Tax',
      taxRate: 8.25,
    },
  ],
  errors: [] as string[],
};

export const taxAuthorityListResponseFixture = {
  success: true,
  statusCode: 200,
  data: {
    items: [
      {
        id: 21,
        code: 'TX-STATE',
        name: 'Texas State',
        regionCode: 'TX',
        isExternalSystemRecord: false,
        taxPercent: 6.25,
        description: 'State sales tax',
        usageCount: 4,
        isActive: true,
      },
    ],
    page: 1,
    pageSize: 25,
    totalCount: 1,
  },
  errors: [] as string[],
};

export const taxAuthorityDetailResponseFixture = {
  success: true,
  statusCode: 200,
  data: taxAuthorityListResponseFixture.data.items[0],
  errors: [] as string[],
};

export const zoneListResponseFixture = {
  success: true,
  statusCode: 200,
  data: {
    items: [
      {
        id: 31,
        code: 'NORTH',
        name: 'North Zone',
        description: 'North service territory',
        isActive: true,
      },
    ],
    page: 1,
    pageSize: 25,
    totalCount: 1,
  },
  errors: [] as string[],
};

export const zoneDetailResponseFixture = {
  success: true,
  statusCode: 200,
  data: zoneListResponseFixture.data.items[0],
  errors: [] as string[],
};

export const zoneLookupResponseFixture = {
  success: true,
  statusCode: 200,
  data: [
    {
      id: 31,
      code: 'NORTH',
      name: 'North Zone',
    },
  ],
  errors: [] as string[],
};

export const postalCodeListResponseFixture = {
  success: true,
  statusCode: 200,
  data: {
    items: [
      {
        id: 41,
        postalCode: 'NORTH',
        city: 'Houston',
        state: 'TX',
        fgsSetupZoneId: 31,
        zoneCode: 'NORTH',
        zoneName: 'Harris County -North',
        fgsSetupTaxId: 11,
        taxCode: 'TX-STD',
        taxRate: 8.7,
        tripCharge: 10,
        isActive: true,
      },
    ],
    page: 1,
    pageSize: 25,
    totalCount: 1,
  },
  errors: [] as string[],
};

export const postalCodeDetailResponseFixture = {
  success: true,
  statusCode: 200,
  data: postalCodeListResponseFixture.data.items[0],
  errors: [] as string[],
};

export const postalCodeLookupResponseFixture = {
  success: true,
  statusCode: 200,
  data: [
    {
      id: 41,
      postalCode: 'NORTH',
      city: 'Houston',
    },
  ],
  errors: [] as string[],
};
