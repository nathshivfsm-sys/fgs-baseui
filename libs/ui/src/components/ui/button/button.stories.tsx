import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Button } from './button';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'brand',
        'subtle',
        'secondary',
        'destructive',
        'outline',
        'ghost',
      ],
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg', 'iconSm', 'icon', 'iconLg'],
    },
    asChild: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
  args: { children: 'Continue', onClick: fn() },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button', {
      name: 'Continue',
    });
    await userEvent.tab();
    await expect(button).toHaveFocus();
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};
export const Brand: Story = { args: { variant: 'brand' } };
export const Subtle: Story = { args: { variant: 'subtle' } };
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Destructive: Story = {
  args: { children: 'Delete', variant: 'destructive' },
};
export const Outline: Story = { args: { variant: 'outline' } };
export const Ghost: Story = { args: { variant: 'ghost' } };
export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args}>Default</Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </div>
  ),
};
export const Disabled: Story = { args: { disabled: true } };
export const Loading: Story = {
  args: { loading: true, loadingText: 'Saving…' },
};
export const AsLink: Story = {
  args: { asChild: true },
  render: (args) => (
    <Button {...args}>
      <a href="#button-stories">View documentation</a>
    </Button>
  ),
};
