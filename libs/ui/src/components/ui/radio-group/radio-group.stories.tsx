import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { RadioGroupField } from './radio-group';

const options = [
  { label: 'Static price', value: 'static' },
  { label: 'Dynamic price', value: 'dynamic' },
  { label: 'Unavailable', value: 'disabled', disabled: true },
];
const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroupField,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    label: 'Pricing method',
    options,
    defaultValue: 'static',
    onValueChange: fn(),
  },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
    },
  },
} satisfies Meta<typeof RadioGroupField>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const dynamic = within(canvasElement).getByRole('radio', {
      name: 'Dynamic price',
    });
    await userEvent.click(dynamic);
    await expect(dynamic).toBeChecked();
    await expect(args.onValueChange).toHaveBeenCalledWith('dynamic');
  },
};
export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    options: options.map((option) =>
      option.value === 'static'
        ? { ...option, description: 'A fixed service amount.' }
        : option,
    ),
  },
};
export const Error: Story = {
  args: {
    error: 'Choose a pricing method.',
    defaultValue: undefined,
    required: true,
  },
};
export const Disabled: Story = { args: { disabled: true } };
export const Uncontrolled: Story = {
  args: { defaultValue: 'dynamic', helperText: 'Uses defaultValue.' },
};
function ControlledExample() {
  const [value, setValue] = useState('static');
  return (
    <RadioGroupField
      label="Controlled pricing"
      onValueChange={setValue}
      options={options}
      value={value}
    />
  );
}
export const Controlled: Story = { render: () => <ControlledExample /> };
