import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '../button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  type DrawerProps,
} from './drawer';

const meta = {
  title: 'Components/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    swipeDirection: {
      control: 'inline-radio',
      options: ['down', 'up', 'left', 'right'],
    },
  },
} satisfies Meta<typeof Drawer>;
export default meta;
type Story = StoryObj<typeof meta>;

function Example(props: DrawerProps) {
  return (
    <Drawer {...props}>
      <DrawerTrigger render={<Button variant="outline" />}>
        Open filters
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filter work orders</DrawerTitle>
          <DrawerDescription>
            Narrow the list by status, priority, and assignee.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button>Apply</Button>
          <DrawerClose render={<Button variant="outline" />}>
            Cancel
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export const Default: Story = {
  render: (args) => <Example {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Open filters' }));

    const body = within(document.body);
    const drawer = await body.findByRole('dialog');
    await waitFor(() => expect(drawer).toBeVisible());
    await expect(body.getByText('Filter work orders')).toBeVisible();

    // Modal while open, so close via keyboard rather than the inert trigger.
    await userEvent.keyboard('{Escape}');
    await waitFor(() =>
      expect(body.queryByRole('dialog')).not.toBeInTheDocument(),
    );
  },
};

/** Side drawers swipe along the x axis and get a fixed width instead. */
export const FromRight: Story = {
  args: { swipeDirection: 'right' },
  render: (args) => <Example {...args} />,
};

export const WithSwipeHandle: Story = {
  args: { showSwipeHandle: true },
  render: (args) => <Example {...args} />,
};

/** Snap points let the drawer rest part-way open before expanding. */
export const WithSnapPoints: Story = {
  args: { snapPoints: [0.4, 1] },
  render: (args) => <Example {...args} />,
};
