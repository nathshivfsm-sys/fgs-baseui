import { z } from 'zod';
import {
  customerTypeSchema,
  serviceLocationTypeSchema,
} from './customer.schema';
import {
  nullableText,
  pagedResultSchema,
  setupResponseSchema,
  type SetupListParams,
} from './envelope.schema';

export const serviceLocationSummaryDtoSchema = z.object({
  id: z.number(),
  locationNumber: nullableText,
  name: nullableText,
  displayName: nullableText,
  formattedAddress: nullableText,
  email: nullableText,
  phone: nullableText,
  isActive: z.boolean(),
  customerType: customerTypeSchema,
  city: nullableText,
  postalCode: nullableText,
  createdOn: z.string(),
  createdBy: nullableText,
});

export const serviceLocationListSummaryDtoSchema = z.object({
  activeCount: z.number(),
  inactiveCount: z.number(),
});

export const serviceLocationListResultDtoSchema = pagedResultSchema(
  serviceLocationSummaryDtoSchema,
).extend({
  summary: serviceLocationListSummaryDtoSchema.nullish(),
});

export const serviceLocationDetailDtoSchema = z.object({
  id: z.number(),
  customerId: z.number(),
  locationSequence: z.number(),
  locationNumber: nullableText,
  isActive: z.boolean(),
  serviceLocationType: serviceLocationTypeSchema,
  name: nullableText,
  displayName: nullableText,
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
  primaryContactName: nullableText,
  primaryContactEmail: nullableText,
  primaryContactPhone: nullableText,
  customerType: customerTypeSchema,
  createdOn: z.string(),
  createdBy: nullableText,
});

export const serviceLocationListResponseSchema = setupResponseSchema(
  serviceLocationListResultDtoSchema,
);
export const serviceLocationDetailResponseSchema = setupResponseSchema(
  serviceLocationDetailDtoSchema,
);

const serviceLocationCreatedRowSchema = z.object({
  serviceLocationId: z.number().optional(),
  id: z.number().optional(),
  customerId: z.number(),
  locationSequence: z.number(),
  locationNumber: nullableText,
});

export const serviceLocationCreatedDtoSchema =
  serviceLocationCreatedRowSchema.transform((row) => {
    const serviceLocationId = row.serviceLocationId ?? row.id;
    if (serviceLocationId == null) {
      throw new Error('Service location id is required.');
    }
    return {
      serviceLocationId,
      customerId: row.customerId,
      locationSequence: row.locationSequence,
      locationNumber: row.locationNumber ?? null,
    };
  });

export const serviceLocationCreateResponseSchema = setupResponseSchema(
  serviceLocationCreatedDtoSchema,
);

export type ServiceLocationSummaryDto = z.infer<
  typeof serviceLocationSummaryDtoSchema
>;
export type ServiceLocationListSummaryDto = z.infer<
  typeof serviceLocationListSummaryDtoSchema
>;
export type ServiceLocationListResultDto = z.infer<
  typeof serviceLocationListResultDtoSchema
>;
export type ServiceLocationDetailDto = z.infer<
  typeof serviceLocationDetailDtoSchema
>;
export type ServiceLocationCreatedDto = z.infer<
  typeof serviceLocationCreatedDtoSchema
>;

export type ServiceLocationListParams = SetupListParams & {
  includeSummary?: boolean;
  customerType?: z.infer<typeof customerTypeSchema>;
};

export type ServiceLocationListResult = {
  items: ServiceLocationSummaryDto[];
  page: number;
  pageSize: number;
  totalCount: number;
  summary: ServiceLocationListSummaryDto | null;
};
