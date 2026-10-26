import { mutationOptions, type QueryClient } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  serviceLocationCreateResponseSchema,
  type ServiceLocationCreateDto,
  type ServiceLocationCreatedDto,
} from '@cms/customer-contract';
import { customerServiceLocationCollectionEndpoint } from './service-location.endpoints';
import { serviceLocationKeys } from './service-location.keys';

export const createServiceLocation = async (
  customerId: number,
  body: ServiceLocationCreateDto,
  context?: QueryRequestContext,
): Promise<ServiceLocationCreatedDto> => {
  const response = await customFetch<unknown>(
    customerServiceLocationCollectionEndpoint(customerId),
    {
      method: 'POST',
      body: JSON.stringify(body),
      signal: context?.signal,
    },
  );
  return serviceLocationCreateResponseSchema.parse(response).data;
};

function invalidateServiceLocations(queryClient: QueryClient) {
  return queryClient.invalidateQueries({
    queryKey: serviceLocationKeys.lists(),
  });
}

export const createServiceLocationMutationOptions = (
  queryClient: QueryClient,
  customerId: number,
) =>
  mutationOptions({
    mutationFn: (body: ServiceLocationCreateDto) =>
      createServiceLocation(customerId, body),
    meta: { feature: 'service-location', operation: 'create' },
    onSuccess: () => invalidateServiceLocations(queryClient),
  });
