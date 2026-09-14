import { TableCell, TableRow } from '@cms/ui';
import { EMPTY_COPY } from '../../../constant';

export const NonWorkingDaysEmptyRow = () => (
  <TableRow>
    <TableCell className="text-foreground-subtle" colSpan={4}>
      {EMPTY_COPY}
    </TableCell>
  </TableRow>
);
