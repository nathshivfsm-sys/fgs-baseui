import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Textarea } from './textarea';

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { label: 'Item description', placeholder: 'Write a description' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'default', 'lg'] },
    error: { control: 'text' },
  },
} satisfies Meta<typeof Textarea>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const field = within(canvasElement).getByRole('textbox', {
      name: 'Item description',
    });
    await userEvent.click(field);
    await userEvent.type(field, 'Annual maintenance');
    await expect(field).toHaveValue('Annual maintenance');
  },
};
export const Sizes: Story = {
  render: (args) => (
    <div className="w-[30rem] space-y-4">
      <Textarea {...args} label="Small" size="sm" />
      <Textarea {...args} label="Default" />
      <Textarea {...args} label="Large" size="lg" />
    </div>
  ),
};
export const Error: Story = {
  args: { error: 'Description is required.', required: true },
};
export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'Unavailable' },
};
export const ReadOnly: Story = {
  args: { readOnly: true, value: 'Locked description' },
};
function ControlledExample() {
  const [value, setValue] = useState('Controlled');
  return (
    <Textarea
      label="Controlled"
      onChange={(event) => setValue(event.target.value)}
      value={value}
    />
  );
}
export const Controlled: Story = { render: () => <ControlledExample /> };
export const Uncontrolled: Story = {
  args: {
    defaultValue: 'Uncontrolled',
    helperText: 'Resize vertically when more room is needed.',
  },
};
