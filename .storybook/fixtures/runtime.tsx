import { QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useMemo, type ComponentType } from 'react';
import {
  createCmsQueryClient,
  disposeCmsQueryClient,
  type CmsRuntime,
  type UserDetails,
} from '@cms/platform-contract';

export const STORY_COMPANY_ID = 'story-company';

const storyUser = {
  id: 'storybook-user',
  displayName: 'Storybook User',
  email: 'storybook.user@example.com',
  role: 'Designer',
} satisfies UserDetails;

/** `companyId: null` simulates a session stored before the login captured one. */
export function createStoryRuntime(
  tenantId = 'northwind',
  companyId: string | null = STORY_COMPANY_ID,
): CmsRuntime {
  return {
    tenantId,
    currentUser: companyId ? { ...storyUser, companyId } : storyUser,
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
  storyCompanyId?: string | null;
  storyTenantId?: string;
};

export function withCmsRuntime<Props extends RuntimeProps>(
  Component: ComponentType<Props>,
) {
  return function RuntimeStory({
    storyCompanyId = STORY_COMPANY_ID,
    storyTenantId = 'northwind',
    ...props
  }: RuntimeStoryProps<Props>) {
    const runtime = useMemo(
      () => createStoryRuntime(storyTenantId, storyCompanyId),
      [storyTenantId, storyCompanyId],
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
