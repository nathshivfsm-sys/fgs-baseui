import { SectionCard, Skeleton } from '@cms/ui';

const FIELD_ROWS = 6;

/** Two-column placeholder shaped like the General Info card while the GET is pending. */
export const GeneralInfoSkeleton = () => (
  <SectionCard
    aria-busy="true"
    aria-label="Loading company details"
    className="grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]"
    padding="none"
    radius="panel"
    role="status"
    tone="soft"
  >
    <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 lg:border-r lg:border-border-subtle">
      {Array.from({ length: FIELD_ROWS * 2 }, (_, index) => (
        <Skeleton className="h-control" key={index} />
      ))}
    </div>
    <div className="space-y-3 border-t border-border-subtle p-5 lg:border-t-0">
      {Array.from({ length: FIELD_ROWS }, (_, index) => (
        <Skeleton className="h-6" key={index} />
      ))}
    </div>
  </SectionCard>
);
