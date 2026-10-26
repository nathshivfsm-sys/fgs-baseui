import { queryOptions } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  glBreakLookupResponseSchema,
  type GlBreakLookupDto,
} from '@cms/shared-contract';
import { glBreakLookupEndpoint } from './gl-break-lookup.endpoints';
import { glBreakLookupKeys } from './gl-break-lookup.keys';

export const loadGlBreakLookup = async (
  activeOnly: boolean,
  { signal }: QueryRequestContext,
): Promise<readonly GlBreakLookupDto[]> => {
  const body = await customFetch<unknown>(glBreakLookupEndpoint(activeOnly), {
    signal,
  });
  return glBreakLookupResponseSchema.parse(body).data;
};

export const glBreakLookupQueryOptions = (activeOnly = true) =>
  queryOptions({
    queryKey: glBreakLookupKeys.lookup(activeOnly),
    queryFn: ({ signal }) => loadGlBreakLookup(activeOnly, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'gl-break', operation: 'lookup' },
  });
