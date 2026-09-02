import type { Meta, StoryObj } from '@storybook/react-vite';
import { Field } from './field';

const meta = {
  title: 'Components/Field',
  component: Field,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    label: 'Account code',
    description: 'Used on invoices.',
    helperText: 'Up to 20 characters.',
    htmlFor: 'field-example',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['default', 'compact'] },
  },
} satisfies Meta<typeof Field>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Field {...args}>
      <input
        className="h-9 rounded-md border border-input-strong px-4"
        id="field-example"
        placeholder="Enter code"
      />
    </Field>
  ),
};
export const Required: Story = {
  args: { required: true },
  render: Default.render,
};

/** 12px medium label used by the Service Location forms. */
export const Compact: Story = {
  args: { description: undefined, required: true, size: 'compact' },
  render: Default.render,
};
export const Error: Story = {
  args: { error: 'A code is required.', helperText: undefined },
  render: Default.render,
};
export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <Field {...args}>
      <input
        className="h-9 rounded-md border border-input-strong px-4"
        disabled
        id="field-example"
      />
    </Field>
  ),
};
