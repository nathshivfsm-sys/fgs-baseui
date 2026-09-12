import type { NonWorkingDaysTableProps } from '../../../types';
import { NonWorkingDayRow } from './NonWorkingDayRow';
import { NonWorkingDaysEmptyRow } from './NonWorkingDaysEmptyRow';
import { NonWorkingDaysTableSkeleton } from './NonWorkingDaysTableSkeleton';

export const NonWorkingDaysTableBody = ({
  isPending,
  items,
  onDelete,
  onEdit,
}: NonWorkingDaysTableProps) => {
  if (isPending) {
    return <NonWorkingDaysTableSkeleton />;
  }

  if (items.length === 0) {
    return <NonWorkingDaysEmptyRow />;
  }

  return items.map((row) => (
    <NonWorkingDayRow
      key={row.id}
      onDelete={onDelete}
      onEdit={onEdit}
      row={row}
    />
  ));
};
