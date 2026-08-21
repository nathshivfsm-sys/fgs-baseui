import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { PhoneInput } from './phone-input';

const meta = {
  title: 'Components/PhoneInput',
  component: PhoneInput,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    label: 'Phone Number',
    onChange: fn(),
    onCountryChange: fn(),
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'default', 'lg'] },
    variant: { control: 'inline-radio', options: ['default', 'soft'] },
  },
  render: (args) => (
    <div className="w-80">
      <PhoneInput {...args} />
    </div>
  ),
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
  },
};

export const WithValue: Story = {
  args: { defaultValue: '(217) 555-0192', required: true },
};

export const ChangeCountry: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('🇺🇸')).toBeVisible();
    await userEvent.click(
      canvas.getByRole('combobox', { name: 'Country calling code' }),
    );
    await userEvent.click(
      await within(document.body).findByRole('option', {
        name: /United Kingdom/,
      }),
    );
    await expect(args.onCountryChange).toHaveBeenCalledWith('GB');
    // Let the popup finish closing so the accessibility scan runs against the
    // settled state rather than a mid-animation tree.
    await waitFor(() =>
      expect(within(document.body).queryByRole('listbox')).toBeNull(),
    );
    // The trigger flag reflects the new selection even though `country` is
    // left uncontrolled by this story.
    await expect(canvas.getByText('🇬🇧')).toBeVisible();
  },
};

export const Disabled: Story = {
  args: { defaultValue: '(217) 555-0192', disabled: true },
};
export const Error: Story = {
  args: { error: 'Enter a valid phone number.', required: true },
};
