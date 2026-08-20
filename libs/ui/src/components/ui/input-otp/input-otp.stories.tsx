import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from './input-otp';

function slots(indexes: readonly number[]) {
  return indexes.map((index) => <InputOTPSlot index={index} key={index} />);
}

/**
 * `OTPInput`'s props are a `render`-or-`children` union, so these stories pass
 * the composition through `args.children` and let Storybook's default render
 * apply it, rather than spreading the union in a custom `render`.
 */
const meta = {
  title: 'Components/InputOTP',
  component: InputOTP,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    'aria-label': 'Verification code',
    children: <InputOTPGroup>{slots([0, 1, 2, 3, 4, 5])}</InputOTPGroup>,
    maxLength: 6,
    onChange: fn(),
  },
} satisfies Meta<typeof InputOTP>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const field = within(canvasElement).getByRole('textbox', {
      name: 'Verification code',
    });
    await userEvent.type(field, '123456');
    await expect(field).toHaveValue('123456');
  },
};

/** Separate groups to chunk longer codes. */
export const Grouped: Story = {
  args: {
    children: (
      <>
        <InputOTPGroup>{slots([0, 1, 2])}</InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>{slots([3, 4, 5])}</InputOTPGroup>
      </>
    ),
  },
};

export const Disabled: Story = { args: { disabled: true } };

export const Invalid: Story = {
  args: {
    'aria-invalid': true,
    children: (
      <InputOTPGroup>
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <InputOTPSlot aria-invalid index={index} key={index} />
        ))}
      </InputOTPGroup>
    ),
  },
};

export const FourDigits: Story = {
  args: {
    children: <InputOTPGroup>{slots([0, 1, 2, 3])}</InputOTPGroup>,
    maxLength: 4,
  },
};
