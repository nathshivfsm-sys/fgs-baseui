import { QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useMemo, type ComponentType } from 'react';
import { createStore } from 'zustand/vanilla';
import {
  createCmsQueryClient,
  disposeCmsQueryClient,
  type AppState,
  type CmsRuntime,
} from '@cms/platform-contract';

export function createStoryRuntime(tenantId = 'northwind'): CmsRuntime {
  const appStore = createStore<AppState>()((set) => ({
    tenantId,
    sidebarOpen: true,
    setTenantId: (nextTenantId) => set({ tenantId: nextTenantId }),
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  }));
  const queryClient = createCmsQueryClient({
    defaultOptions: {
      queries: { staleTime: 0, gcTime: 0, retry: false },
      mutations: { retry: false },
    },
  });
  return { appStore, queryClient };
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
