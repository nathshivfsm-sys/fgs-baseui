import type { Meta, StoryObj } from '@storybook/react-vite';
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

export const Default: Story = {};
