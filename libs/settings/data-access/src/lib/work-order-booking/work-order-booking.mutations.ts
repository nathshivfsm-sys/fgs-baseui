import { mutationOptions, type QueryClient } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import type { WorkOrderBookingConfigUpdateDto } from '@cms/settings-contract';
import { workOrderBookingConfigEndpoint } from './work-order-booking.endpoints';
import { workOrderBookingKeys } from './work-order-booking.keys';

export const updateWorkOrderBookingConfig = async (
  body: WorkOrderBookingConfigUpdateDto,
  context?: QueryRequestContext,
): Promise<void> => {
  await customFetch<unknown>(workOrderBookingConfigEndpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
};

function invalidateWorkOrderBookingConfig(queryClient: QueryClient) {
  return queryClient.invalidateQueries({
    queryKey: workOrderBookingKeys.configuration(),
  });
}

export const updateWorkOrderBookingConfigMutationOptions = (
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: (body: WorkOrderBookingConfigUpdateDto) =>
      updateWorkOrderBookingConfig(body),
    meta: { feature: 'work-order-booking', operation: 'update' },
    onSuccess: () => invalidateWorkOrderBookingConfig(queryClient),
  });
