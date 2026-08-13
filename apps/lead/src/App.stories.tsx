import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import {
  emptyLoader,
  errorLoader,
  leadFixtures,
  pendingLoader,
  resolvedLoader,
} from '../../../.storybook/fixtures/feature-data';
import { withCmsRuntime } from '../../../.storybook/fixtures/runtime';
import { App, type Lead } from './App';

const LeadStory = withCmsRuntime(App);
const refreshLoader = fn(resolvedLoader(leadFixtures));

const meta = {
  title: 'Features/Leads',
  component: LeadStory,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    storyTenantId: {
      name: 'Tenant',
      control: 'select',
      options: ['northwind', 'contoso'],
    },
    loadLeads: { table: { disable: true } },
  },
  args: {
    storyTenantId: 'northwind',
    loadLeads: resolvedLoader(leadFixtures),
  },
} satisfies Meta<typeof LeadStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { loadLeads: refreshLoader },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByText('Avery Stone · northwind');
    const initialCalls = refreshLoader.mock.calls.length;
    await userEvent.click(canvas.getByRole('button', { name: 'Refresh' }));
    await expect(refreshLoader).toHaveBeenCalledTimes(initialCalls + 1);
  },
};

export const ContosoTenant: Story = {
  args: {
    storyTenantId: 'contoso',
    loadLeads: resolvedLoader([
      { id: 'LD-310', name: 'Taylor Jordan · contoso', stage: 'Proposal' },
    ]),
  },
};

export const Loading: Story = {
  args: { loadLeads: pendingLoader<Lead>() },
};
export const Empty: Story = { args: { loadLeads: emptyLoader<Lead>() } };
export const Error: Story = {
  args: { loadLeads: errorLoader('The sales service is unavailable.') },
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
