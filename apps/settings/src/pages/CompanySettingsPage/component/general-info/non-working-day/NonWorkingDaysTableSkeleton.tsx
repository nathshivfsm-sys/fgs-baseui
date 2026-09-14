import { Skeleton, TableCell, TableRow } from '@cms/ui';

export const NonWorkingDaysTableSkeleton = () =>
  Array.from({ length: 4 }, (_, index) => (
    <TableRow key={index}>
      <TableCell colSpan={4}>
        <Skeleton className="h-6" />
      </TableCell>
    </TableRow>
  ));
