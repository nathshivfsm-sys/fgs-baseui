import { EditIcon, IconButton, TableCell, TableRow, TrashIcon } from '@cms/ui';
import type { NonWorkingDayRowProps } from '../../../types';
import { formatNonWorkingDate, weekdayName } from '../../../util';

export const NonWorkingDayRow = ({
  onDelete,
  onEdit,
  row,
}: NonWorkingDayRowProps) => {
  const description = row.name?.trim() || '—';

  const handleEdit = () => {
    onEdit(row);
  };

  const handleDelete = () => {
    onDelete(row);
  };

  return (
    <TableRow>
      <TableCell className="whitespace-nowrap">
        {formatNonWorkingDate(row.nonWorkingDate)}
      </TableCell>
      <TableCell>{weekdayName(row.nonWorkingDate)}</TableCell>
      <TableCell>{description}</TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <IconButton
            className="text-action"
            icon={<EditIcon className="size-4" />}
            label={`Edit ${description}`}
            onClick={handleEdit}
            size="xs"
            type="button"
            variant="ghost"
          />
          <IconButton
            className="text-destructive"
            icon={<TrashIcon className="size-4" />}
            label={`Delete ${description}`}
            onClick={handleDelete}
            size="xs"
            type="button"
            variant="ghost"
          />
        </div>
      </TableCell>
    </TableRow>
  );
};
