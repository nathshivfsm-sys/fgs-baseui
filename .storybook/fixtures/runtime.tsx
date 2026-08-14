import { QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useMemo, type ComponentType } from 'react';
import {
  createCmsQueryClient,
  disposeCmsQueryClient,
  type CmsRuntime,
  type UserDetails,
} from '@cms/platform-contract';

const storyUser = {
  id: 'storybook-user',
  displayName: 'Storybook User',
  email: 'storybook.user@example.com',
  role: 'Designer',
} satisfies UserDetails;

export function createStoryRuntime(tenantId = 'northwind'): CmsRuntime {
  return {
    tenantId,
    currentUser: storyUser,
    queryClient: createCmsQueryClient({
      defaultOptions: {
        queries: { staleTime: 0, gcTime: 0, retry: false },
        mutations: { retry: false },
      },
    }),
  };
}

type RuntimeProps = { runtime: CmsRuntime };
type RuntimeStoryProps<Props extends RuntimeProps> = Omit<Props, 'runtime'> & {
  storyTenantId?: string;
};

export function withCmsRuntime<Props extends RuntimeProps>(
  Component: ComponentType<Props>,
) {
  return function RuntimeStory({
    storyTenantId = 'northwind',
    ...props
  }: RuntimeStoryProps<Props>) {
    const runtime = useMemo(
      () => createStoryRuntime(storyTenantId),
      [storyTenantId],
    );
    useEffect(
      () => () => disposeCmsQueryClient(runtime.queryClient),
      [runtime],
    );
    const componentProps = { ...props, runtime } as Props;
    return (
      <QueryClientProvider client={runtime.queryClient}>
        <Component {...componentProps} />
      </QueryClientProvider>
    );
  };
}
