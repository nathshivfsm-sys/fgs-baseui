import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Checkbox } from './checkbox';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { 'aria-label': 'Service taxable', onCheckedChange: fn() },
  argTypes: { size: { control: 'select', options: ['sm', 'default', 'lg'] } },
} satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const control = within(canvasElement).getByRole('checkbox', {
      name: 'Service taxable',
    });
    await userEvent.click(control);
    await expect(control).toBeChecked();
    await expect(args.onCheckedChange).toHaveBeenCalled();
  },
};
export const Checked: Story = { args: { defaultChecked: true } };
export const Indeterminate: Story = { args: { indeterminate: true } };
export const Small: Story = { args: { size: 'sm', defaultChecked: true } };
export const Large: Story = { args: { size: 'lg', defaultChecked: true } };
export const Disabled: Story = {
  args: { disabled: true, defaultChecked: true },
};
export const Invalid: Story = { args: { invalid: true } };

/**
 * `Checkbox` renders a `button[role=checkbox]`, so a visible label is linked
 * with `aria-labelledby` rather than `label[for]`.
 */
export const WithVisibleLabel: Story = {
  args: { 'aria-label': undefined, 'aria-labelledby': 'taxable-label' },
  render: (args) => (
    <div className="flex items-center gap-2 font-form text-control text-card-foreground">
      <Checkbox {...args} />
      <span id="taxable-label">Service taxable</span>
    </div>
  ),
};
