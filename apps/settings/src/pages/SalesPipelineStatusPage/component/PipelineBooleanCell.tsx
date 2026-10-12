import { CircleCheckIcon, CircleXIcon } from '@cms/ui';

export interface PipelineBooleanCellProps {
  value: boolean;
}

export const PipelineBooleanCell = ({ value }: PipelineBooleanCellProps) =>
  value ? (
    <CircleCheckIcon aria-label="Yes" className="mx-auto size-4 text-success" />
  ) : (
    <CircleXIcon aria-label="No" className="mx-auto size-4 text-destructive" />
  );
