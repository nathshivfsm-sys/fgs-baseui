import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { EditIcon } from '../../../icons';
import { IconButton } from '../icon-button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  type TooltipContentProps,
} from './tooltip';

const meta = {
  title: 'Components/Tooltip',
  component: TooltipContent,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    side: {
      control: 'inline-radio',
      options: ['top', 'bottom', 'left', 'right'],
    },
    align: { control: 'inline-radio', options: ['start', 'center', 'end'] },
  },
} satisfies Meta<typeof TooltipContent>;
export default meta;
type Story = StoryObj<typeof meta>;

function Example(props: TooltipContentProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          render={
            <IconButton icon={<EditIcon />} label="Edit" variant="ghost" />
          }
        />
        <TooltipContent {...props}>Edit service location</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export const Default: Story = {
  render: (args) => <Example {...args} />,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Edit' });
    await userEvent.hover(trigger);

    const body = within(document.body);
    const tooltip = await body.findByText('Edit service location');
    // The popup fades in, so wait for the enter transition to settle.
    await waitFor(() => expect(tooltip).toBeVisible());

    await userEvent.unhover(trigger);
    await waitFor(() =>
      expect(body.queryByText('Edit service location')).not.toBeInTheDocument(),
    );
  },
};

export const SideRight: Story = {
  args: { side: 'right' },
  render: (args) => <Example {...args} />,
};

export const WithoutArrow: Story = {
  args: { showArrow: false },
  render: (args) => <Example {...args} />,
};

/** Keyboard focus opens the tooltip too, which is how it stays accessible. */
export const OpenOnFocus: Story = {
  render: (args) => <Example {...args} />,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Edit' });
    trigger.focus();

    const body = within(document.body);
    await waitFor(() =>
      expect(body.getByText('Edit service location')).toBeVisible(),
    );

    trigger.blur();
    await waitFor(() =>
      expect(body.queryByText('Edit service location')).not.toBeInTheDocument(),
    );
  },
};
