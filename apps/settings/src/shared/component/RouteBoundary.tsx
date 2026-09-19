import { Suspense, type ReactNode } from 'react';
import { Skeleton } from '@cms/ui';

export function RouteLoadingFallback() {
  return (
    <div
      aria-busy="true"
      className="flex min-h-0 flex-1 flex-col gap-4"
      role="status"
    >
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="min-h-80 w-full flex-1" />
    </div>
  );
}

/** Per-route Suspense so navigation shows a fallback while lazy chunks load. */
export function RouteBoundary({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>{children}</Suspense>
  );
}
