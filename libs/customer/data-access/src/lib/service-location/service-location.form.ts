import { z } from 'zod';
import type { ServiceLocationCreateDto } from '@cms/customer-contract';
import {
  emptyServiceLocationFormValues,
  mapServiceLocationFormToCreateDto,
  normalizeServiceLocationFormValues,
  refineServiceLocationFields,
  serviceLocationFormSchema,
  type ServiceLocationFormValues,
  type ServiceLocationOnlyForm,
} from '../customer/customer.form';

export const serviceLocationOnlyFormSchema = z
  .object({
    serviceLocation: serviceLocationFormSchema,
  })
  .superRefine((values, ctx) => {
    refineServiceLocationFields(values.serviceLocation, ctx);
  });

export function emptyServiceLocationOnlyForm(): ServiceLocationOnlyForm {
  return {
    serviceLocation: emptyServiceLocationFormValues(),
  };
}

export function toServiceLocationCreateDto(
  values: ServiceLocationOnlyForm,
): ServiceLocationCreateDto {
  return mapServiceLocationFormToCreateDto(
    normalizeServiceLocationFormValues(values.serviceLocation),
  );
}

export type { ServiceLocationFormValues, ServiceLocationOnlyForm };
