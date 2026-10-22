import { CircleCheckFilledIcon, CircleXFilledIcon } from '@cms/ui';

export interface PipelineBooleanCellProps {
  value: boolean;
}

export const PipelineBooleanCell = ({ value }: PipelineBooleanCellProps) =>
  value ? (
    <CircleCheckFilledIcon
      aria-label="Yes"
      className="mx-auto size-[18px] text-success"
    />
  ) : (
    <CircleXFilledIcon
      aria-label="No"
      className="mx-auto size-[18px] text-destructive"
    />
  );
