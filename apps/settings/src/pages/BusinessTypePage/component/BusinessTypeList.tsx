import { Skeleton } from '@cms/ui';
import { LOADING_BUSINESS_TYPES_LABEL } from '../constant';
import type { BusinessTypeListProps } from '../types';
import { BusinessTypeRow } from './BusinessTypeRow';

const SKELETON_ROW_KEYS = ['one', 'two', 'three', 'four'] as const;

export const BusinessTypeList = ({
  enablingId,
  items,
  onEnable,
}: BusinessTypeListProps) => (
  <ul className="m-0 flex list-none flex-col p-0">
    {items.map((record) => (
      <BusinessTypeRow
        enabling={enablingId === record.id}
        key={record.id}
        onEnable={onEnable}
        record={record}
      />
    ))}
  </ul>
);

export const BusinessTypeListSkeleton = () => (
  <div
    aria-label={LOADING_BUSINESS_TYPES_LABEL}
    className="flex flex-col"
    role="status"
  >
    {SKELETON_ROW_KEYS.map((key) => (
      <Skeleton className="mx-3.5 my-[11px] h-[34px] rounded-lg" key={key} />
    ))}
  </div>
);
