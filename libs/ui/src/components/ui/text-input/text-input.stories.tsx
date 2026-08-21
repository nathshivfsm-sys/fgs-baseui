import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { CloseIcon, SearchIcon } from '../../../icons';
import { TextInput } from './text-input';

const meta = {
  title: 'Components/TextInput',
  component: TextInput,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { label: 'Code', placeholder: 'Enter code', onChange: fn() },
  argTypes: {
    size: { control: 'select', options: ['sm', 'default', 'lg'] },
    variant: { control: 'inline-radio', options: ['default', 'soft'] },
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
export const Variants: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-4">
      <TextInput {...args} label="Default" />
      <TextInput {...args} label="Soft" variant="soft" />
    </div>
  ),
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

/** The Service Location form appearance: hairline border, 12px padding, 12px label. */
export const Soft: Story = {
  args: {
    label: 'Location Name',
    placeholder: 'Location Name',
    required: true,
    variant: 'soft',
  },
};

/** Icon and clear button sit inside the control border. */
export const SearchWithClear: Story = {
  args: {
    label: 'Search AR customer',
    placeholder: 'Search AR customer by name, phone or email...',
    startAdornment: <SearchIcon className="size-3.5" />,
    variant: 'soft',
    action: (
      <button
        aria-label="Clear search"
        className="flex shrink-0 items-center rounded-sm text-icon-muted outline-none hover:text-action focus-visible:ring-[2px] focus-visible:ring-ring/40"
        type="button"
      >
        <CloseIcon className="size-3" />
      </button>
    ),
  },
  play: async ({ canvasElement }) => {
    const clear = within(canvasElement).getByRole('button', {
      name: 'Clear search',
    });
    await expect(clear).toBeVisible();
    await userEvent.click(clear);
  },
};
