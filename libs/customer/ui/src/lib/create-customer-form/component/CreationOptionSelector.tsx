import { BodySmall, Heading3, RadioGroup, RadioGroupItem } from '@cms/ui';
import type { CreationOptionSelectorProps } from '../types';

const OPTIONS = [
  {
    value: 'billToAndServiceLocation' as const,
    title: 'Bill To Customer & Service Location',
    description:
      'Create a bill-to customer and a linked service location in one step.',
  },
  {
    value: 'billToOnly' as const,
    title: 'Bill To Customer Only',
    description:
      'Create only the bill-to customer. Service locations can be added later.',
  },
];

export const CreationOptionSelector = ({
  creationOption,
  onCreationOptionChange,
}: CreationOptionSelectorProps) => {
  const handleValueChange = (value: string) => {
    if (value === 'billToAndServiceLocation' || value === 'billToOnly') {
      onCreationOptionChange(value);
    }
  };

  return (
    <RadioGroup
      className="grid gap-3 md:grid-cols-2"
      onValueChange={handleValueChange}
      orientation="vertical"
      value={creationOption}
    >
      {OPTIONS.map((option) => {
        const selected = creationOption === option.value;
        return (
          <label
            className={`flex cursor-pointer gap-3 rounded-lg border p-4 transition-colors ${
              selected
                ? 'border-action bg-action-subtle'
                : 'border-border-subtle bg-surface'
            }`}
            htmlFor={`creation-option-${option.value}`}
            key={option.value}
          >
            <RadioGroupItem
              id={`creation-option-${option.value}`}
              value={option.value}
            />
            <span className="flex flex-col gap-1">
              <Heading3 className="text-control font-semibold">
                {option.title}
              </Heading3>
              <BodySmall color="foreground-subtle">
                {option.description}
              </BodySmall>
            </span>
          </label>
        );
      })}
    </RadioGroup>
  );
};
