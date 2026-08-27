import type { DataTableStatusProps } from '../types';
import { getDataTableStatusMessage } from '../utils';

/** Screen-reader announcement for loading and result state changes. */
export function DataTableStatusMessage({
  id,
  rowCount,
  rowLabel,
  status,
}: DataTableStatusProps) {
  return (
    <div
      aria-live="polite"
      className="sr-only"
      id={id}
      role={status === 'error' ? 'alert' : 'status'}
    >
      {getDataTableStatusMessage(status, rowLabel, rowCount)}
    </div>
  );
}
