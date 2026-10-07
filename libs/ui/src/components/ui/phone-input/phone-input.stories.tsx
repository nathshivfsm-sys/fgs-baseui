import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { PhoneInput } from './phone-input';

const meta = {
  title: 'Components/PhoneInput',
  component: PhoneInput,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    label: 'Phone Number',
    onValueChange: fn(),
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'default', 'lg'] },
    variant: { control: 'inline-radio', options: ['default', 'soft'] },
  },
  render: (args) => {
    const [value, setValue] = useState(args.value ?? '');
    return (
      <div className="w-80">
        <PhoneInput
          {...args}
          onValueChange={(digits) => {
            setValue(digits);
            args.onValueChange?.(digits);
          }}
          value={value}
        />
      </div>
    );
  },
} satisfies Meta<typeof PhoneInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', {
      name: 'Phone Number',
    });
    await userEvent.type(input, '2175550192');
    await expect(input).toHaveValue('2175550192');
    await userEvent.tab();
    await expect(input).toHaveValue('(217) 555-0192');
  },
};

export const WithValue: Story = {
  args: { value: '2175550192', required: true },
};

export const Disabled: Story = {
  args: { value: '2175550192', disabled: true },
};
export const Error: Story = {
  args: { error: 'Enter a valid phone number.', required: true },
};
