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
        'action',
        'subtle',
        'secondary',
        'destructive',
        'outline',
        'surface',
        'ghost',
      ],
    },
    size: {
      control: 'select',
      options: [
        'sm',
        'default',
        'lg',
        'compact',
        'comfortable',
        'iconXs',
        'iconSm',
        'icon',
        'iconLg',
      ],
    },
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
export const Subtle: Story = { args: { variant: 'subtle' } };
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Destructive: Story = {
  args: { children: 'Delete', variant: 'destructive' },
};
export const Outline: Story = { args: { variant: 'outline' } };
export const Ghost: Story = { args: { variant: 'ghost' } };

/** Interactive blue primary from the Service Location screens. */
export const Action: Story = {
  args: { children: 'Add new location', variant: 'action' },
};

/** White card surface used for Import, Export, Filter, Columns, and Cancel. */
export const Surface: Story = {
  args: { children: 'Import', variant: 'surface' },
};

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

/** 34px toolbar and 38px page-action densities measured from the designs. */
export const Densities: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Button {...args} size="compact" variant="surface">
        Filter
      </Button>
      <Button {...args} size="comfortable" variant="surface">
        Export
      </Button>
      <Button {...args} size="comfortable" variant="action">
        Add new location
      </Button>
    </div>
  ),
};
export const Disabled: Story = { args: { disabled: true } };
export const Loading: Story = {
  args: { loading: true, loadingText: 'Saving…' },
};
export const AsLink: Story = {
  args: { render: <a href="#button-stories" /> },
  render: (args) => <Button {...args}>View documentation</Button>,
};
