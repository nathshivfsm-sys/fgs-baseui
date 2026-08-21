import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
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

function slotText(canvasElement: HTMLElement) {
  return Array.from(
    canvasElement.querySelectorAll('[data-slot="input-otp-slot"]'),
  )
    .map((slot) => slot.textContent?.trim() ?? '')
    .join('');
}

/** Pins the 360px column the Login screens lay these cells out in. */
const withLoginColumn: Decorator = (Story) => (
  <div className="w-[360px]">
    <Story />
  </div>
);

/**
 * `OTPInput`'s props are a `render`-or-`children` union, so these stories pass
 * the composition through `args.children` and let Storybook's default render
 * apply it, rather than spreading the union in a custom `render`.
 *
 * The decorator pins the 360px column from the Login designs, where the cells
 * share the row width (6 cells => 53.33px, 4 cells => 84px).
 */
const meta = {
  title: 'Components/InputOTP',
  component: InputOTP,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [withLoginColumn],
  args: {
    'aria-label': 'Verification code',
    children: <InputOTPGroup>{slots([0, 1, 2, 3, 4, 5])}</InputOTPGroup>,
    maxLength: 6,
    onChange: fn(),
  },
} satisfies Meta<typeof InputOTP>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Six-digit verification code, matching the Login "Enter verification code" screen. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const field = within(canvasElement).getByRole('textbox', {
      name: 'Verification code',
    });
    await userEvent.type(field, '123456');
    await expect(field).toHaveValue('123456');
    // Each character is rendered by its own cell.
    await expect(slotText(canvasElement)).toBe('123456');
  },
};

/** Four-digit PIN, matching the Login "Confirm your PIN" screen. */
export const PinEntry: Story = {
  args: {
    'aria-label': 'PIN',
    children: <InputOTPGroup>{slots([0, 1, 2, 3])}</InputOTPGroup>,
    maxLength: 4,
  },
  play: async ({ canvasElement }) => {
    const field = within(canvasElement).getByRole('textbox', { name: 'PIN' });
    await userEvent.type(field, '4821');
    await expect(slotText(canvasElement)).toBe('4821');

    // Figma: 4 cells sharing 360px with an 8px gap => 84px each, 52px tall.
    const cell = canvasElement
      .querySelector('[data-slot="input-otp-slot"]')!
      .getBoundingClientRect();
    await expect(Math.abs(cell.width - 84)).toBeLessThan(0.5);
    await expect(Math.round(cell.height)).toBe(52);
  },
};

/**
 * Cells stretch to share the row, so the same component covers both Login
 * screens without fixed widths.
 */
export const FillsAvailableWidth: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <div className="w-[360px]">
        <InputOTP {...args} />
      </div>
      <div className="w-[240px]">
        <InputOTP {...args} />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [wide, narrow] = Array.from(
      canvasElement.querySelectorAll<HTMLElement>(
        '[data-slot="input-otp-slot"]',
      ),
    ).reduce<HTMLElement[][]>(
      (rows, slot) => {
        rows[rows[0].length < 6 ? 0 : 1].push(slot);
        return rows;
      },
      [[], []],
    );
    // Same cell count, wider container: cells grew rather than staying fixed.
    await expect(wide[0].getBoundingClientRect().width).toBeGreaterThan(
      narrow[0].getBoundingClientRect().width,
    );
    // Figma: 6 cells sharing 360px with an 8px gap => 53.33px each.
    await expect(
      Math.abs(wide[0].getBoundingClientRect().width - 53.33),
    ).toBeLessThan(0.5);
    // Height is fixed at the designed 52px in both.
    await expect(Math.round(wide[0].getBoundingClientRect().height)).toBe(52);
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

/**
 * Not specified in Figma: every cell in the designs is empty, so the invalid
 * treatment follows the library's form convention.
 */
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
