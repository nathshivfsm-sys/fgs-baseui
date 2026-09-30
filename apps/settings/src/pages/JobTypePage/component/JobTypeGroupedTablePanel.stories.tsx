import type { Meta, StoryObj } from '@storybook/react-vite';
import { PLACEHOLDER_JOB_TYPE_GROUPS } from '../util';
import { JobTypeGroupedTablePanel } from './JobTypeGroupedTablePanel';

const meta = {
  title: 'Settings/JobType/GroupedTable',
  component: JobTypeGroupedTablePanel,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Job Type grouped grid (Figma node 2139:769): expandable rows, nested subcategory table, catalog toolbar.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="mx-auto flex max-w-[77rem] overflow-hidden rounded-xl border border-border bg-surface shadow-xs">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof JobTypeGroupedTablePanel>;

export default meta;

type Story = StoryObj<typeof meta>;

const handleAdd = () => undefined;
const handleEdit = () => undefined;

export const Default: Story = {
  args: {
    activeCount: 6,
    inactiveCount: 1,
    onAdd: handleAdd,
    onEdit: handleEdit,
    rows: PLACEHOLDER_JOB_TYPE_GROUPS,
    tableStatus: 'idle',
  },
};
