import { Suspense, type ReactNode } from 'react';
import { Skeleton } from '@cms/ui';

export function RouteLoadingFallback() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading page"
      className="flex min-h-0 flex-1 flex-col gap-4 px-8 pt-5"
      role="status"
    >
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-10 w-72 max-w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="min-h-80 w-full flex-1" />
    </div>
  );
}

/** Per-route Suspense so navigation shows a fallback while lazy chunks load. */
export function RouteBoundary({ children }: { children: ReactNode }) {
  return <Suspense fallback={<RouteLoadingFallback />}>{children}</Suspense>;
}
