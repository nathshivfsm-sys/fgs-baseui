import { queryOptions } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  workOrderBookingConfigResponseSchema,
  type WorkOrderBookingConfigDto,
} from '@cms/settings-contract';
import { workOrderBookingConfigEndpoint } from './work-order-booking.endpoints';
import { workOrderBookingKeys } from './work-order-booking.keys';

export const loadWorkOrderBookingConfig = async ({
  signal,
}: QueryRequestContext): Promise<WorkOrderBookingConfigDto> => {
  const body = await customFetch<unknown>(workOrderBookingConfigEndpoint, {
    signal,
  });
  return workOrderBookingConfigResponseSchema.parse(body).data;
};

export const workOrderBookingConfigQueryOptions = () =>
  queryOptions({
    queryKey: workOrderBookingKeys.configuration(),
    queryFn: ({ signal }) => loadWorkOrderBookingConfig({ signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'work-order-booking', operation: 'detail' },
  });
