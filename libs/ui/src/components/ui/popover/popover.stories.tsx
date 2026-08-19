import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '../button';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
  type PopoverContentProps,
} from './popover';

const meta = {
  title: 'Components/Popover',
  component: PopoverContent,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    align: { control: 'inline-radio', options: ['start', 'center', 'end'] },
    side: {
      control: 'inline-radio',
      options: ['top', 'bottom', 'left', 'right'],
    },
  },
} satisfies Meta<typeof PopoverContent>;
export default meta;
type Story = StoryObj<typeof meta>;

function Example(props: PopoverContentProps) {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" />}>
        Pricing details
      </PopoverTrigger>
      <PopoverContent {...props}>
        <PopoverHeader>
          <PopoverTitle>How price is calculated</PopoverTitle>
          <PopoverDescription>
            Material, labor, equipment, and other charges are summed before tax.
          </PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  );
}

export const Default: Story = {
  render: (args) => <Example {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Pricing details' }),
    );

    const body = within(document.body);
    const title = await body.findByText('How price is calculated');
    // The popup fades in, so wait for the enter transition to settle before
    // asserting visibility (opacity is part of `toBeVisible`).
    await waitFor(() => expect(title).toBeVisible());

    // Popovers are modal: close via keyboard so the story ends in a settled,
    // non-inert state for the a11y check.
    await userEvent.keyboard('{Escape}');
    await waitFor(() =>
      expect(
        body.queryByText('How price is calculated'),
      ).not.toBeInTheDocument(),
    );
  },
};

export const AlignedStart: Story = {
  args: { align: 'start' },
  render: (args) => <Example {...args} />,
};

export const SideTop: Story = {
  args: { side: 'top', sideOffset: 8 },
  render: (args) => <Example {...args} />,
};
