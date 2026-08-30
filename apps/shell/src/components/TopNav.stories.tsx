import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { MOCK_CURRENT_USER } from '../store/constants';
import { TopNav } from './TopNav';

/** Inline so the story never depends on the network for its avatar. */
const AVATAR_DATA_URI =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23f59e0b'/%3E%3Ccircle cx='16' cy='12' r='6' fill='%23fff'/%3E%3Ccircle cx='16' cy='30' r='11' fill='%23fff'/%3E%3C/svg%3E";

const meta = {
  title: 'Shell/TopNav',
  component: TopNav,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    currentUser: MOCK_CURRENT_USER,
    onOpenMobileSidebar: fn(),
    tenantId: 'northwind',
  },
} satisfies Meta<typeof TopNav>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // FR-9: the account menu has to be reachable without a pointer.
    const trigger = canvas.getByRole('button', { name: /Account menu/ });
    trigger.focus();
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard('{Enter}');

    const menu = within(document.body);
    await expect(await menu.findByText('Log out')).toBeVisible();
    await userEvent.keyboard('{Escape}');
  },
};

/** FR-8: initials stand in whenever `avatarUrl` is absent. */
export const InitialsFallback: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('AM')).toBeVisible();
  },
};

export const WithAvatarPhoto: Story = {
  args: {
    currentUser: { ...MOCK_CURRENT_USER, avatarUrl: AVATAR_DATA_URI },
  },
};

/** FR-7: the badge widens to a pill rather than clipping the numeral. */
export const OverflowingNotificationCount: Story = {
  args: { notificationCount: 128 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('99+')).toBeVisible();
    await expect(
      canvas.getByRole('button', { name: 'Notifications, 99+ unread' }),
    ).toBeInTheDocument();
  },
};

export const NoNotifications: Story = {
  args: { notificationCount: 0 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('button', { name: 'Notifications' }),
    ).toBeInTheDocument();
  },
};

/** FR-4: a long legal name truncates instead of pushing the search field out. */
export const LongTenantName: Story = {
  args: { tenantId: 'Graceful Heating & Plumbing Private Limited (Northwest)' },
};
