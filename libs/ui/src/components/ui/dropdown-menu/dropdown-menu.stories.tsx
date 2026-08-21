import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import {
  EditIcon,
  HomeIcon,
  MoreHorizontalIcon,
  PaymentIcon,
  PlusIcon,
  TrashIcon,
  UsersIcon,
} from '../../../icons';
import { IconButton } from '../icon-button';
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

/**
 * Record actions menu from the Service Location detail design: an icon-only
 * bordered trigger, leading icons, a separator, and a destructive last item.
 */
function RecordActionsExample({
  onSelect,
}: {
  onSelect?: (id: string) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <IconButton
            icon={<MoreHorizontalIcon />}
            label="AR customer actions"
            variant="surface"
          />
        }
      />
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onSelect?.('edit')}>
          <EditIcon />
          Edit AR Customer
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSelect?.('view-locations')}>
          <HomeIcon />
          View All Locations (3)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSelect?.('new-location')}>
          <PlusIcon />
          New Location
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSelect?.('contacts')}>
          <UsersIcon />
          Manage Contacts
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSelect?.('payment-methods')}>
          <PaymentIcon />
          Manage Payment Methods
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onSelect?.('delete')}
          variant="destructive"
        >
          <TrashIcon />
          Delete AR Customer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Text trigger with a labelled group, used by the grouping stories. */
function WorkspaceExample({ onSelect }: { onSelect?: (id: string) => void }) {
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
  render: () => <RecordActionsExample onSelect={fn()} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    await userEvent.click(
      canvas.getByRole('button', { name: 'AR customer actions' }),
    );

    // Opening is asynchronous (portal + positioning), so query with findBy
    // rather than asserting on the same tick as the click.
    const newLocation = await body.findByRole('menuitem', {
      name: 'New Location',
    });
    const destructive = body.getByRole('menuitem', {
      name: 'Delete AR Customer',
    });
    await expect(newLocation).toBeVisible();

    // Highlighting tints the row and recolours both label and icon. The item
    // animates via transition-colors, so wait for the computed values to land
    // rather than reading them the instant data-highlighted appears.
    await userEvent.hover(newLocation);
    await waitFor(() =>
      expect(newLocation).toHaveAttribute('data-highlighted'),
    );
    await waitFor(() =>
      expect(getComputedStyle(newLocation).backgroundColor).not.toBe(
        'rgba(0, 0, 0, 0)',
      ),
    );
    const icon = newLocation.querySelector('svg')!;
    await waitFor(() =>
      expect(getComputedStyle(icon).color).toBe(
        getComputedStyle(newLocation).color,
      ),
    );

    // The destructive item reads red while resting, unlike its siblings.
    await expect(getComputedStyle(destructive).color).not.toBe(
      getComputedStyle(body.getByRole('menuitem', { name: 'Manage Contacts' }))
        .color,
    );

    // Rows are the designed 36px minimum and the highlight is inset from the
    // popup edge by the popup's own padding.
    const rowBox = newLocation.getBoundingClientRect();
    await expect(rowBox.height).toBeGreaterThanOrEqual(36);
    const popupBox = newLocation
      .closest('[role="menu"]')!
      .getBoundingClientRect();
    await expect(rowBox.left - popupBox.left).toBeGreaterThan(2);

    // The menu is modal: the rest of the page (including the trigger) goes
    // aria-hidden/inert while it's open, so closing has to happen via keyboard
    // rather than a second click on the now-inert trigger. Wait for the close
    // to settle so the story ends in a non-inert state.
    await userEvent.keyboard('{Escape}');
    await waitFor(() =>
      expect(
        body.queryByRole('menuitem', { name: 'New Location' }),
      ).not.toBeInTheDocument(),
    );
  },
};

/** Items chunked under a group label. */
export const WithGroupLabel: Story = {
  render: () => <WorkspaceExample onSelect={fn()} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Switch workspace' }),
    );

    const body = within(document.body);
    await expect(
      await body.findByRole('menuitem', { name: 'Graceful Cleaning' }),
    ).toBeVisible();
    await expect(body.getByText('Workspaces')).toBeVisible();

    await userEvent.keyboard('{Escape}');
    await waitFor(() =>
      expect(
        body.queryByRole('menuitem', { name: 'Graceful Cleaning' }),
      ).not.toBeInTheDocument(),
    );
  },
};

export const SelectItem: Story = {
  render: () => <RecordActionsExample onSelect={fn()} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('button', { name: 'AR customer actions' }),
    );

    const body = within(document.body);
    const item = await body.findByRole('menuitem', {
      name: 'Manage Contacts',
    });
    await userEvent.click(item);

    // Selecting an item closes the menu; end the story in that closed state.
    await waitFor(() =>
      expect(
        body.queryByRole('menuitem', { name: 'Manage Contacts' }),
      ).not.toBeInTheDocument(),
    );
  },
};

export const DisabledItem: Story = {
  render: () => <WorkspaceExample onSelect={fn()} />,
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
