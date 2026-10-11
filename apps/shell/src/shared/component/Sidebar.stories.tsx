import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { expect, userEvent, within } from 'storybook/test';
import { Sidebar } from './Sidebar';

/** The real shell owns the collapsed flag, so the round-trip needs a host. */
function CollapsibleSidebar({
  initialCollapsed,
  initialIconOnly = false,
}: {
  initialCollapsed: boolean;
  initialIconOnly?: boolean;
}) {
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const [iconOnly, setIconOnly] = useState(initialIconOnly);
  return (
    <Sidebar
      collapsed={collapsed}
      iconOnly={iconOnly}
      onToggleCollapse={() => setCollapsed((value) => !value)}
      onToggleIconOnly={() => setIconOnly((value) => !value)}
    />
  );
}

const meta = {
  title: 'Shell/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: { collapsed: false },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/today']}>
        <div className="flex h-screen">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof Sidebar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Expanded: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // FR-16: the label lost its "Jobs / " prefix.
    await expect(
      canvas.getByRole('link', { name: 'Work Orders' }),
    ).toBeVisible();
    // FR-15: the route in `initialEntries` is the active item.
    await expect(canvas.getByRole('link', { name: 'Today' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    // FR-17: section headers only exist in this state. "Sales" is used
    // throughout because it is the one section label no nav item repeats.
    await expect(canvas.getByText('Sales')).toBeVisible();
  },
};

export const Collapsed: Story = {
  render: () => <CollapsibleSidebar initialCollapsed={true} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // The rail keeps every label, stacked under its icon and free to wrap, so
    // each item stays self-describing without a tooltip.
    await expect(canvas.getByText('Dispatch Board')).toBeVisible();
    await expect(
      canvas.getByRole('link', { name: 'Dispatch Board' }),
    ).toBeVisible();
    // FR-22: section headers still give way to hairlines.
    await expect(canvas.queryByText('Sales')).not.toBeInTheDocument();
    await expect(
      canvas.getByRole('button', { name: 'Hide labels' }),
    ).toHaveAttribute('aria-pressed', 'true');
  },
};

/** Collapsed rail switches between stacked labels and icon-only tooltips. */
export const CollapsedLayoutToggle: Story = {
  render: () => <CollapsibleSidebar initialCollapsed={true} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Hide labels' }));
    await expect(canvas.getByText('Dispatch Board')).not.toBeInTheDocument();
    await expect(
      canvas.getByRole('link', { name: 'Dispatch Board' }),
    ).toHaveAttribute('title', 'Dispatch Board');

    await userEvent.click(canvas.getByRole('button', { name: 'Show labels' }));
    await expect(canvas.getByText('Dispatch Board')).toBeVisible();
  },
};

/** FR-18 / FR-24: the control round-trips and relabels in both directions. */
export const CollapseRoundTrip: Story = {
  render: () => <CollapsibleSidebar initialCollapsed={false} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByRole('button', { name: 'Collapse sidebar' }),
    );
    await expect(
      canvas.getByRole('button', { name: 'Expand sidebar' }),
    ).toBeVisible();
    await expect(canvas.queryByText('Sales')).not.toBeInTheDocument();

    await userEvent.click(
      canvas.getByRole('button', { name: 'Expand sidebar' }),
    );
    await expect(
      canvas.getByRole('button', { name: 'Collapse sidebar' }),
    ).toBeVisible();
    await expect(canvas.getByText('Sales')).toBeVisible();
  },
};

/** The mobile drawer always renders expanded and hides the collapse control. */
export const MobileDrawer: Story = {
  args: { showCollapseControl: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.queryByRole('button', { name: 'Collapse sidebar' }),
    ).not.toBeInTheDocument();
  },
};
