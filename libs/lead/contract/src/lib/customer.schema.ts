import { z } from 'zod';
import {
  nullableText,
  pagedResultSchema,
  setupResponseSchema,
  type SetupListParams,
} from './envelope.schema';

/**
 * Wire shapes of `/customer` from the FGS CRM Service swagger (`CrmCustomer*` DTOs).
 */
export const customerCreationOptionSchema = z.enum([
  'billToOnly',
  'billToAndServiceLocation',
]);

export const customerTypeSchema = z.enum([
  'residential',
  'commercial',
  'propertyManagement',
  'builder',
  'hoa',
  'other',
]);

export const serviceLocationTypeSchema = z.enum([
  'residential',
  'commercial',
  'industrial',
  'government',
  'other',
]);

const customerAddressFields = {
  addressLine1: nullableText,
  addressLine2: nullableText,
  addressLine3: nullableText,
  addressLine4: nullableText,
  city: nullableText,
  state: nullableText,
  county: nullableText,
  country: nullableText,
  postalCode: nullableText,
  formattedAddress: nullableText,
  latitude: z.number().nullish(),
  longitude: z.number().nullish(),
  placeId: nullableText,
};

const customerPricingFields = {
  defaultPaymentTermId: z.number().nullish(),
  defaultMaterialPricingMatrixId: z.number().nullish(),
  defaultLaborPricingMatrixId: z.number().nullish(),
  defaultOtherPricingMatrixId: z.number().nullish(),
  defaultPORequired: z.boolean(),
  taxExempt: z.boolean(),
  taxExemptNumber: nullableText,
  customerAccountNumber: nullableText,
  externalEntityId: nullableText,
  externalVersion: nullableText,
  website: nullableText,
};

export const customerSummaryDtoSchema = z.object({
  id: z.number(),
  customerNumber: nullableText,
  name: nullableText,
  displayName: nullableText,
  city: nullableText,
  state: nullableText,
  postalCode: nullableText,
  country: nullableText,
  customerAccountNumber: nullableText,
  isActive: z.boolean(),
  formattedAddress: nullableText,
  primaryContactName: nullableText,
  email: nullableText,
  phone: nullableText,
  tagIds: z.array(z.number()).nullish(),
  createdOn: z.string(),
  isPreferredCustomer: z.boolean(),
});

export const customerDetailDtoSchema = z.object({
  id: z.number(),
  customerNumber: nullableText,
  name: nullableText,
  displayName: nullableText,
  ...customerAddressFields,
  ...customerPricingFields,
  isActive: z.boolean(),
  primaryContactName: nullableText,
  primaryContactEmail: nullableText,
  primaryContactPhone: nullableText,
  createdOn: z.string(),
  tagIds: z.array(z.number()).nullish(),
});

export const customerListSummaryDtoSchema = z.object({
  totalCustomers: z.number(),
  activeCustomers: z.number(),
  inactiveCustomers: z.number(),
  newThisMonth: z.number(),
  previousMonthNewCustomers: z.number(),
  newCustomerPercentChange: z.number().nullish(),
});

export const customerListResultDtoSchema = pagedResultSchema(
  customerSummaryDtoSchema,
).extend({
  summary: customerListSummaryDtoSchema.nullish(),
});

export const customerLookupDtoSchema = z.object({
  id: z.number(),
  customerNumber: nullableText,
  displayName: nullableText,
});

export const serviceLocationCreateDtoSchema = z.object({
  serviceLocationType: serviceLocationTypeSchema,
  name: nullableText,
  displayName: nullableText,
  ...customerAddressFields,
  taxExempt: z.boolean().nullish(),
  primaryContactName: nullableText,
  primaryContactEmail: nullableText,
  primaryContactPhone: nullableText,
  canReceiveEstimates: z.boolean().nullish(),
  canReceiveInvoices: z.boolean().nullish(),
  canReceiveAppointments: z.boolean().nullish(),
  tagIds: z.array(z.number()).nullish(),
  customerType: customerTypeSchema,
  break1Id: z.number().nullish(),
  break2Id: z.number().nullish(),
});

export const customerCreateDtoSchema = z.object({
  customerNumber: nullableText,
  name: nullableText,
  displayName: nullableText,
  ...customerAddressFields,
  ...customerPricingFields,
  primaryContactName: nullableText,
  primaryContactEmail: nullableText,
  primaryContactPhone: nullableText,
  creationOption: customerCreationOptionSchema,
  serviceLocation: serviceLocationCreateDtoSchema.nullish(),
  tagIds: z.array(z.number()).nullish(),
});

export const customerUpdateDtoSchema = z.object({
  customerNumber: nullableText,
  name: nullableText,
  displayName: nullableText,
  ...customerAddressFields,
  ...customerPricingFields,
});

export const customerPatchDtoSchema = z.object({
  customerNumber: nullableText,
  name: nullableText,
  displayName: nullableText,
  ...customerAddressFields,
  defaultPaymentTermId: z.number().nullish(),
  defaultMaterialPricingMatrixId: z.number().nullish(),
  defaultLaborPricingMatrixId: z.number().nullish(),
  defaultOtherPricingMatrixId: z.number().nullish(),
  defaultPORequired: z.boolean().nullish(),
  taxExempt: z.boolean().nullish(),
  taxExemptNumber: nullableText,
  customerAccountNumber: nullableText,
  externalEntityId: nullableText,
  externalVersion: nullableText,
  isActive: z.boolean().nullish(),
  website: nullableText,
});

export const customerCreateResultDtoSchema = z.object({
  customer: customerDetailDtoSchema,
  serviceLocationId: z.number().nullish(),
});

export const customerListResponseSchema = setupResponseSchema(
  customerListResultDtoSchema,
);
export const customerDetailResponseSchema = setupResponseSchema(
  customerDetailDtoSchema,
);
export const customerLookupResponseSchema = setupResponseSchema(
  z.array(customerLookupDtoSchema),
);
export const customerCreateResponseSchema = setupResponseSchema(
  customerCreateResultDtoSchema,
);

export type CustomerSummaryDto = z.infer<typeof customerSummaryDtoSchema>;
export type CustomerDetailDto = z.infer<typeof customerDetailDtoSchema>;
export type CustomerListSummaryDto = z.infer<
  typeof customerListSummaryDtoSchema
>;
export type CustomerListResultDto = z.infer<typeof customerListResultDtoSchema>;
export type CustomerLookupDto = z.infer<typeof customerLookupDtoSchema>;
export type CustomerCreateDto = z.infer<typeof customerCreateDtoSchema>;
export type CustomerUpdateDto = z.infer<typeof customerUpdateDtoSchema>;
export type CustomerPatchDto = z.infer<typeof customerPatchDtoSchema>;
export type CustomerCreateResultDto = z.infer<
  typeof customerCreateResultDtoSchema
>;
export type CustomerCreationOption = z.infer<
  typeof customerCreationOptionSchema
>;
export type ServiceLocationCreateDto = z.infer<
  typeof serviceLocationCreateDtoSchema
>;

export type CustomerListParams = SetupListParams & {
  customerNumber?: string;
  name?: string;
  displayName?: string;
  isPreferred?: boolean;
  includeSummary?: boolean;
};

export type CustomerListResult = {
  items: CustomerSummaryDto[];
  page: number;
  pageSize: number;
  totalCount: number;
  summary: CustomerListSummaryDto | null;
};
