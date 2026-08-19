import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu';

const meta = {
  title: 'Components/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof DropdownMenu>;
export default meta;
type Story = StoryObj<typeof meta>;

function Example({ onSelect }: { onSelect?: (id: string) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="text-control font-semibold text-heading outline-none">
        Switch workspace
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onSelect?.('graceful-cleaning')}>
            Graceful Cleaning
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSelect?.('acme-hvac')}>
            Acme HVAC
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled onClick={() => onSelect?.('archived')}>
          Archived (unavailable)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const Default: Story = {
  render: () => <Example onSelect={fn()} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Switch workspace' });
    await userEvent.click(trigger);

    // Opening is asynchronous (portal + positioning), so query with findBy
    // rather than asserting on the same tick as the click.
    const body = within(document.body);
    await expect(
      await body.findByRole('menuitem', { name: 'Graceful Cleaning' }),
    ).toBeVisible();
    await expect(body.getByText('Workspaces')).toBeVisible();

    // The menu is modal: the rest of the page (including the trigger) goes
    // aria-hidden/inert while it's open, so closing has to happen via
    // keyboard rather than a second click on the now-inert trigger. Wait for
    // the close to settle so the story ends in a non-inert state.
    await userEvent.keyboard('{Escape}');
    await waitFor(() =>
      expect(
        body.queryByRole('menuitem', { name: 'Graceful Cleaning' }),
      ).not.toBeInTheDocument(),
    );
  },
};

export const SelectItem: Story = {
  render: () => {
    const onSelect = fn();
    return <Example onSelect={onSelect} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Switch workspace' });
    await userEvent.click(trigger);

    const body = within(document.body);
    const item = await body.findByRole('menuitem', { name: 'Acme HVAC' });
    await userEvent.click(item);

    // Selecting an item closes the menu; end the story in that closed state.
    await waitFor(() =>
      expect(
        body.queryByRole('menuitem', { name: 'Acme HVAC' }),
      ).not.toBeInTheDocument(),
    );
  },
};

export const DisabledItem: Story = {
  render: () => <Example onSelect={fn()} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Switch workspace' }),
    );

    const body = within(document.body);
    const disabledItem = await body.findByRole('menuitem', {
      name: 'Archived (unavailable)',
    });
    await expect(disabledItem).toHaveAttribute('data-disabled');

    await userEvent.keyboard('{Escape}');
    await waitFor(() =>
      expect(
        body.queryByRole('menuitem', { name: 'Archived (unavailable)' }),
      ).not.toBeInTheDocument(),
    );
  },
};
