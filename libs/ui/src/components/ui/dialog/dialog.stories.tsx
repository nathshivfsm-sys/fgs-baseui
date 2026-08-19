import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '../button';
import { TextInput } from '../text-input';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  type DialogContentProps,
} from './dialog';

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Dialog>;
export default meta;
type Story = StoryObj<typeof meta>;

function Example(props: DialogContentProps) {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>
        Edit location
      </DialogTrigger>
      <DialogContent {...props}>
        <DialogHeader>
          <DialogTitle>Edit service location</DialogTitle>
          <DialogDescription>
            Changes apply to future work orders only.
          </DialogDescription>
        </DialogHeader>
        <TextInput defaultValue="1200 Market Street" label="Street" />
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Cancel
          </DialogClose>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const Default: Story = {
  render: () => <Example />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Edit location' }),
    );

    const body = within(document.body);
    const dialog = await body.findByRole('dialog');
    // The popup fades in, so wait for the enter transition to settle before
    // asserting visibility (opacity is part of `toBeVisible`).
    await waitFor(() => expect(dialog).toBeVisible());
    await expect(
      body.getByRole('button', { name: 'Close' }),
    ).toBeInTheDocument();

    // Dialogs are modal: the trigger is inert while open, so close via keyboard.
    await userEvent.keyboard('{Escape}');
    await waitFor(() =>
      expect(body.queryByRole('dialog')).not.toBeInTheDocument(),
    );
  },
};

/** Omit the corner close action when the user must pick an explicit outcome. */
export const WithoutCloseButton: Story = {
  render: () => <Example showCloseButton={false} />,
};

export const FooterCloseAction: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>
        Show details
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pricing breakdown</DialogTitle>
          <DialogDescription>
            Material, labor, equipment, and other charges.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  ),
};
