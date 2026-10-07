import { useEffect, useRef } from 'react';
import { cn } from '../../../lib/cn';
import { ScrollArea } from '../scroll-area';

export interface TimePickerColumnProps {
  label: string;
  onValueChange: (value: string) => void;
  options: readonly string[];
  value: string;
}

export const TimePickerColumn = ({
  label,
  onValueChange,
  options,
  value,
}: TimePickerColumnProps) => {
  const selectedRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    selectedRef.current?.scrollIntoView({ block: 'center' });
  }, [value]);

  const handleOptionClick = (option: string) => {
    onValueChange(option);
  };

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <span className="text-caption font-medium text-foreground-subtle">
        {label}
      </span>
      <ScrollArea className="h-44 rounded-md border border-border-subtle bg-surface">
        <div className="flex flex-col gap-0.5 p-1" role="listbox">
          {options.map((option) => {
            const selected = option === value;
            return (
              <button
                aria-selected={selected}
                className={cn(
                  'rounded-sm px-2 py-1.5 text-center text-control text-surface-foreground outline-none transition-colors hover:bg-primary-subtle focus-visible:ring-2 focus-visible:ring-ring/30',
                  selected &&
                    'bg-primary-subtle font-medium text-primary-subtle-foreground',
                )}
                key={option}
                onClick={() => handleOptionClick(option)}
                ref={selected ? selectedRef : undefined}
                role="option"
                type="button"
              >
                {option}
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
