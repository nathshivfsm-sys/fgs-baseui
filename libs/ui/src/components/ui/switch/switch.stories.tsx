import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { SwitchField } from './switch';

const meta = {
  title: 'Components/Switch',
  component: SwitchField,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    label: 'Service taxable',
    defaultChecked: true,
    onCheckedChange: fn(),
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'default'] },
    labelPosition: { control: 'inline-radio', options: ['before', 'after'] },
  },
} satisfies Meta<typeof SwitchField>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const control = within(canvasElement).getByRole('switch', {
      name: 'Service taxable',
    });
    await userEvent.click(control);
    await expect(control).not.toBeChecked();
    await expect(args.onCheckedChange).toHaveBeenCalledWith(false);
  },
};
export const Small: Story = { args: { size: 'sm' } };
export const LabelAfter: Story = { args: { labelPosition: 'after' } };
export const Disabled: Story = { args: { disabled: true } };
export const Error: Story = {
  args: { error: 'Tax status could not be saved.' },
};
