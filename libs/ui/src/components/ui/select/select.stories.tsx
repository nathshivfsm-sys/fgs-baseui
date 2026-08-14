import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { SelectField } from './select';

const options = [
  { label: 'Maintenance', value: 'maintenance' },
  { label: 'Installation', value: 'installation' },
  { label: 'Unavailable option', value: 'disabled', disabled: true },
];
const meta = {
  title: 'Components/Select',
  component: SelectField,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    label: 'Job type',
    options,
    placeholder: 'Select type',
    onValueChange: fn(),
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'default', 'lg'] },
    error: { control: 'text' },
  },
} satisfies Meta<typeof SelectField>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const trigger = within(canvasElement).getByRole('combobox', {
      name: 'Job type',
    });
    await userEvent.click(trigger);
    await userEvent.click(
      await within(document.body).findByRole('option', { name: 'Maintenance' }),
    );
    await expect(args.onValueChange).toHaveBeenCalledWith('maintenance');
  },
};
export const Sizes: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-4">
      <SelectField {...args} label="Small" size="sm" />
      <SelectField {...args} label="Default" />
      <SelectField {...args} label="Large" size="lg" />
    </div>
  ),
};
export const Error: Story = {
  args: { error: 'Select a job type.', required: true },
};
export const Disabled: Story = { args: { disabled: true } };
export const Uncontrolled: Story = {
  args: { defaultValue: 'maintenance', helperText: 'Uses defaultValue.' },
};
function ControlledExample() {
  const [value, setValue] = useState('maintenance');
  return (
    <SelectField
      label="Controlled job type"
      onValueChange={setValue}
      options={options}
      value={value}
    />
  );
}
export const Controlled: Story = { render: () => <ControlledExample /> };
