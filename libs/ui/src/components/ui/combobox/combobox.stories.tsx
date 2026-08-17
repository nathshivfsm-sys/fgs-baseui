import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ComboboxField } from './combobox';

const options = [
  { label: 'Alex Morgan', value: 'alex-morgan' },
  { label: 'Jamie Rivera', value: 'jamie-rivera' },
  { label: 'Priya Sharma', value: 'priya-sharma' },
  { label: 'Unavailable technician', value: 'disabled', disabled: true },
];
const meta = {
  title: 'Components/Combobox',
  component: ComboboxField,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    label: 'Assign to',
    options,
    placeholder: 'Search technicians…',
    onValueChange: fn(),
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'default', 'lg'] },
    error: { control: 'text' },
  },
} satisfies Meta<typeof ComboboxField>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const input = within(canvasElement).getByRole('combobox', {
      name: 'Assign to',
    });
    await userEvent.type(input, 'Jamie');
    await expect(
      within(document.body).getByRole('option', { name: 'Jamie Rivera' }),
    ).toBeVisible();
    await expect(
      within(document.body).queryByRole('option', { name: 'Alex Morgan' }),
    ).not.toBeInTheDocument();

    await userEvent.click(
      within(document.body).getByRole('option', { name: 'Jamie Rivera' }),
    );
    await expect(args.onValueChange).toHaveBeenCalledWith('jamie-rivera');
    await expect(input).toHaveValue('Jamie Rivera');
  },
};

export const Empty: Story = {
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('combobox', {
      name: 'Assign to',
    });
    await userEvent.type(input, 'nobody matches this');
    await expect(
      within(document.body).getByText('No results found.'),
    ).toBeVisible();
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-4">
      <ComboboxField {...args} label="Small" size="sm" />
      <ComboboxField {...args} label="Default" />
      <ComboboxField {...args} label="Large" size="lg" />
    </div>
  ),
};

export const Error: Story = {
  args: { error: 'Choose a technician.', required: true },
};

export const Disabled: Story = { args: { disabled: true } };
