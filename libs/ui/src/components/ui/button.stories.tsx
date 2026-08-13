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
      options: ['default', 'secondary', 'destructive', 'outline', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg'],
    },
    asChild: { control: 'boolean' },
  },
  args: {
    children: 'Continue',
    onClick: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Continue' });
    await userEvent.tab();
    await expect(button).toHaveFocus();
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

export const Secondary: Story = { args: { variant: 'secondary' } };
export const Destructive: Story = {
  args: { children: 'Delete', variant: 'destructive' },
};
export const Outline: Story = { args: { variant: 'outline' } };
export const Ghost: Story = { args: { variant: 'ghost' } };
export const Small: Story = { args: { size: 'sm' } };
export const Large: Story = { args: { size: 'lg' } };
export const Disabled: Story = { args: { disabled: true } };

export const AsLink: Story = {
  args: { asChild: true },
  render: (args) => (
    <Button {...args}>
      <a href="#button-stories">View documentation</a>
    </Button>
  ),
};
