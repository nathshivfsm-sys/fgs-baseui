import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { SetupHeader } from './SetupHeader';

const meta = {
  title: 'Settings/SetupHeader',
  component: SetupHeader,
  tags: ['autodocs'],
  args: { onQueryChange: fn(), query: '' },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof SetupHeader>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { name: 'Setup' })).toBeVisible();
    await expect(canvas.getByLabelText('Search settings')).toHaveValue('');
  },
};

export const TypingCallsOnQueryChange: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    // The input is controlled by `query`, which this story holds fixed, so each
    // keystroke reports its own value rather than an accumulating string.
    await userEvent.type(canvas.getByLabelText('Search settings'), 'x');
    await expect(args.onQueryChange).toHaveBeenCalledWith('x');
  },
};
