import { Skeleton } from '@cms/ui';

/** Skeleton placeholder while a federated route chunk loads. */
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
