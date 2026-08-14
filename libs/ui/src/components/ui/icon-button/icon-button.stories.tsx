import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { IconButton } from './icon-button';

const icon = (
  <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 16 16">
    <path
      d="M8 3v10M3 8h10"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.5"
    />
  </svg>
);
const meta = {
  title: 'Components/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { icon, label: 'Add item', onClick: fn(), variant: 'ghost' },
  argTypes: { size: { control: 'select', options: ['sm', 'default', 'lg'] } },
} satisfies Meta<typeof IconButton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button', {
      name: 'Add item',
    });
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};
export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <IconButton {...args} size="sm" />
      <IconButton {...args} />
      <IconButton {...args} size="lg" />
    </div>
  ),
};
export const Brand: Story = { args: { variant: 'brand' } };
export const Disabled: Story = { args: { disabled: true } };
export const Loading: Story = { args: { loading: true } };
