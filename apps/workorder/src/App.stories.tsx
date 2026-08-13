import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import {
  emptyLoader,
  errorLoader,
  pendingLoader,
  resolvedLoader,
  workorderFixtures,
} from '../../../.storybook/fixtures/feature-data';
import { withCmsRuntime } from '../../../.storybook/fixtures/runtime';
import { App, type Workorder } from './App';

const WorkorderStory = withCmsRuntime(App);
const refreshLoader = fn(resolvedLoader(workorderFixtures));

const meta = {
  title: 'Features/Work orders',
  component: WorkorderStory,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    storyTenantId: {
      name: 'Tenant',
      control: 'select',
      options: ['northwind', 'contoso'],
    },
    loadWorkorders: { table: { disable: true } },
  },
  args: {
    storyTenantId: 'northwind',
    loadWorkorders: resolvedLoader(workorderFixtures),
  },
} satisfies Meta<typeof WorkorderStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { loadWorkorders: refreshLoader },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByText('WO-1042');
    const initialCalls = refreshLoader.mock.calls.length;
    await userEvent.click(canvas.getByRole('button', { name: 'Refresh' }));
    await expect(refreshLoader).toHaveBeenCalledTimes(initialCalls + 1);
  },
};

export const ContosoTenant: Story = {
  args: {
    storyTenantId: 'contoso',
    loadWorkorders: resolvedLoader([
      { id: 'WO-2098', title: 'Inspect lift · contoso', status: 'In progress' },
    ]),
  },
};

export const Loading: Story = {
  args: { loadWorkorders: pendingLoader<Workorder>() },
};
export const Empty: Story = {
  args: { loadWorkorders: emptyLoader<Workorder>() },
};
export const Error: Story = {
  args: {
    loadWorkorders: errorLoader('The maintenance service is unavailable.'),
  },
};

export const CompactLayout: Story = {
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-sm">
        <Story />
      </div>
    ),
  ],
};
