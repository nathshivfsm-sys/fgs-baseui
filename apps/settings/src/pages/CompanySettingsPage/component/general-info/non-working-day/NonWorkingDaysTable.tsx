import { Table, TableBody, TableHead, TableHeader, TableRow } from '@cms/ui';
import type { NonWorkingDaysTableProps } from '../../../types';
import { NonWorkingDaysTableBody } from './NonWorkingDaysTableBody';

export const NonWorkingDaysTable = ({
  isPending,
  items,
  onDelete,
  onEdit,
}: NonWorkingDaysTableProps) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Date</TableHead>
        <TableHead>Day</TableHead>
        <TableHead>Description</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <NonWorkingDaysTableBody
        isPending={isPending}
        items={items}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    </TableBody>
  </Table>
);
