import { CircleCheckFilledIcon, CircleXFilledIcon } from '@cms/ui';

interface BooleanCellProps {
  value: boolean;
}

export const BooleanCell = ({ value }: BooleanCellProps) =>
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
