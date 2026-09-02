import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { PlusIcon } from '../../../icons';
import { IconButton } from './icon-button';

const icon = <PlusIcon className="size-4" />;
const meta = {
  title: 'Components/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { icon, label: 'Add item', onClick: fn(), variant: 'ghost' },
  argTypes: {
    size: { control: 'select', options: ['xs', 'sm', 'default', 'lg'] },
  },
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
      <IconButton {...args} size="xs" />
      <IconButton {...args} size="sm" />
      <IconButton {...args} />
      <IconButton {...args} size="lg" />
    </div>
  ),
};

/** 28px bordered actions as used by the table row action cluster. */
export const RowActions: Story = {
  args: { variant: 'surface' },
  render: (args) => (
    <div className="flex items-center gap-2">
      <IconButton {...args} label="Edit location" size="xs" />
      <IconButton {...args} label="More actions" size="xs" />
    </div>
  ),
};
export const Disabled: Story = { args: { disabled: true } };
export const Loading: Story = { args: { loading: true } };
