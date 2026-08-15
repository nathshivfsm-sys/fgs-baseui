import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { SearchIcon } from '../../../icons';
import { TextInput } from './text-input';

const meta = {
  title: 'Components/TextInput',
  component: TextInput,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { label: 'Code', placeholder: 'Enter code', onChange: fn() },
  argTypes: {
    size: { control: 'select', options: ['sm', 'default', 'lg'] },
    error: { control: 'text' },
  },
} satisfies Meta<typeof TextInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', { name: 'Code' });
    await userEvent.click(input);
    await userEvent.type(input, 'HVAC-01');
    await expect(input).toHaveValue('HVAC-01');
  },
};
export const Sizes: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-4">
      <TextInput {...args} label="Small" size="sm" />
      <TextInput {...args} label="Default" />
      <TextInput {...args} label="Large" size="lg" />
    </div>
  ),
};
export const Error: Story = {
  args: { error: 'Code is required.', required: true },
};
export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'HVAC-01' },
};
export const ReadOnly: Story = { args: { readOnly: true, value: 'HVAC-01' } };
export const Loading: Story = {
  args: { loading: true, value: 'Checking availability' },
};
export const Search: Story = {
  args: {
    label: 'Search',
    placeholder: 'Search anything',
    startAdornment: <SearchIcon className="size-4" />,
  },
};
