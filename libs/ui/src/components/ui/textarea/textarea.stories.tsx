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
    variant: { control: 'inline-radio', options: ['default', 'soft'] },
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

/** The Service Location notes appearance, including the character counter. */
export const SoftWithCount: Story = {
  args: {
    label: 'Internal Notes',
    maxLength: 2000,
    placeholder: 'Enter internal notes about the location...',
    showCount: true,
    variant: 'soft',
  },
  render: (args) => (
    <div className="w-[34rem]">
      <Textarea {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('0/2000')).toBeVisible();
    await userEvent.type(
      canvas.getByRole('textbox', { name: 'Internal Notes' }),
      'Client prefers monthly invoices.',
    );
    await expect(canvas.getByText('32/2000')).toBeVisible();
  },
};
